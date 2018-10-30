/**
 * Created by Administrator on 2017/8/17.
 */
import {Inject, actionCreator} from 'ngDecoratorForStudent/ng-decorator';
import {PET_INFO} from './../redux/actiontypes/actiontypes';

@Inject('$q'
    , '$rootScope'
    , '$http'
    , 'commonService'
    , 'serverInterface'
    , '$ngRedux'
    , '$state'
)
export default class {
    $q;
    commonService;
    serverInterface;

    /**
     * 喂养宠物
     * @param param
     */
    @actionCreator
    handleFeedPet(param, prePhase){
        return (dispatch)=> {
            let defer = this.$q.defer();
            this.commonService.commonPost(this.serverInterface.PET_FEED_PET,param)
                .then((data)=>{
                    if(data.code !== 200){
                        defer.reject();
                        return
                    }
                    //处理数据
                    let newPet = {};
                    if(data.pet){
                        let levelUpStatusArr = data.pet.levelUpStatus.split('/');
                        levelUpStatusArr[1] = levelUpStatusArr[1] || levelUpStatusArr[0];

                        newPet = {
                            id:data.pet.id,
                            name:data.pet.name,
                            text:data.pet.period,
                            type:data.pet.group,
                            growthValue:+levelUpStatusArr[0],
                            growthLimit:+levelUpStatusArr[1],
                            phase:+data.pet.phases.split('-')[1],
                            process: '-' + ((levelUpStatusArr[1]-levelUpStatusArr[0])/levelUpStatusArr[1]).toFixed(2)*100 +  '%'
                        }
                    }
                    if(newPet.phase == 4){
                        newPet.process = '0%'
                    }
                    dispatch({type: PET_INFO.FEED_PET_SUCCESS,payload:{petId:param.petId,foodId:param.foodId,pet:newPet}});

                    defer.resolve(prePhase != newPet.phase);
                },(data)=>{
                    defer.reject(data);
                });
            return defer.promise;
        }
    }

    /**
     * 孵化宠物
     * @param param
     * @param isFirstEgg
     */
    @actionCreator
    hatchPet(param,isFirstEgg){
        return (dispatch)=> {
            let defer = this.$q.defer();
            this.commonService.commonPost(this.serverInterface.PET_HATCH_PET,param)
                .then((data)=>{
                    if(data.code !== 200){
                        defer.reject();
                        return
                    }
                    //处理数据
                    let newPet = {};
                    if(data.pet){
                        let levelUpStatusArr = data.pet.levelUpStatus.split('/');
                        newPet = {
                            id:data.pet.id,
                            name:data.pet.name,
                            text:data.pet.period,
                            type:data.pet.group,
                            growthValue:+levelUpStatusArr[0],
                            growthLimit:+levelUpStatusArr[1],
                            phase:+data.pet.phases.split('-')[1],
                            process: '-' + ((levelUpStatusArr[1]-levelUpStatusArr[0])/levelUpStatusArr[1]).toFixed(2)*100 +  '%'
                        }
                    }
                    
                    dispatch({type: PET_INFO.HATCH_PET_SUCCESS,payload:{eggGroup:param.group,pet:newPet,isFirstEgg:isFirstEgg}});

                    defer.resolve();
                },()=>{
                    defer.reject();
                });
            return defer.promise;
        }
    }

    @actionCreator
    getAllPet(){
        return (dispatch)=> {
            let defer = this.$q.defer();
            this.commonService.commonPost(this.serverInterface.PET_GET_ALL_PET)
                .then((data)=>{
                    if(data.code !== 200){
                        defer.reject();
                        return
                    }
                    let foodArr = [], petArr = [];

                    // "id": "0668c8f8-38da-46cb-99ae-4c3dea86b815",
                    // "period": "成年期",
                    // "group": 1,
                    // "canFeed": false,
                    // "levelUpStatus": "N/N",
                    // "phases": "1-4//宠物的孵化阶段  group为1的第4阶段，，，对应--1，幼年   2，少年    3，青年    4，成年
                    if(data.pets){
                        data.pets.forEach((pet)=>{
                            let levelUpStatusArr = pet.levelUpStatus.split('/');
                            levelUpStatusArr[1] = levelUpStatusArr[1] || levelUpStatusArr[0];
                            petArr.push({
                                id:pet.id,
                                name:pet.name,
                                text:pet.period,
                                type:pet.group,
                                growthValue:+levelUpStatusArr[0],
                                growthLimit:+levelUpStatusArr[1],
                                phase:+pet.phases.split('-')[1],
                                process: '-' + ((levelUpStatusArr[1]-levelUpStatusArr[0])/levelUpStatusArr[1]).toFixed(2)*100 +  '%'
                            })
                        })
                    }

                    //处理数据
                    // {name:'小恐龙',text:'幼年期',type:0,growthValue:10,growthLimit:50,phase:1,process:'-80%'},
                    // group:3
                    // id:"5b0fd378-dc7e-4426-84ca-b7d613f6c681"
                    // name:"王伟蛋--叫你说我不看文档"
                    if(data.eggs){
                        data.eggs.forEach((egg)=>{
                            petArr.push({
                                id:egg.id,
                                name:egg.name,
                                text:'',
                                type:egg.group,
                                growthValue:0,
                                growthLimit:0,
                                phase:0,
                                process:'-100%'
                            })
                        })
                    }

                    // "foods": [
                    //     {
                    //         "foodId": "1",
                    //         "amount": 38,
                    //         "name": "可口饼干",
                    //         "experience": 1
                    //     },
                    // ]
                    // {count:1,name:'可口饼干',foodId:1,experience:2},
                    if(data.foods){
                        data.foods.forEach((food)=>{
                            foodArr.push({
                                count:food.amount,
                                name:food.name,
                                experience:food.experience,
                                id:food.foodId
                            });
                        })
                    }

                    dispatch({type: PET_INFO.HATCH_FIRST_PET, payload:!data.pets || data.pets.length === 0}); //没有宠物，可以随便选择一个来孵化
                    dispatch({type: PET_INFO.FETCH_PET_INFO_SUCCESS,payload:{foodArr:foodArr,petArr:petArr}});

                    defer.resolve();
                },()=>{
                    defer.reject();
                });
            return defer.promise;
        }
    }

    @actionCreator
    buyPetFood(foodId){
        return (dispatch)=> {
            let defer = this.$q.defer();
            this.commonService.commonPost(this.serverInterface.PET_BUY_FOOD,{foodId:foodId})
                .then((data)=>{
                    if(data.code !== 200){
                        defer.reject();
                        return
                    }

                    dispatch({type: PET_INFO.BUY_PET_FOOD_SUCCESS,payload:{ids:[foodId]}});

                    defer.resolve();
                },()=>{
                    defer.reject();
                });
            return defer.promise;
        }

    }

    @actionCreator
    getPetGoods(param){
        return (dispatch)=> {
            let defer = this.$q.defer();
            this.commonService.commonPost(this.serverInterface.PET_GET_GOODS,param)
                .then((data)=>{
                    if(data.code !== 200){
                        defer.reject();
                        return
                    }

                    dispatch({type: PET_INFO.GET_PET_GOODS_SUCCESS,payload:{ids:[param.foodId]}});

                    defer.resolve();
                },()=>{
                    defer.reject();
                });
            return defer.promise;
        }
    }

    @actionCreator
    changeHatchFirstPetStatus(){
        return (dispatch)=> {
            dispatch({type: PET_INFO.HATCH_FIRST_PET, payload:false}); //有宠物，不能再随便选择一个来孵化
        }
    }

    @actionCreator
    changeShowAdAutoFlag(){
        return (dispatch)=> {
            dispatch({type: PET_INFO.CHANGE_SHOW_AD_AUTO_FLAG});
        }
    }
    @actionCreator
    changeFirstPetGuideFlag(){
        return (dispatch)=> {
            dispatch({type: PET_INFO.CHANGE_PET_FIRST_GUIDE_FLAG});
        }
    }
    @actionCreator
    changeCanGetRewardFlag(){
        return (dispatch)=> {
            dispatch({type: PET_INFO.CHANGE_CAN_GET_REWARD_FLAG});
        }
    }
    @actionCreator
    changeShareSuccessFlag(){
        return (dispatch)=> {
            dispatch({type: PET_INFO.CHANGE_SHARE_SUCCESS_FLAG});
        }
    }
    @actionCreator
    getShareReward(){
        return (dispatch)=> {
            let defer = this.$q.defer();
            this.commonService.commonPost(this.serverInterface.GET_PET_SHARE_REWARD)
                .then((data)=>{
                    if(data.code !== 200){
                        defer.reject();
                        return
                    }

                    dispatch({type: PET_INFO.GET_PET_GOODS_SUCCESS,payload:{ids:[]}});

                    defer.resolve();
                },()=>{
                    defer.reject();
                });
            return defer.promise;
        }

    }

}
