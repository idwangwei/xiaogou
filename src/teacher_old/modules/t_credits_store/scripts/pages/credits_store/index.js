/**
 * Created by ZL on 2017/11/6.
 */
import {Inject, View, Directive, select} from '../../module';

@View('credits_store', {
    url: 'credits_store/:fromUrl',
    styles: require('./style.less'),
    template: require('./page.html'),
    inject: ['$scope',
        '$state',
        '$rootScope',
        '$stateParams',
        '$ngRedux',
        '$ionicHistory',
        '$ionicLoading',
        '$ionicPopup',
        '$timeout',
        'commonService',
        'creditsStoreService'
    ]
})
class creditsStoreCtrl {
    commonService;
    $ionicPopup;
    $timeout;
    creditsStoreService;
    loading = true;
    sortType = 'asc';
    canSort = true;
    sortFlag = false;
    moreFlag = true;
    sortSelectOptions = {
        desc: {name: '价格由高到低排序'},
        asc: {name: '价格由低到高排序'}
    };

    @select(state=>state.profile_user_auth.user.name) userName;
    @select(state=>state.credits_goods_list.hotSellGoods) hotGoodsList;
    @select(state=>state.credits_goods_list.goods) goodsList;
    @select(state=>state.credits_goods_list.lastKey) lastKey;
    @select(state=>state.credits_goods_list.count) lquesCount;
    @select(state=>state.teacher_credits_detail) currentCredits;

    constructor() {


    }

    initData() {
        if (!this.goodsList) this.goodsList = [];
        if (!this.hotGoodsList) this.hotGoodsList = [];
        this.initCtrl = false;
        this.moreFlag = true;
        this.sortType = this.creditsStoreService.sortType || 'asc';
    }

    onAfterEnterView() {
        this.initData();
    }

    onBeforeEnterView() {
    }

    onReceiveProps() {
        this.ensurePageData();
    }

    ensurePageData() {
        if (!this.initCtrl) {
            this.creditsStoreService.getAllGoodsList(this.sortType, true);//获取商品列表
            this.initCtrl = true;
        }

    }

    back() {
        /*mark 修改路由*/
        if (this.$ionicHistory.backView() !== null) {
            this.$ionicHistory.goBack()
        } else {
            if (this.$stateParams.fromUrl === 'home.me') {
                this.go('home.me')
            } else {
                this.go('home.work_list');
            }
        }
    }

    gotoExchangeGoods(item) {
        //查询订单
        this.creditsStoreService.getCreditsOrder(item.id).then((data)=> {
            if (data && data.code == 200) {
                if (data.result && data.result.orderId) {
                    item.isOrder = true;
                    item.orderInfo = data.result;
                } else {
                    item.isOrder = false;
                    item.orderInfo = undefined;
                }
            }
            this.creditsStoreService.selectCreditsGoods(item);
            this.go('credits_exchange_goods');
        })

    }

    gotoCreditsRecord() {
        this.go('credits_list');
    }

    gotoTaskList() {
        this.go('task_progress', {fromUrl: 'credits_store'});
    }

    /**
     * 下拉刷新
     */
    pullRefresh() {
        if (!this.loading) return;
        this.loading = false;
        let refreshComplete = () => {
            this.$timeout(() => this.getScope().$broadcast('scroll.refreshComplete'), 10)
        };
        this.creditsStoreService.getAllGoodsList(this.sortType, true).then((data)=> {
            refreshComplete();
            this.loading = true;
        }, () => {
            this.loading = true;
            refreshComplete();
        });
    }

    /**
     * 加载更多
     */
    loadMore() {
        let tempLastKey = Number(this.lastKey);
        this.creditsStoreService.getAllGoodsList(this.sortType, false, this.lastKey, this.lquesCount).then((data)=> {
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
            this.moreFlag = Number(this.lastKey) >= Number(tempLastKey) + Number(this.lquesCount);
        }, () => {
            this.getScope().$broadcast('scroll.infiniteScrollComplete');
        });
    };


    selectSort() {
        this.sortFlag = !this.sortFlag;
        if (this.sortFlag) {
            $('#selectSort').show();
        } else {
            $('#selectSort').hide();
        }
    }

    hideSelectSort() {
        this.sortFlag = false;
        $('#selectSort').hide();
    }

    /**
     * 升降序获取商品列表
     */
    sortGoodsList(sort) {
        if (this.sortType == sort) {
            $('#selectSort').hide();
            this.sortFlag = false;
            return;
        }
        if (!this.canSort) return;
        this.canSort = false;
        this.creditsStoreService.getAllGoodsList(sort, true).then((data)=> {
            if (data) {
                this.creditsStoreService.sortType = sort;
                this.sortType = sort;
                if (sort == 'desc') {
                    $('.ion-arrow-down-b').show();
                    $('.ion-arrow-up-b').hide();
                }
                if (sort == 'asc') {
                    $('.ion-arrow-down-b').hide();
                    $('.ion-arrow-up-b').show();
                }
                $('#selectSort').hide();
                this.sortFlag = false;
            }
            this.canSort = true;
        });
    }
}

export default creditsStoreCtrl;