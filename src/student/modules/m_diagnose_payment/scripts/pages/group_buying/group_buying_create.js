/**
 * Created by ZL on 2017/2/14.
 */
import controllers from './../index';
import BaseController from 'base_components/base_ctrl';

class groupBuyingCreate extends BaseController {
    constructor() {
        super(arguments);
    }

    initFlags() {
        this.initCtrl = false; //ctrl初始化后，是否已经加载过
    }

    initData() {
        this.backUrl = this.getStateService().params.urlFrom || "home.diagnose02";//this.$stateParams.urlFrom;
        this.backWorkReportUrl = this.getStateService().params.backWorkReportUrl;
        this.productTypeList = [
            {name: '提高版', value: '提高版'},
            {name: '进阶版', value: '进阶版'},
            {name: '无敌版', value: '无敌版'}];
        this.productTypeListIndex = ['提高版', '进阶版', '无敌版'];
        this.groupTypeList = [];
        this.defaultStr = "-请选择-";
        this.groupMemberNum = "-请选择-";
        // this.defaultOption = 'none';
        this.leader = {
            name: null,
            loginName: null,
            type: "-请选择-",//团主选择的版本
            price: '',//团主的优惠价
            goodsId: null,//团主选择的商品ID
            userId: null,
            // defaultType: -1
        };
        this.goods = [];
        this.memberList = [];
        // this.showInputHelpFlag = false;//是否显示可选用户列表
        this.currenEditIndex = 0;
        this.totalPrice = 0;
        this.payAppCode = "wechat"; //微信支付
        this.resultList = [];
        this.groupLen = "";
        this.selectDoodsList = [];
        this.contentHeight = window.innerHeight - 70 - 120;
        this.isIos = true;
        this.isShowInputHelp = false;
        // this.isLeaveView = false;
    }

    /**
     * 根据选择的团人数，生成团员列表
     */
    createMemberList() {
        if (this.groupTypeList.indexOf(this.groupMemberNum) == -1) return;
        var limitNums = this.groupMemberNum.toString().match(/\d+/g);
        // if (limitNums.length != 2) return;
        var limit = 0;
        if (limitNums.length == 1 && Number(limitNums[0]) >= 20) {
            limit = 25;
        } else {
            limit = Number(limitNums[1]);
        }

        var len = this.memberList.length;
        // if (limit > 20) limit = 25;
        if (len < limit - 1) {
            for (let i = len; i < limit - 1; i++) {
                this.memberList[i] = {};
                this.memberList[i].type = this.defaultStr;
            }
        } else {
            this.memberList = this.memberList.slice(0, limit - 1);
        }
        this.leaderPriceQuery();
        this.memberListPriceQuery();
    }

    /**
     * 根据选择的组团人数
     */
    memberListPriceQuery() {
        angular.forEach(this.memberList, (v, k)=> {
            if (this.memberList[k].userId && this.memberList[k].type) {
                var obj = this.queryPrice(this.groupMemberNum, this.memberList[k].type);
                this.memberList[k].price = obj.price;
                this.memberList[k].goodsId = obj.goodsId;
            }
        });
    };


    /**
     * 计算优惠后的团主价
     */
    leaderPriceQuery() {
        if (!this.groupMemberNum || this.groupMemberNum == this.defaultStr
            || !this.leader.type || this.leader.type == this.defaultStr) return;
        var obj = this.queryPrice(this.groupMemberNum, this.leader.type);
        var price1 = this.queryLeaderPrice(this.groupMemberNum);
        var leaderPrice = obj.price - price1;
        if (leaderPrice < 0) leaderPrice = 0;
        this.leader.price = leaderPrice;
        this.leader.goodsId = obj.goodsId;
        this.queryTotalPrice();
    }

    /**
     * 根据团人数查询团主的优惠价
     */
    queryLeaderPrice(groupType) {
        if (this.groupTypeList.indexOf(groupType) == -1)return "";
        var limitNums = groupType.toString().match(/\d+/g);
        if (!limitNums || limitNums && limitNums.length < 1)return "";
        if (limitNums.length == 1) limitNums[1] = 99999;
        var price = 0;
        angular.forEach(this.groupBuyingGoodsList.leaderFavorable, (v, k)=> {
            if (this.groupBuyingGoodsList.leaderFavorable[k].minHeadCount == limitNums[0]
                && this.groupBuyingGoodsList.leaderFavorable[k].maxHeadCount == limitNums[1]) {
                price = Number(this.groupBuyingGoodsList.leaderFavorable[k].totalFee);
            }
        });
        return price;
    }

    /**
     * 根据团人数和选择的产品查询价格
     * @param groupType
     * @param productType
     */
    queryPrice(groupType, productType) {
        /*  var limitNums = groupType.toString().match(/\d+/g);
         if (!limitNums || limitNums && limitNums.length != 2)return "";*/
        if (this.groupTypeList.indexOf(groupType) == -1)return "";
        var limitNums = groupType.toString().match(/\d+/g);
        if (!limitNums || limitNums && limitNums.length < 1)return "";
        if (limitNums.length == 1) limitNums[1] = 99999;
        var price = null;
        var goodsId = null;

        angular.forEach(this.groupBuyingGoodsList.goods, (v, k)=> {
            let flag = false;
            let flagList = this.groupBuyingGoodsList.goods[k].desc.title.match(productType);
            if (!!flagList && flagList.indexOf(productType) > -1) flag = true;

            if (this.groupBuyingGoodsList.goods[k].minHeadCount == limitNums[0]
                && this.groupBuyingGoodsList.goods[k].maxHeadCount == limitNums[1]
                && flag) {
                price = this.groupBuyingGoodsList.goods[k].totalFee;
                goodsId = this.groupBuyingGoodsList.goods[k].id;
            }
        });
        return {price: price, goodsId: goodsId};
    }

    memberPriceQuery(item) {
        var obj = this.queryPrice(this.groupMemberNum, item.type);
        item.price = obj.price;
        item.goodsId = obj.goodsId;
        this.queryTotalPrice();
    }

    /**
     * 计算总金额
     */
    queryTotalPrice() {
        if (!this.groupMemberNum || this.groupMemberNum == this.defaultStr) return;
        var total = this.leader.price * 100;
        angular.forEach(this.memberList, (v, k)=> {
            if (!!this.memberList[k].name && !!this.memberList[k].price
                && this.memberList[k].price != '--') {
                total += Number(this.memberList[k].price) * 100;
            }
        });
        this.totalPrice = total / 100;
    }

    //////////////////用户选择框begin//////////////////////

    checkUserName(item, type) {
        var userName = item.name;
        if (!userName) {

            this.clearItemData(item);
            item.isWrong = false;
            return;
        }
        var evt = event.target;
        this.checkUserNameRule(evt, item, type);
    }

    checkUserNameRule(evt, item, type) {
        var userName = item.name;

        if (!userName.match(/^1\d{10}(S|s)\d*$/g)) {

            this.clearItemData(item);
            return false;
        }
        if (!item.showInputHelpFlag && !userName.match(/^1\d{10}(S|s)\d*$/g)) {

            this.clearItemData(item);
            return false;
        } else if (!item.loginName) {

            this.clearItemData(item);
            return false;
        } else if (!this.checkSameUser(item.userId, type)) {

            this.commonService.alertDialog("该账号重复添加!", 1000);
            item.name = '';
            this.clearItemData(item);
            item.isWrong = false;
            return false;
        } else {
            return true;
        }
    }

    /**
     * 清除用户数据
     */
    clearItemData(item) {
        item.goodsId = null;
        item.loginName = null;
        item.price = null;
        item.type = this.defaultStr;
        item.userId = null;
        item.isWrong = true;
    }

    /**
     * 检查重复添加用户
     */
    checkSameUser(userId, type) {
        if (type == 'leader') return true;
        var flag = true;
        var count = 0;
        if (userId == this.leader.userId) return false;
        angular.forEach(this.memberList, (v, k)=> {
            if (this.memberList[k].userId && this.memberList[k].userId == userId) count++;
            if (count == 2) {
                flag = false;
                return flag;
            }
        });
        return flag;
    }

    warning(docNode, title, msg) {
        this.$ionicPopup.alert({
            title: title,//'输入账号出错',
            template: '<div style="width: 100%;text-align: center"><p>' + msg + '</p></div>',
            okText: '确定'
        }).then(()=> {
            this.$timeout(function () {
                if (docNode) docNode.focus();
            }, 500);

        });
    }

    autoCompleteName(item, person) {
        item.name = person.hasOwnProperty('gender') ? person.loginName : person;
        item.loginName = person.hasOwnProperty('gender') ? person.name : person;
        item.userId = person.hasOwnProperty('gender') ? person.userId : person;
        item.showInputHelpFlag = false;
        item.isWrong = false;
        this.isShowInputHelp = false;
        this.queryTotalPrice();
    }

    showInputHelp(index) {
        if (index == 'leader') {
            this.showInputHelpLeader();
            return;
        }
        this.currenEditIndex = index;
        var flags = this.memberList[this.currenEditIndex].showInputHelpFlag;
        this.memberList[this.currenEditIndex].showInputHelpFlag = false;
        if (!this.memberList[this.currenEditIndex].name) return;
        if (this.isShowInputHelp) {
            if (flags) {
                this.isShowInputHelp = false;
            } else {
                this.memberList[this.currenEditIndex].loginName = null;
                this.memberList[this.currenEditIndex].userId = null;
            }
            return;
        }


        this.memberList[this.currenEditIndex].loginName = null;
        this.memberList[this.currenEditIndex].userId = null;

        if (this.memberList[this.currenEditIndex].name.match(/^1\d{10}(S|s)\d*$/g)) {
            var flag = false;
            angular.forEach(this.userList, (v, k)=> {
                if (this.userList[k].loginName == this.memberList[this.currenEditIndex].name.toUpperCase()
                    || this.userList[k].loginName == this.memberList[this.currenEditIndex].name.toLowerCase()) {
                    this.autoCompleteName(this.memberList[index], this.userList[k]);
                    flag = flag || true;
                }
            });
            if (flag) return;
        }
        if (this.memberList[this.currenEditIndex].name.match(/^1\d{10}/g)) {
            let phone = angular.copy(this.memberList[this.currenEditIndex].name).substr(0, 11);
            this.wxPayService.getUserListByPhone(phone, this.getUserListCallBack.bind(this));
            return;
        }


    }

    showInputHelpLeader() {
        // if (this.isShowInputHelp) return;
        // this.leader.showInputHelpFlag = false;
        // if (!this.leader.name) return;

        var flags = this.leader.showInputHelpFlag;
        this.leader.showInputHelpFlag = false;
        if (!this.leader.name) return;
        if (this.isShowInputHelp) {
            if (flags) {
                this.isShowInputHelp = false;
            }
            else {
                this.leader.loginName = null;
                this.leader.userId = null;
            }
            return;
        }

        this.leader.loginName = null;
        this.leader.userId = null;

        if (this.leader.name.match(/^1\d{10}(S|s)\d*$/g)) {
            var flag = false;
            angular.forEach(this.userList, (v, k)=> {
                if (this.userList[k].loginName == this.leader.name.toUpperCase()
                    || this.userList[k].loginName == this.leader.name.toLowerCase()) {
                    this.autoCompleteName(this.leader, this.userList[k]);
                    flag = flag || true;
                }
            });
            if (flag) return;
        }

        if (this.leader.name.match(/^1\d{10}/g)) {
            let phone = angular.copy(this.leader.name).substr(0, 11);
            this.wxPayService.getUserListByPhone(phone, this.getUserListCallBackFromLeader.bind(this));
            this.isShowInputHelp = true;
            return;
        }

    }

    getUserListCallBackFromLeader(userList) {
        if (this.leader.name
            && this.leader.name.match(/^1\d{10}/g)
            && userList && userList.length) {
            this.userList = userList;
            this.leader.showInputHelpFlag = true;
        }
    }

    getUserListCallBack(userList) {
        if (this.memberList[this.currenEditIndex].name
            && this.memberList[this.currenEditIndex].name.match(/^1\d{10}/g)
            && userList && userList.length) {
            this.userList = userList;
            this.memberList[this.currenEditIndex].showInputHelpFlag = true;
            this.isShowInputHelp = true;
        }
    }

    //////////////////用户选择框end//////////////////////


    onBeforeLeaveView() {
        this.saveSelectGood();
        //离开当前页面时，cancel由所有当前页发起的请求
        this.wxPayService.cancelDiagnoseGoodsMenusRequestList.forEach(function (cancelDefer) {
            cancelDefer.resolve(true);
        });
        this.wxPayService.cancelDiagnoseGoodsMenusRequestList.splice(0, this.wxPayService.cancelDiagnoseGoodsMenusRequestList.length);//清空请求列表
    }

    onReceiveProps() {
        this.getGroupType();
        this.checkOrder();

    }

    onAfterEnterView() {
        this.backWorkReportUrl = this.getStateService().params.backWorkReportUrl;
    }

    ensurePageData() {
        this.isShowInputHelp = false;
        if (!this.initCtrl) {
            this.initCtrl = true;
        }
        this.isIos = this.commonService.judgeSYS() == 2;

        this.leader.name = this.leader.name || this.name;
        this.leader.loginName = this.leader.loginName || this.loginName;
        this.leader.userId = this.leader.userId || this.userId;
        this.leader.type = this.leader.type || this.defaultStr;

        // this.leader.defaultType = this.productTypeListIndex.indexOf(this.leader.type);
        // if (this.leader.defaultType == -1) this.leader.defaultType = "-请选择-";
        // debugger
        //
        // angular.forEach(this.groupTypeList, (v, k)=> {
        //     // if (this.groupTypeList[k].value == this.groupMemberNum) this.defaultOption = k;
        //     if (this.groupTypeList[k] == this.groupMemberNum) this.defaultOption = k;
        // });
        // if (this.defaultOption == 'none') this.defaultOption = "-请选择-";


    }

    checkOrder() {
        if (!this.order) {
            this.initMemberData();
            return;
        }
        this.fetchGroupOrderDetails(this.order.orderNo).then(data=> {
            if (data.code == 200) {
                if (data.status != 0) {//支付失败或未支付
                    this.initMemberData();
                }
            }
        });

    }

    initMemberData() {
        if (!this.selectGoodInfo) {
            this.ensurePageData();
            return;
        }


        this.resultList = this.selectGoodInfo.payDetails || [];
        this.groupLen = this.selectGoodInfo.groupMemberNum || "";
        this.selectDoodsList = this.selectGoodInfo.goods || [];

        if (!this.groupLen) {
            this.ensurePageData();
            return;
        }
        //TODO groupMemberNum数据
        this.groupMemberNum = this.groupLen;
        // debugger
        this.memberList.length = 0;
        this.memberList = this.resultList;
        // angular.forEach(this.resultList, (v, k)=> {
        //     this.memberList[k] = Object.assign({}, this.resultList[k]);
        // });default
        angular.forEach(this.selectDoodsList, (v, k)=> {
            this.memberList[k] = Object.assign(this.memberList[k], this.selectDoodsList[k]);
            this.memberList[k] = Object.assign(this.memberList[k], this.resultList[k]);
            // this.memberList[k].defaultType = this.productTypeListIndex.indexOf(this.memberList[k].type);
            // if (this.memberList[k].defaultType == -1) this.memberList[k].defaultType = '-请选择-';
        });
        //
        debugger
        this.leader = this.memberList[0];
        this.memberList = this.memberList.slice(1);
        this.ensurePageData();
        this.createMemberList();
    }

    /**
     * 组团方式
     */
    getGroupType() {
        if (!this.groupBuyingGoodsList) return;
        if (!this.groupBuyingGoodsList.goods) return;
        if (this.groupBuyingGoodsList.goods.length == 0) return;
        var lastMinNum = 0;
        var lastMaxNum = 0;
        this.groupTypeList.length = 0;
        // if (this.groupTypeList.length > 0) return;
        angular.forEach(this.groupBuyingGoodsList.goods, (item, key)=> {
            if (this.groupBuyingGoodsList.goods[key].minHeadCount != lastMinNum
                && this.groupBuyingGoodsList.goods[key].maxHeadCount != lastMaxNum) {
                let value = "" + this.groupBuyingGoodsList.goods[key].minHeadCount + "-"
                    + this.groupBuyingGoodsList.goods[key].maxHeadCount;
                let name = value;
                if (Number(this.groupBuyingGoodsList.goods[key].minHeadCount) > 20) value = "20以上";
                // this.groupTypeList.push({name: name, value: value});
                this.groupTypeList.push(value);
                lastMinNum = this.groupBuyingGoodsList.goods[key].minHeadCount;
                lastMaxNum = this.groupBuyingGoodsList.goods[key].maxHeadCount;
            }
        });
    }

    groupCheck() {
        if (!this.leader.type || this.leader.type == this.defaultStr) {
            this.warning(null, "团主版本出错", '请为团主选择版本');
            return false;
        }
        if (!this.leader.name || !this.leader.loginName) {
            this.warning(null, "团主出错", '请填入正确的团主账号');
            return false;
        }
        if (!this.groupMemberNum || this.groupMemberNum == this.defaultStr) {
            this.warning(null, "组团出错", '请选择组团人数');
            return false;
        }
        return true;
    }

    /**
     * 下订单
     */
    submitOrder() {
        this.saveSelectGood();
        if (!this.groupCheck()) return;
        var flag = false;
        var flagType = true;

        angular.forEach(this.memberList, (v, k) => {
            if (this.memberList[k].userId) {
                flag = flag || this.memberList[k].isWrong;
                flagType = flagType && this.memberList[k].type && this.memberList[k].type != this.defaultStr;
            }
        });
        if (flag) {
            let elem = '<div style="text-align: center"><p>请仔细检查每个人的账号</p></div>';
            this.commonService.showAlert("账号出错", elem);
            // this.warning(null, "账号出错", '请仔细检查每个人的账号');
            return;
        }
        if (!flagType) {
            let elem = '<div style="text-align: center"><p>请为每个人选择版本</p></div>';
            this.commonService.showAlert("选择版本出错", elem);
            // this.warning(null, "账号出错", '请仔细检查每个人的账号');
            return;
        }
        var limit = Number(this.groupMemberNum.match(/\d+/g)[0]);
        if (this.goods.length < limit) {
            var members = this.groupMemberNum;
            if (limit > 20) members = '20人以上';
            let elem = '<div style="text-align: center"><p>本团应该有' + members + '人</p></div>';
            this.commonService.showAlert("团人数出错", elem);
            // this.warning(null, "团人数出错", '本团应该有' + members + '人');
            return;
        }
        this.callBack();

    }


    saveSelectGood() {
        this.goods.length = 0;
        if (!this.leader.name || !this.leader.loginName || this.leader.isWrong) {
            this.clearItemData(this.leader);
            this.leader.name = null;
        }
        this.goods = [{
            userId: this.leader.userId,
            goodsId: this.leader.goodsId,
            leaderId: this.leader.userId
        }];

        var payDetails = [
            {
                loginName: this.leader.loginName,
                name: this.leader.name,
                type: this.leader.type,
                price: this.leader.price
            }
        ];


        // var flag = false;
        angular.forEach(this.memberList, (v, k) => {
            if (!!this.memberList[k].name && !!this.memberList[k].loginName) {
                // if (!!this.memberList[k].userId && !!this.memberList[k].goodsId) {
                // flag = flag || this.memberList[k].isWrong;
                this.goods.push({
                    userId: this.memberList[k].userId,
                    goodsId: this.memberList[k].goodsId,
                    leaderId: this.leader.userId
                });
                payDetails.push({
                    name: this.memberList[k].name,
                    loginName: this.memberList[k].loginName,
                    type: this.memberList[k].type,
                    price: this.memberList[k].price
                })
                // }
            }
        });

        var params = {
            goods: this.goods,
            payDetails: payDetails,
            groupMemberNum: this.groupMemberNum,
            totalFee: this.totalPrice,
            desc: {
                fee: this.totalPrice,
                title: '组团购买',
                subTitle: '组团优惠'
            }
        };

        this.selectedGood(params, null);
    }

    callBack() {
        this.go('group_buying_pay', 'forward', {urlFrom: this.backUrl,backWorkReportUrl:this.backWorkReportUrl});
    }

    back() {
        this.go('group_buying', 'forward', {urlFrom: this.backUrl,backWorkReportUrl:this.backWorkReportUrl});
    }

    mapStateToThis(state) {
        return {
            groupBuyingGoodsList: state.group_buying_goods_list,
            order: state.group_buying_selected_good.order,
            selectGoodInfo: state.group_buying_selected_good.payload,
            name: state.profile_user_auth.user.loginName,
            loginName: state.profile_user_auth.user.name,
            userId: state.profile_user_auth.user.userId
        };
    }

    mapActionToThis() {
        return {
            fetchGoodsMenus: this.wxPayService.fetchGroupBuyingGoodsMenus.bind(this.wxPayService),
            // selectedGood: this.wxPayService.selectedGood.bind(this.wxPayService)
            selectedGood: this.wxPayService.selectGroupBuyingOrder.bind(this.wxPayService),
            fetchGroupOrderDetails: this.wxPayService.getGroupOrderDetails.bind(this.wxPayService)
        }
    }
}
groupBuyingCreate.$inject = [
    '$scope'
    , '$state'
    , '$rootScope'
    , '$stateParams'
    , 'commonService'
    , '$ngRedux'
    , '$ionicPopup'
    , 'wxPayService'
    , '$ionicLoading'
    , '$timeout'
    , '$ionicHistory'
    , '$interval'
];
controllers.controller("groupBuyingCreate", groupBuyingCreate);

