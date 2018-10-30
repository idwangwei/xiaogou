/**
 * Created by ZL on 2018/3/22.
 * 组装选择题
 */
import {Service, Inject, actionCreator} from '../module';
@Service('compositeStandaloneQuesService')
@Inject('$q', 'commonService', 'uuid4')
class compositeStandaloneQuesService {
    uuid4;

    /**
     * 得分点id
     */
    getScorePointId() {
        return this.uuid4.generate();
    }

    /**
     * 输入框id
     */
    getInputId() {
        return this.uuid4.generate();
    }

    /**
     * 题目的html内容
     * @param data
     * @returns {string}
     */
    compositeQuesHtml(data) {
        let imgHtml = '';
        let quesHtml = '<p>' + data.quesTitle + '  根据题目，应选择' + ' ' +
            '<input class="appTextarea input-area select-input-area square-select-input-area"' +
            'style="width: 40px; height: 30px;" id="' + data.inputId + '"' +
            'label="Q1">。</p>';

        if (data.img.length != 0) {
            imgHtml = '';
            angular.forEach(data.img, (v, k)=> {
                let imgId = data.img[k].uuid;
                let imgType = data.img[k].type;
                // let imgTypeArr = data.img[k].base64.match(/image\/(png)|image\/(jpg)|image\/(jpeg)/);
                // let imgType = imgTypeArr[1];
                // if (!imgTypeArr[1]) {
                //     imgType = imgTypeArr[2];
                // } else if (!imgTypeArr[2]) {
                //     imgType = imgTypeArr[3];
                // }
                imgHtml += '<p><span class="absolute-edit-area"' +
                    'style="display: block;text-align: center; min-width: 15px; min-height: 15px;padding: 10px 0 10px 0;position: relative;"' +
                    'contenteditable="false">' +
                    '<img class="img_big" style="max-width: 100%" src="' + imgId + '.' + imgType + '"></p>'
            })
        }
        let optionsHtml = '<p>&nbsp;</p>';
        angular.forEach(data.options, (v, k)=> {
            optionsHtml += '<p>' + String.fromCharCode(64 + parseInt(k + 1)) + '.&nbsp;&nbsp;' + data.options[k];
        });
        optionsHtml += '<p>&nbsp;</p>';


        let inputHtml = '<div class="layout-box"><div style="padding: 0 5px;">' + quesHtml + imgHtml + optionsHtml + '</div></div>';
        return inputHtml;

    }

    /**
     * 获取得分点
     */
    getScorePoints(data) {
        let selectItem = [];
        // let rightAnsIndex = 'A';
        data.options.forEach((item, k)=> {
            selectItem.push({expr: String.fromCharCode(64 + parseInt(k + 1))});
          /*  if (item == data.rightAns) {
                rightAnsIndex = String.fromCharCode(64 + parseInt(k + 1));
            }*/
        });
        let scorePointsInfo = {};
        scorePointsInfo.type = 'standalone';//选择题 题型
        scorePointsInfo.scorePoints = [{}];//目前只有一个得分点，只针对一个处理
        scorePointsInfo.scorePoints[0].label = "得分点1";
        scorePointsInfo.scorePoints[0].uuid = data.scorePointId; //得分点id
        scorePointsInfo.scorePoints[0].openStyle = 0; // 是否是开放型  1 是开放型， 0 普通的
        scorePointsInfo.scorePoints[0].referInputBoxes = [{
            label: "Q1",
            uuid: data.inputId,//输入框id
            info: {
                type: {
                    "name": "blank",
                    "val": "无边框"
                },
                selectItem: selectItem
            }
        }];
        scorePointsInfo.scorePoints[0].answerList = [{
            expr: data.rightAns,
            uuid: data.scorePointId //得分点id
        }]

        return [scorePointsInfo];

    }
}