/**
 * Created by 彭建伦
 * 游戏库选择游戏
 */
import _find from 'lodash.find';
import {Inject, View, Directive, select} from '../../module';
@View('game_lib', {
    url: '/game_lib',
    styles: require('./style.less'),
    template: require('./game_repo.html'),
    inject: ["$scope", "$ngRedux", "$rootScope", "$ionicModal", '$ionicHistory', "gameRepoService", "$state"]
})
class GameLibCtrl {
    $state;
    $scope;
    $ngRedux;
    $rootScope;
    $ionicModal;
    $ionicHistory;
    gameRepoService;

    @select(state=>state.gr_textbooks) gr_textbooks;
    @select(state=>state.gl_selected_clazz) gl_selected_clazz;
    @select(state=>state.gr_selected_textbook) gr_selected_textbook;
    @select(state=>state.gr_textbook_detail_map) gr_textbook_detail_map;
    @select(state=>state.gr_fetch_textbook_processing) gr_fetch_textbook_processing;
    @select(state=>state.gr_fetch_textbooks_processing) gr_fetch_textbooks_processing;

    initCtrl = false;
    initTextbookDetail = false;
    textbookSelectModal = {};//教材列表弹出框
    hasNoGameMsg = '';
    openNodeArr = [];

    constructor() {
        this.initTextbookSelectModal();


    }

    onReceiveProps() {
        this.ensureTextbooks();
        this.ensureSelectedTextbook();
        this.ensureTextbookDetail();
    }

    onBeforeEnterView() {
        this.initCtrl = false;
        this.initTextbookDetail = false;
    }

    back() {
        this.go('home.pub_game_list');
    }

    /**
     * 初始化教材选择的modal
     */
    initTextbookSelectModal() {
        this.$ionicModal.fromTemplateUrl('gameLab.html', {  //初始化新建教材标签model
            animation: 'slide-in-up',
            scope: this.getScope()
        }).then(modal=> this.textbookSelectModal = modal);
    };


    /**
     * 加载教材列表
     */
    ensureTextbooks() {
        if (!this.initCtrl && !this.gr_fetch_textbooks_processing) {
            this.initCtrl = true;
            this.gameRepoService.fetchTextbooks().then((data)=> {
                if (data.code == 2015) {
                    this.hasNoGameMsg = data.msg
                }
            });
        }
    }

    /**
     * 默认选中上次已经选择的教材，如果没有则默认选择教材列表的第一个
     */
    ensureSelectedTextbook() {
        //如果没有选择教材,则选择
        if (this.hasTextbooks() && !this.hasSelectedTextbook()) {
            this.gameRepoService.selectTextBook(_find(this.gr_textbooks, (v)=> {
                return v.type.match(this.gl_selected_clazz.type)
            }));
        }
    }

    /**
     * 加载教材详情
     */
    ensureTextbookDetail() {
        if (this.hasTextbooks()
            && this.hasSelectedTextbook()
            && !this.gr_fetch_textbook_processing
            && !this.initTextbookDetail
        ) {
            this.initTextbookDetail = true;
            this.gameRepoService.fetchTextbookDetail(this.gr_selected_textbook.id)
                .then(()=> {
                    //每次刷列表，每一个单元使用上次的展开flag
                    let nodeArr = this.gr_textbook_detail_map[this.gr_selected_textbook.id];
                    nodeArr.forEach((item)=> {
                        console.log(item.id);
                        if (this.openNodeArr.indexOf(item.id) != -1) {
                            item.isOpened = true;
                        }
                    })
                });
        }
    }

    /**
     * 判断教材列表是否存在
     * @returns {boolean}
     */
    hasTextbooks() {
        return this.gr_textbooks ? !!this.gr_textbooks.length : false;
    }

    /**
     * 判断是否有选中的教材
     * @returns {boolean}
     */
    hasSelectedTextbook() {

        return !!(this.gr_selected_textbook && this.gr_selected_textbook.id
        && this.gr_selected_textbook.type.match(this.gl_selected_clazz.type)
        && _find(this.gr_textbooks, {id: this.gr_selected_textbook.id}))

    }

    selectChapterAnd2GameList(chapter, parentSeq) {
        chapter.isFirst = chapter.seq === 1 && parentSeq === 1;
        this.gameRepoService.selectChapter(chapter);
        this.go('chapter_game_list');
    }

    openOrCloseTreeNode(node) {
        node.isOpened = !node.isOpened;
        let index = this.openNodeArr.indexOf(node.id);

        if (index == -1 && node.isOpened) {
            this.openNodeArr.push(node.id);
        } else if (index != -1 && !node.isOpened) {
            index != -1 && this.openNodeArr.splice(index, 1);
        }
    }

    /**
     * 点击教材弹出框，选择当前教材
     * @param textbook
     */
    chooseTextbook(textbook) {
        this.gameRepoService.selectTextBook(textbook);
        this.gameRepoService.fetchTextbookDetail(this.gr_selected_textbook.id);
        this.openNodeArr.length = 0;
    }


}

export default GameLibCtrl;
