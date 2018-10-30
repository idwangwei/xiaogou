/**
 * Created by ZL on 2018/3/19.
 */
import EXIF from 'exif-js/exif';
import _find from 'lodash.find';
import _ from 'underscore'
import {Inject, View, Directive, select} from '../../module';

@View('add_question', {
    url: '/add_question',
    cache: false,
    template: require('./page.html'),
    styles: require('./style.less'),
    controllerAs: 'addCtrl',
    inject: ['$scope'
        , '$state'
        , '$ionicScrollDelegate'
        , '$rootScope'
        , '$ngRedux'
        , "$timeout"
        , '$ionicModal'
        , 'commonService'
        , 'uuid4'
        , 'personalQBService'
        , 'compositeStandaloneQuesService'
        , '$ionicPopup'
        , '$ionicActionSheet']
})
class addQuestionCtrl {
    $timeout;
    $ionicModal;
    commonService;
    personalQBService;
    uuid4;
    compositeStandaloneQuesService;
    $ionicPopup;
    $ionicActionSheet;

    // @select(state=>state.book_type_list) textbooks;
    @select(state=>state.wl_selected_clazz) currentClazz;
    @select(state=>state.select_ques_info) selectQuesInfo;
    @select(state=>state.select_book_info) selectBookInfo;
    @select(state=>state.profile_user_auth.user) user;
    @select(state=>state.edit_ques_info.quesTitle) quesTitle;
    @select(state=>state.edit_ques_info.imageList) imageList;
    @select(state=>state.edit_ques_info.quesRightAns) quesRightAns;
    // @select(state=>state.edit_ques_info.quesWrongAns) quesWrongAns;
    @select(state=>state.edit_ques_info.quesOptionsAns) quesOptionsAns;

    quesType = '选择题';
    showQuesTypeOptionsFlag = false;
    showDifficultyLevelOptionsFlag = false;
    Modal = {};
    ModalUnit = {};
    ModalKnowledge = {};
    initCtrl = false;
    // imageList = [];
    displayImageList = [];
    gradeSubTags = [];
    getGradeInfoFlage = false;
    difficultyLevels = [
        {name: '基础', level: '基础', value: 1},
        {name: '变式', level: '变式', value: 41},
        {name: '拓展', level: '拓展', value: 71},
    ];
    quesTypeOptions = [
        {name: '选择题（单选）', value: '选择题'}
    ];
    difficultyLevel = 0;
    loading = false;
    htmlInputId = this.compositeStandaloneQuesService.getInputId();
    htmlScorepointqbuid = this.compositeStandaloneQuesService.getInputId();
    htmlScorepointid = this.compositeStandaloneQuesService.getInputId();

    // quesRightAns = '';
    // quesWrongAns = ['', '', ''];
    // quesOptionsAns = ['','','',''];
    optionsIndexs = ['A', 'B', 'C', 'D'];
    isShowSelectBorad = false;

    constructor() {
        this.initModal();
    }

    initData() {
        this.maxImgLength = 200 * 1024;
        this.CLASS_NAME = {
            BROWSE_FILE: 'uploadImg1' //选择文件input对应的ID
        };
        this.gradeTextArr = [
            '一年级上册', '一年级下册',
            '二年级上册', '二年级下册',
            '三年级上册', '三年级下册',
            '四年级上册', '四年级下册',
            '五年级上册', '五年级下册',
            '六年级上册', '六年级下册',
        ];

    }

    onAfterEnterView() {
        this.initData();
        this.addChangeEvent();
        if (this.selectQuesInfo && this.selectQuesInfo.difficulty) {
            this.difficultyLevel = this.selectQuesInfo.difficulty.value;
        }

    }

    /**
     * 获取默认难度
     */
    getDefaultDifficultyLevel() {
        if (!this.selectQuesInfo || this.selectQuesInfo && !this.selectQuesInfo.difficulty) return '';
        if (this.selectQuesInfo.difficulty.value == 1) return 0;
        if (this.selectQuesInfo.difficulty.value == 41) return 1;
        if (this.selectQuesInfo.difficulty.value == 71) return 2;
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
        if (!this.initCtrl) {
            this.initCtrl = true;
            this.initModal();
            // currentClazz
            let textbookArr = this.currentClazz.teachingMaterial.split('-');
            let textbook = {
                text: textbookArr[1],
                code: textbookArr[0]
            };
            let gradeSeq = Number(this.currentClazz.grade);
            let grade = {
                seq: gradeSeq - 1,
                text: this.gradeTextArr[gradeSeq - 1]
            };
            if (!this.selectQuesInfo.textbook || !this.selectQuesInfo.grade) {
                this.personalQBService.selectTextbook(textbook, grade);
            }
            this.personalQBService.getTextbooksList(this.getTextbookCallBack.bind(this));

            /* if (!this.quesWrongAns) {
             this.quesWrongAns = ['', '', ''];
             this.personalQBService.saveQuesOptions(this.quesRightAns, this.quesWrongAns);
             }*/
            if (!this.quesOptionsAns) {
                this.quesOptionsAns = ['', '', '', ''];
                this.personalQBService.saveQuesOptions(this.quesRightAns, this.quesOptionsAns);
            }

            if (!this.imageList) {
                this.imageList = [];
                this.personalQBService.saveQuesImgList(this.imageList);
            }
            if (this.imageList && this.imageList.length != 0) {
                this.displayImageList = this.commonService.getRowColArray(this.imageList, 2);
            } else {
                this.displayImageList = [];
            }
        }
    }

    getTextbookCallBack(data) {

        if (data) {
            this.textbooks = data;
        } else {
            this.textbooks = [];
        }
    }


    back() {
        this.go('my_question_bank');
    }

    /**
     * 保存题干到本地
     */
    saveQuesTitle() {
        this.personalQBService.saveQuesTitle(this.quesTitle);
    }

    /**
     * 保存选项
     */
    saveAnsOptions() {
        this.personalQBService.saveQuesOptions(this.quesRightAns, this.quesOptionsAns);
    };

    saveRightAnsOptions = (quesRightAns)=> {
        this.quesRightAns = quesRightAns;
        this.personalQBService.saveQuesOptions(quesRightAns, this.quesOptionsAns);
    };


    showQuesTypeOptions($event) {
        if (typeof $event === 'object' && $event.stopPropagation) {
            $event.stopPropagation();
        } else if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        if (this.showQuesTypeOptionsFlag) {
            this.hideQuesTypeOption();
            return;
        }
        this.showQuesTypeOptionsFlag = true;
        $('.ques_type_options').show();
        this.$timeout(()=> {
            $('.ques_type_options').css('height', '80px')
        }, 100)
    }

    hideQuesTypeOption() {
        this.showQuesTypeOptionsFlag = false;
        $('.ques_type_options').hide();
        $('.ques_type_options').css('height', '5px')
    }

    isMobile() {
        return this.getScope().platform.isMobile(); //非移动端设备不显示
    }


    initModal() {
        //初始化modal页
        this.$ionicModal.fromTemplateUrl('textbookSelect.html', {
            scope: this.getScope(),
            animation: 'slide-in-up'
        }).then(modal=> this.Modal = modal);
        this.getScope().$on('$destroy', ()=> {
            this.Modal.remove()
        })

        //unitSelect.html
        this.$ionicModal.fromTemplateUrl('unitSelect.html', {
            scope: this.getScope(),
            animation: 'slide-in-up'
        }).then(modal=> this.ModalUnit = modal);
        this.getScope().$on('$destroy', ()=> {
            this.ModalUnit.remove()
        });

        //knowledgeSelect.html
        this.$ionicModal.fromTemplateUrl('knowledgeSelect.html', {
            scope: this.getScope(),
            animation: 'slide-in-up'
        }).then(modal=> this.ModalKnowledge = modal);
        this.getScope().$on('$destroy', ()=> {
            this.ModalKnowledge.remove()
        })
    }

    /**
     * 选择教材,根据该教材ID,获取教材下所有的章节和单元
     * @param data
     */
    selectCurrentTextbook(data, version) {
        this.textbook = data;
        if (this.selectBookInfo && this.selectBookInfo.length > 0
            && this.selectQuesInfo.textbook
            && (this.selectQuesInfo.textbook.code != version.code || this.selectQuesInfo.grade.seq != data.seq)) {
            // this.getUnitAndChapterBytextbook();
            this.gradeSubTags.length = 0;
        }
        this.personalQBService.selectTextbook(version, data);
        this.closeModal();
    }

    /**
     * 显示当前章节下的单元
     * @param unit
     * @param ev
     */
    clickUnit(unit, ev) {
        unit.isOpened = !unit.isOpened;
        if (!unit.isOpened) {
            return
        }
        unit.retFlag = false;
        $(ev.target).find('span').toggleClass('ion-chevron-down').toggleClass('ion-chevron-right');
    }

    /**
     * 选择课时
     */
    selectLesson(unit, chapter) {
        // this.lessonInfo = chapter;
        this.personalQBService.selectChapterUnit(unit, chapter);
        this.closeModalUnit();
    }

    openModal = ()=> this.Modal.show();//打开教材选择modal
    closeModal = ()=> this.Modal.hide();//关闭教材modal

    // openModalUnit = ()=> this.ModalUnit.show();//打开教材选择modal
    closeModalUnit = ()=> this.ModalUnit.hide();//关闭教材modal
    openModalUnit() { //打开教材选择modal
        if (!this.selectQuesInfo.textbook || !this.selectQuesInfo.grade) {
            this.commonService.alertDialog('请先选择教材和年级');
            return;
        }
        this.ModalUnit.show();
        if (!this.gradeSubTags || this.gradeSubTags && this.gradeSubTags.length == 0) {
            this.getUnitsInfo();
        }

    }


    openModalKnowledge() {
        if (!this.selectQuesInfo.textbook || !this.selectQuesInfo.grade) {
            this.commonService.alertDialog('请先选择教材和年级');
            return;
        }
        if (!this.selectQuesInfo.unit || !this.selectQuesInfo.chapter) {
            this.commonService.alertDialog('请先选择单元和课时');
            return;
        }
        if (!this.selectBookInfo || this.selectBookInfo && this.selectBookInfo.length == 0) {
            this.getUnitsInfo(this.getKnowledgeByChapter);
        } else {
            this.getKnowledgeByChapter();
        }
        this.ModalKnowledge.show();
    }//打开教材选择modal
    closeModalKnowledge = ()=> this.ModalKnowledge.hide();//关闭教材modal

    getUnitsInfo(callBack) {
        this.getGradeInfoFlage = false;
        this.personalQBService.getUnitInfo(this.selectQuesInfo.textbook.code, this.selectQuesInfo.grade.seq + 1)
            .then((data)=> {
                if (data) {
                    this.getUnitAndChapterBytextbook();
                } else {
                    this.getGradeInfoFlage = true;
                }
                if (callBack) {
                    callBack.call(this, this.getGradeInfoFlage);
                }
            })
    }

    /**
     * 根据选择的教材和年级 筛选出单元和课时
     */
    getUnitAndChapterBytextbook() {
        angular.forEach(this.selectBookInfo, (v, k)=> {
            if (this.selectBookInfo[k].code == this.selectQuesInfo.textbook.code) {
                angular.forEach(this.selectBookInfo[k].subTags, (v1, k1)=> {
                    if (this.selectBookInfo[k].subTags[k1].seq == this.selectQuesInfo.grade.seq) {
                        this.gradeSubTags = this.selectBookInfo[k].subTags[k1];
                    }
                })
            }
        })

    }

    /**
     * 根据选择的单元课时 筛选出知识点
     */
    getKnowledgeByChapter(flag) {
        if (flag) {
            this.commonService.alertDialog('请先选择单元和课时');
            return;
        }
        angular.forEach(this.selectBookInfo[0].subTags[0].subTags, (v, k)=> {
            if (v.id == this.selectQuesInfo.unit.id) {
                angular.forEach(this.selectBookInfo[0].subTags[0].subTags[k].subTags, (v1, k1)=> {
                    if (v1.id == this.selectQuesInfo.chapter.id) {
                        this.lessonInfo = this.selectBookInfo[0].subTags[0].subTags[k].subTags[k1];
                    }
                })
            }
        })
    }

    /**
     * 选择知识点
     */
    selectKnowledgePoint(knowledges, item) {
        this.closeModalKnowledge();
        this.personalQBService.selectKnowledgePoint(item);
    }

    /**********************图片处理***************************/
    addChangeEvent() {
        var me = this;
        $('#' + this.CLASS_NAME.BROWSE_FILE).on('change', function (ev) {
            if (me.imageList.length >= 2 || (me.imageList.length + this.files.length) > 2) {
                me.commonService.showAlert('提示', '最多只能上传2张图片！');
                return;
            }
            var img = ev.currentTarget;
            var files = [].slice.call(this.files);
            var acceptFileTypes = ['jpg', 'jpeg', 'png']; //可接受的文件类型

            //检查文件的合法性
            var allValid = true;
            files.forEach((file)=> {
                var has = false;
                acceptFileTypes.forEach(function (fileType) {
                    if (file.type.indexOf(fileType) != -1) {
                        has = true;
                    }
                });
                if (!has) {
                    allValid = false
                }
            });
            if (!allValid)
                return me.commonService.showAlert('提示', '请选择正确的文件格式！.jpg或.jpeg或.png文件');


            function readTypeAndBase64(data) {
                var type = '', content = '';
                data.replace(/image\/(.+?);/, function (match, $1) {
                    type = $1;
                });
                data.replace(/base64,(.+)/, function (match, $1) {
                    content = $1;
                });
                return {
                    type: type,
                    content: content
                }
            }

            //读取文件
            files.forEach((file)=> {
                if ((file.size / 1024) > 1024 * 3) {
                    me.commonService.alertDialog('图片过大，请传小于2M的图片');
                    return;
                }
                var fileReader = new FileReader(file);
                fileReader.onloadend = function (ev) {
                    let src = ev.currentTarget.result;
                    EXIF.getData(file, function () {
                        EXIF.getAllTags(this);
                        var image = {};
                        image.id = me.uuid4.generate();
                        image.src = src;
                        image.width = EXIF.getTag(this, 'ImageWidth');
                        image.height = EXIF.getTag(this, 'ImageHeight');
                        var info = readTypeAndBase64(image.src);
                        image.type = info.type;
                        image.data = info.content;
                        image.file = file;

                        me.getScope().$apply(function () {
                            compress.call(me, image);
                        });
                    });
                };
                fileReader.readAsDataURL(file);

                /* if ((file.size / 1024) > 1024 * 2) {
                 me.commonService.alertDialog('请传小于2M的图片');
                 return;
                 }
                 var fileReader = new FileReader(file);
                 fileReader.onloadend = function (ev) {
                 var image = {};
                 image.id = me.uuid4.generate();
                 image.src = ev.currentTarget.result;
                 //image.data = imageData;
                 var info = readTypeAndBase64(image.src);
                 image.type = info.type;
                 image.data = info.content;
                 me.getScope().$apply(function () {
                 me.imageList.push(image);
                 me.displayImageList = me.commonService.getRowColArray(me.imageList, 2);
                 me.personalQBService.saveQuesImgList(me.imageList);
                 });
                 };
                 fileReader.readAsDataURL(file);*/

            });

            /**
             * 压缩图片
             * @param srcImg
             * @returns {string|String}
             */
            function compress(srcImg) {
                let me = this;
                let imgLen = me.getBase64ImgLength(srcImg.src);
                var img = new Image();
                img.src = srcImg.src;
                img.onload = function () {
                    srcImg.width = this.width;
                    srcImg.height = this.height;
                    if (imgLen <= me.maxImgLength) {
                        // me.displayImageList.push(srcImg);
                        // me.formImgList.push(srcImg);
                        // me.imageList.push(srcImg);
                        me.imageList.push(srcImg);
                        me.displayImageList = me.commonService.getRowColArray(me.imageList, 2);
                        me.$timeout(function () {
                        }, 0);
                        return;
                    }
                    var width = srcImg.width;
                    var height = srcImg.height;
                    var canvas = document.getElementById("myCanvas");
                    var ctx = canvas.getContext('2d');
                    canvas.width = width;
                    canvas.height = height;

                    // 铺底色
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, width, height);

                    //进行最小压缩
                    /* let scalSize = 1;
                     if ((srcImg.file.size / 1024) > 1024 * 2) {
                     scalSize = (1024 * 1024 * 2 / srcImg.file.size).toFixed(1);
                     }*/
                    let ndata = '';
                    // if ((srcImg.file.size / 1024) > 1024 / 2) {
                    //     ndata = canvas.toDataURL("image/" + srcImg.type, 0.2);
                    // } else {
                    //     ndata = canvas.toDataURL("image/" + srcImg.type, 0.92);
                    // }
                    ndata = canvas.toDataURL("image/" + srcImg.type, 0.2);
                    canvas.width = 0;
                    canvas.height = 0;
                    srcImg.src = ndata;
                    srcImg.data = ndata.split(",")[1];
                    // me.displayImageList.push(srcImg);
                    // me.formImgList.push(srcImg);
                    // me.imageList.push(srcImg);

                    me.imageList.push(srcImg);
                    me.displayImageList = me.commonService.getRowColArray(me.imageList, 2);

                    me.$timeout(function () {
                    }, 0);
                };
            }
        })
    }

    /**
     * 获取base64格式图片的大小
     * @param imgData
     * @returns {Number}
     */
    getBase64ImgLength(imgData) {
        //需要计算文件流大小，首先把头部的data:image/png;base64,（注意有逗号）去掉。
        let dataStr = imgData.substring(22);
        //找到等号，把等号也去掉
        var equalIndex = dataStr.indexOf('=');
        if (dataStr.indexOf('=') > 0) {
            dataStr = dataStr.substring(0, equalIndex);
        }

        //Base64要求把每三个8Bit的字节转换为四个6Bit的字节（3*8 = 4*6 = 24），
        // 然后把6Bit再添两位高位0，组成四个8Bit的字节，也就是说，转换后的字符串理论上将要比原来的长1/3。
        let strLength = parseInt(dataStr.length * 3 / 4);
        return strLength;
    }

    /*browsePhoto() {
     let me = this;
     if (this.getScope().platform.isMobile() && navigator.camera) {
     navigator.camera.getPicture(
     (imageData) => {
     this.getScope().$apply(function () {
     var image = {};
     image.id = this.uuid4.generate();
     image.src = "data:image/jpeg;base64," + imageData;
     image.data = imageData;
     this.imageList.push(image);
     this.displayImageList = this.commonService.getRowColArray(this.imageList, 2);
     });
     },
     () => {
     },
     {
     quality: 50,
     destinationType: this.destinationType.DATA_URL,
     sourceType: this.pictureSource.PHOTOLIBRARY
     }
     );
     }
     }*/

    deleteImg(imgId) {
        var index = null;
        this.imageList.forEach(function (img, idx) {
            if (imgId == img.id) {
                index = idx
            }
        });
        if (index !== null) {
            this.imageList.splice(index, index + 1);
            if (this.imageList.length == 0) {
                this.displayImageList.length = 0;
            } else {
                this.displayImageList = this.commonService.getRowColArray(this.imageList, 2);
            }
            this.personalQBService.saveQuesImgList(this.imageList);
        }
    }

    /**
     * 选择难度
     * @param level
     */
    selectDifficultyLevel = (value, selectOption) => {
        // this.selectOption = selectOption;
        this.personalQBService.selectDifficultyLevel(selectOption);
    };

    submitQues() {
        let passFlag = this.checkQuesInfo();
        if (!passFlag) return;

        var refuseConfirm = this.$ionicPopup.show({ // 调用$ionicPopup弹出定制弹出框
            template: '<p>&nbsp;&nbsp;&nbsp;&nbsp;本题上传成功后，返回可布置给学生。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;一旦上传成功，该题不可修改，是否要上传？</p>',
            title: "组卷练习",
            buttons: [
                {
                    text: "<b>确定</b>",
                    type: "button-positive",
                    onTap: e => {
                        return true;
                    }
                },
                {
                    text: "取消",
                    type: "",
                    onTap: function (e) {
                        return false;
                    }
                }

            ]
        });
        refuseConfirm.then(res => {
            if (res) {
                this.submitQuesData();
            }
        });
    }

    submitQuesData() {
        let basic = {
            difficulty: this.difficultyLevel,
            type: 'options',
            typeName: this.quesType,
            tags: [this.selectQuesInfo.knowledge.id]
        };

        let config = this.getQuesConfig();

        let question = this.compositeStandaloneQuesService.compositeQuesHtml(config);
        let scorePoints = this.compositeStandaloneQuesService.getScorePoints(config);
        let params = {
            basic: JSON.stringify(basic),
            question: question,
            scorePoints: JSON.stringify(scorePoints),
            userId: this.user.userId
        };
        if (config.img && config.img.length != 0) {
            params.img = JSON.stringify(config.img);
        }
        this.loading = false;
        this.getRootScope().showSubmitLoading = true;
        this.personalQBService.addQuestionForTeacherLib(params).then((data)=> {
            if (data) {
                this.commonService.alertDialog('上传成功');
                this.personalQBService.clearSelectQuesInfo();
                this.personalQBService.clearEditQuesInfo();
                this.go('my_question_bank');
                this.loading = true;
                this.$timeout(()=> {
                    this.getRootScope().showSubmitLoading = false;
                }, 1000);
            } else {
                this.commonService.alertDialog('上传失败');
                this.getRootScope().showSubmitLoading = false;
            }
        });
    }

    getQuesConfig() {
        let config = {
            quesTitle: '',
            scorePointId: '',
            inputId: '',
            img: '',
            options: '',
            rightAns: ''
        };

        let imgs = this.getImgsConfig();
        if (imgs.length > 0) {
            config.img = imgs;
        }
        config.quesTitle = this.quesTitle;
        config.scorePointId = this.compositeStandaloneQuesService.getScorePointId();
        config.inputId = this.compositeStandaloneQuesService.getInputId();

        let allOpstions = [];
        angular.forEach(this.quesOptionsAns, (v, k)=> {
            if (v != '' && v != undefined) {
                allOpstions.push(v);
            }
        });
        config.options = allOpstions;

        /*config.options = config.options.concat(this.wrongAnsArr);
         let roundIndex = Math.floor(Math.random() * 10) % (this.wrongAnsArr.length + 1);
         config.options.splice(roundIndex, 0, this.quesRightAns);*/

        config.rightAns = this.quesRightAns;//String.fromCharCode(64 + parseInt(roundIndex + 1));
        return config;
    }

    getImgsConfig() {
        let imgs = [];
        angular.forEach(this.imageList, (v, k)=> {
            /* imgs.push({
             key: 'img',
             value: JSON.stringify([{
             uuid: v.id,
             base64: v.src
             }]),
             name: v.id + '.' + v.type
             })*/
            imgs.push({
                uuid: v.id,
                base64: v.src,
                type: v.type
            })

        });
        return imgs;
    }

    checkQuesInfo() {
        if (!this.quesTitle) {//没有输入题目
            this.commonService.alertDialog('请输入题目');
            return false;
        }
        if (!this.quesRightAns) {
            this.commonService.alertDialog('请输入正确答案的选项');
            return false;
        }
        this.allOptions = [];
        let optionsMarks = [];
        angular.forEach(this.quesOptionsAns, (v, k)=> {
            if (v != '' && v != undefined) {
                this.allOptions.push(v);
                optionsMarks.push(k)
            }
        });
        if (this.quesOptionsAns.length == 0) {
            this.commonService.alertDialog('请输入选项');
            return false;
        }
        if (optionsMarks.length == 3 && !_.every(optionsMarks, function (n) {
                return n == 0 || n == 1 || n == 2;
            })) {
            this.commonService.alertDialog('请按顺序将选项补充完整');
            return false;
        }
        if (optionsMarks.length == 2 && !_.every(optionsMarks, function (n) {
                return n == 0 || n == 1;
            })) {
            this.commonService.alertDialog('请按顺序将选项补充完整');
            return false;
        }
        if (optionsMarks.length == 1 && !_.every(optionsMarks, function (n) {
                return n == 0;
            })) {
            this.commonService.alertDialog('请按顺序将选项补充完整');
            return false;
        }

        if (this.quesRightAns > String.fromCharCode(64 + parseInt(optionsMarks.length))) {
            this.commonService.alertDialog('您输入的正确答案不在选项内，请重新设置');
            return false;
        }
        if (!this.selectQuesInfo.textbook || !this.selectQuesInfo.grade) {
            this.commonService.alertDialog('请选择教材版本');
            return false;
        }
        if (!this.selectQuesInfo.unit || !this.selectQuesInfo.chapter) {
            this.commonService.alertDialog('请选择单元和课时');
            return false;
        }
        if (!this.selectQuesInfo.knowledge) {
            this.commonService.alertDialog('请选择知识点');
            return false;
        }
        if (!this.difficultyLevel) {
            this.commonService.alertDialog('请选择难度');
            return false;
        }
        return true;
    }

    valueCheck() {
        if (!this.quesTitle) return;
        this.quesTitle = this.quesTitle.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
    }

    rightAnsValueCheck() {
        if (!this.quesRightAns) return;
        this.quesRightAns = this.quesRightAns.slice(0, 1);
        let ansArr = this.quesRightAns.match(/[a-dA-D]/);
        if (!ansArr) {
            this.quesRightAns = '';
        } else {
            this.quesRightAns = ansArr[0].toUpperCase();
        }
    }

    showAppKeyBoradForSelect() {
        let elem = $('#' + this.htmlInputId);
        this.getRootScope().$broadcast('keyboard.show', {
            ele: elem,
            selectItemList: ['A', 'B', 'C', 'D'],
        });
    }

    showSelectBorad(event) {
        if (typeof $event === 'object' && $event.stopPropagation) {
            $event.stopPropagation();
        } else if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        ;
        this.isShowSelectBorad = true;
        /*  this.$ionicActionSheet.show({
         buttons: [
         {text: 'A'},
         {text: 'B'},
         {text: 'C'},
         {text: 'D'},
         ],
         destructiveText: '删除',
         cancelText: '取消',
         buttonClicked: (index)=> {
         if (index == 0) {

         } else if (index == 1) {

         } else if (index == 2) {

         } else if (index == 3) {

         }
         }
         })*/
    }

    rotateSelectImg(index, event) {
        let me = this;
        let image = this.displayImageList[0][index];
        if (!image.file) {
            image.file = event.currentTarget;
        }
        EXIF.getData(image.file, function () {
            let orientation = EXIF.getTag(this, 'Orientation'); //获取图片的方向
            console.log(orientation);
            image.src = me.rotateImg(image.src, "left");
            me.displayImageList[0][index] = image;
            me.imageList[index] = image;
        });
    }

    /**
     * 旋转图片
     * @param img
     * @param direction 图片要旋转的方向（left|right）
     * @param canvas
     */
    rotateImg(imgSrc, direction) {
        let canvas = document.getElementById("myCanvas");
        //最小与最大旋转方向，图片旋转4次后回到原方向
        var min_step = 0;
        var max_step = 3;
        if (imgSrc == null)return;
        let img = new Image();
        img.src = imgSrc;
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错
        var height = img.height;
        var width = img.width;
        var step = 2;
        if (step == null) {
            step = min_step;
        }
        if (direction == 'right') {
            step++;
            //旋转到原位置，即超过最大值
            step > max_step && (step = min_step);
        } else {
            step--;
            step < min_step && (step = max_step);
        }
        //旋转角度以弧度值为参数
        var degree = step * 90 * Math.PI / 180;
        var ctx = canvas.getContext('2d');
        switch (step) {
            case 0:
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0);
                break;
            case 1:
                canvas.width = height;
                canvas.height = width;
                ctx.rotate(degree);
                ctx.drawImage(img, 0, -height);
                break;
            case 2:
                canvas.width = width;
                canvas.height = height;
                ctx.rotate(degree);
                ctx.drawImage(img, -width, -height);
                break;
            case 3:
                canvas.width = height;
                canvas.height = width;
                ctx.rotate(degree);
                ctx.drawImage(img, -width, 0);
                break;
        }

        let ndata = canvas.toDataURL("image/jpeg", 0.8);
        canvas.width = 0;
        canvas.height = 0;
        return ndata;
    }

    /**
     * 取消提交请求
     */
    cancelSubmitQues = ()=> {
        // this.personalQBService.cancelSubmitQuesRequest.forEach((cancelDefer)=> {
        //     cancelDefer.resolve(true);
        // });
    }

}
export default addQuestionCtrl;