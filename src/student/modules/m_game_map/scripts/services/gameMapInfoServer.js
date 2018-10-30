/**
 * Created by WL on 2017/6/23.
 */
import {Service, actionCreator,Inject} from '../module';
import  {
    FETCH_GAME_MAP_SCENE_LIST_START
    , FETCH_GAME_MAP_SCENE_LIST_SUCCESS
    , FETCH_GAME_MAP_SCENE_LIST_FAIL
    , FETCH_GAME_MAP_ATLAS_START
    , FETCH_GAME_MAP_ATLAS_SUCCESS
    , FETCH_GAME_MAP_ATLAS_FAIL
    , CHANGE_GAME_MAP_ATLAS
    , SET_GAME_MAP_SHARDING_CLAZZ
    , GAME_GOODS_PAY
}  from './../redux/action_types';
import weChatIcon from './../../game_map_images/game_map_atlas/wechat.ico';
import friendCircle from './../../game_map_images/game_map_atlas/friend-circle.png';
import qqIcon from './../../game_map_images/game_map_atlas/qq.ico';
@Service('gameMapInfoServer')
@Inject('$q', '$rootScope', '$http', 'commonService', '$ngRedux', '$state', '$ionicBackdrop', 'gameMapInterface', '$ionicActionSheet','$timeout')
class gameMapInfoServer {
    commonService;
    gameMapInterface;
    $ionicActionSheet;
    userName;
    $timeout;

    /**
     * 获取主页面数据
     */
    @actionCreator
    getSceneList() {
        return (dispatch, getState) => {
            let defer = this.$q.defer();
            dispatch({type: FETCH_GAME_MAP_SCENE_LIST_START});
            this.commonService.commonPostSpecial(this.gameMapInterface.GET_GAME_MAP_SCENE).then((data) => {
                if (data.code === 200) {
                    dispatch({type: FETCH_GAME_MAP_SCENE_LIST_SUCCESS, payload: data.mainScence});
                    if(data.mlcg)dispatch({type:GAME_GOODS_PAY.UPDATE_GAME_VIP, data:data.mlcg})
                } else {
                    dispatch({type: FETCH_GAME_MAP_SCENE_LIST_FAIL});
                }
                defer.resolve(data);
            }, (res) => {
                dispatch({type: FETCH_GAME_MAP_SCENE_LIST_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        }
    }

    @actionCreator
    getAtlasList(atlasId, toLightId) {
        toLightId = toLightId || null;
        return (dispatch, getState) => {
            let defer = this.$q.defer();
            let state = getState();
            let atlasDataArr = state.game_map_atlas_info;
            dispatch({type: FETCH_GAME_MAP_ATLAS_START});
            this.commonService.commonPostSpecial(this.gameMapInterface.GET_GAME_MAP_ATLAS).then((data) => {
                if (data.code === 200) {
                    atlasDataArr[atlasId] = this.parseAtlasInfo(atlasId, atlasDataArr[atlasId], data.card, toLightId);
                    dispatch({type: FETCH_GAME_MAP_ATLAS_SUCCESS, payload: {name: atlasId, data: atlasDataArr}});
                } else {
                    dispatch({type: FETCH_GAME_MAP_ATLAS_FAIL});
                }
                defer.resolve(data);
            }, (res) => {
                dispatch({type: FETCH_GAME_MAP_ATLAS_FAIL});
                defer.resolve(false);
            });
            return defer.promise;
        }
    }

    /**
     * 解析数据
     * @param atlasId 不同的主题，如‘atlas1','atlas2'
     * @param atlasArr 不同主题对应的一组数据数组
     * @param lightArr 后端返回的所有点亮的图标的数组
     * @param toLightIdArr 将要播放动画的图片的id，先将它暗下来，后面播放动画
     * @returns {*}
     */
    parseAtlasInfo(atlasId, atlasArr, lightArr, toLightIdArr) {
        angular.forEach(atlasArr,function (animal) {//遍历某一个图集中每一个图片
            animal.light = false; //默认所有动物是暗的
            let tempId = animal.avatorId.replace(/_/g,'-');

            let hasIndex = lightArr.indexOf(tempId);
            if(hasIndex===-1)return; //未点亮
            hasIndex = toLightIdArr.indexOf(animal.avatorId);
            if(hasIndex  == -1) animal.light = true;
        });
        return atlasArr;
    }

    lightAnimal(atlasId, lightId) {
        if (lightId.length == 0) return;
        angular.forEach(lightId, (id) => {
            this.lightAnimalAnimation(id);
        });
        this.changeAtlasImg(atlasId, lightId);
    }

    lightAnimalAnimation(lightId) {
        this.$timeout(()=>{
            let className = '.atlas-img' + lightId.toString().replace('_', "-");
            $(className).removeClass('avator-filter-gray');
        },1000);
    }


    @actionCreator
    changeAtlasImg(atlasId, lightIdArr) {
        return (dispatch, getState) => {
            let state = getState();
            let atlasDataArr = state.game_map_atlas_info;
            angular.forEach(lightIdArr, (lightId) => {
                let index = lightId.toString().split("_")[1];
                atlasDataArr[atlasId][index - 1].light = true;
            });

            dispatch({type: CHANGE_GAME_MAP_ATLAS, payload: {name: atlasId, data: atlasDataArr}});
        }
    }

    @actionCreator
    getUserName() {
        return (dispatch, getState) => {
            let state = getState();
            this.userName = state.profile_user_auth.user.name;
        }
    }

    /**
     * 分享图集
     * @param atlas
     */
    shareAtlas(atlas) {
        this.getUserName();
        let teacherName = this.userName + "同学：";
        let shareContent = `在“魔力闯关”中，自学成才。Ta的图集好丰富哦！快来一起自学吧！`;
        this.$ionicActionSheet.show({
            buttons: [
                {text: `<img class="reward-share-btn weChat-share-img" src="${weChatIcon}">分享到微信`},
                {text: `<img class="reward-share-btn friend-circle-share-img" src="${friendCircle}">分享到朋友圈`},
                /* {text: `<img class="reward-share-btn qq-share-img" src="${qqIcon}" >分享到QQ`}*/
            ],
            titleText: `<div>
                    <div class="reward-share-btn share-title" >${teacherName}</div>
                        <div class="reward-share-btn share-content" >${shareContent}</div>                   
                    </div>`,
            cancelText: '取消',
            buttonClicked: (index) => {
                if (index == 2) {
                    QQ.setOptions({
                        appId: '1105576253',
                        appName: 'XiaoGou',
                        appKey: 'IaDN9O8abL0FJ6gT'
                    });
                    QQ.share(shareContent,
                        teacherName,
                        'http://xuexiv.com/img/icon.png',
                        $scope.shareUrl,
                        () => {
                            this.commonService.showAlert("提示", "分享信息发送成功！");
                        }, (err) => {
                            this.commonService.showAlert("提示", err);
                        });
                }
                if (index == 0) {//点击分享到微信
                    if (!this.getRootScope().weChatInstalled) {
                        this.commonService.showAlert("提示", "没有安装微信！");
                        return;
                    }
                    Wechat.share({
                        scene: Wechat.Scene.SESSION,  // 分享到朋友或群
                        message: {
                            title: teacherName,
                            description: shareContent,
                            thumb: "http://xuexiv.com/img/icon.png",
                            mediaTagName: "TEST-TAG-001",
                            messageExt: "这是第三方带的测试字段",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.IMAGE,
                                image: atlas,
                            }
                        },
                    }, () => {
                        this.commonService.showAlert("提示", "分享信息发送成功！");
                    }, (reason) => {
                        this.commonService.showAlert("提示", reason);
                    });
                }

                if (index == 1) {//点击分享到微信朋友圈
                    if (!this.getRootScope().weChatInstalled) {
                        this.commonService.showAlert("提示", "没有安装微信！");
                        return;
                    }
                    Wechat.share({
                        scene: Wechat.Scene.TIMELINE,  // 分享到朋友或群
                        message: {
                            title: teacherName,
                            description: shareContent,
                            thumb: "http://xuexiv.com/img/icon.png",
                            mediaTagName: "TEST-TAG-001",
                            messageExt: "这是第三方带的测试字段",
                            messageAction: "<action>dotalist</action>",
                            media: {
                                type: Wechat.Type.IMAGE,
                                image: atlas,
                            }
                        },
                    }, () => {
                        this.commonService.showAlert("提示", "分享信息发送成功！");
                    }, (reason) => {
                        this.commonService.showAlert("提示", reason);
                    });
                }
                return true;
            }
        });
    };

    @actionCreator
    setShardingClazz(clazz){
        return (dispatch,getState)=>{
            dispatch({type: SET_GAME_MAP_SHARDING_CLAZZ, payload: clazz});
        }
    }
}


export default gameMapInfoServer;