/**
 * Created by 彭建伦 on 2016/5/31.
 */
import objectMerge from  'lodash.merge';
import Deferred from 'worker-runner/deferred';
import _sortBy from 'lodash.sortby';
/**
 *
 * @param serverRespData
 * @param paperContent
 * @param bigQSortField
 * @param smallQSortField
 * @returns {Array}
 */
let getBigQList = (serverRespData, paperContent, bigQSortField, smallQSortField)=> {
    /**
     * 根据大题ID获取大题列表中的某个大题
     * @param qsTitles
     * @param id

     */
    let getQsTitleById = (qsTitles, id)=> {
        let rt = {};
        qsTitles.forEach((qsTitle)=> {
            if (qsTitle.id == id)
                rt = qsTitle;
        });
        return rt;
    };
    let qsTitles = typeof paperContent === 'string' ? JSON.parse(paperContent) : paperContent;//local store保存的大题数据
    if(serverRespData.qsTitles){
        qsTitles=serverRespData.qsTitles;
    }

    let id2QuestionGroupScore = serverRespData.history.id2QuestionGroupScore;//服务器传过来的大题答题数据
    let bigQIdList = Object.keys(id2QuestionGroupScore);
    let filteredBigQList = [];
    //过滤掉已经做对的大题
    bigQIdList.forEach(function (bigQId) {
        qsTitles.forEach(function (qsTitle) {
            if (qsTitle.id == bigQId) {
                filteredBigQList.push(qsTitle);
            }
        });
    });
    qsTitles = filteredBigQList;
    //过滤掉已经做对的小题
    filteredBigQList = [];
    for (let key in id2QuestionGroupScore) {
        let qsTitle = getQsTitleById(qsTitles, key);
        let filteredSmallQList = [];
        let id2QuestionScore = id2QuestionGroupScore[key].id2QuestionScore;
        let smallQIdList = Object.keys(id2QuestionScore);
        if(qsTitle.qsList&&qsTitle.qsList.length){
            smallQIdList.forEach((smallQId)=> {
                qsTitle.qsList.forEach((smallQ)=> {
                    if (smallQ.id == smallQId) {
                        delete smallQ.isFirstOfBigQ;
                        delete smallQ.isLastOfBigQ;
                        delete smallQ.isFirstOfAllQ;
                        delete smallQ.isLastOfAllQ;
                        filteredSmallQList.push(smallQ);
                    }
                });
            });
        }

        qsTitle.qsList = filteredSmallQList;
        filteredBigQList.push(qsTitle);
    }
    //将大题及大题中的小题按照seqNum字段排序
    filteredBigQList = _sortBy(filteredBigQList, (item)=>{
        return parseInt(item[bigQSortField]);
    });
    filteredBigQList.forEach((bigQ, idx)=> {
        bigQ.qsList = _sortBy(bigQ.qsList, (item)=>{
            return parseInt(item[smallQSortField]);
        });
        bigQ.qsList.forEach((smallQ, idx2)=> {
            smallQ.smallQArrayIndex = idx2; //当前小题在小题数组中的下标
            smallQ.bigQArrayIndex = idx; //当前小题所在大题在大题数组中的下标
        });
        bigQ.qsList[0].isFirstOfBigQ = true; //isFirstOfBigQ表示该小题为它所属大题下的第一个小题
        bigQ.qsList[bigQ.qsList.length - 1].isLastOfBigQ = true;//isLastOfBigQ表示该小题为它所属大题下的最后一个小题
        if (idx == 0)
            bigQ.qsList[0].isFirstOfAllQ = true;//isFirstOfAllQ表示该小题为所有题第一个小题
        if (idx == filteredBigQList.length - 1)
            bigQ.qsList[bigQ.qsList.length - 1].isLastOfAllQ = true;//isLastOfAllQ表示该小题为所有题的最后一个小题
    });
    console.log(filteredBigQList);
    return filteredBigQList;
};
/**
 * merge从服务端获取的作业列表和本地存储的作业列表
 * merge规则：
 *
 *      如果是加载更多,则直接将本地存储的作业与服务器获取的作业拼接
 *      如果是全部刷新,则本地存储的作业中那些已经不存在于服务器获取的作业列表中的作业删除,将剩余的作业合并
 * 　
 * @param workListLocal
 * @param workListRemote
 * @param isUpdate
 */
let mergeWorkList = (workListLocal, workListRemote, isUpdate)=> {
    workListLocal = workListLocal || [];
    workListRemote = workListRemote || [];
    let filteredWorkListLocal = [];
    let mergedWorkList = [];//将剩余的作业合并
    //加载更多
    if (!isUpdate){
        //由于找不到list重复的元素的原因，在这里过滤掉重复的。
        workListRemote.forEach((workRemote)=> {
            let isFind=false;
            workListLocal.forEach((workLocal)=> {
                if (workLocal.instanceId === workRemote.instanceId)
                    isFind=true;
            });
            if(!isFind){
                mergedWorkList.push(workRemote);
            }


        });
        return workListLocal.concat(mergedWorkList);
    }

    //下拉刷新: 将本地存储的作业中那些已经不存在于服务器获取的作业列表中的作业删除

    workListLocal.forEach((workLocal)=> {
        workListRemote.forEach((workRemote)=> {
            if (workRemote.instanceId == workLocal.instanceId)
                filteredWorkListLocal.push(workLocal);
        })
    });

    workListRemote.forEach((workRemote)=> {
        let work = workRemote;
        filteredWorkListLocal.forEach((workLocal)=> {
            if (workLocal.instanceId == workRemote.instanceId)
                work = objectMerge(workLocal, workRemote);
        });
        mergedWorkList.push(work);
    });
    return mergedWorkList;
};

let notifyNetWorkStatus = (netStatus)=> {
    console.log(netStatus);
    let defer = new Deferred();
    let isOnline = netStatus.onLine;
    setInterval(()=> {
        console.log(navigator);
        console.log(navigator.connection);
        let nowOnline = navigator.connection.type != 'none';
        if (isOnline != nowOnline) {
            isOnline = nowOnline;
            defer.notify(nowOnline);
        }
    }, 3000);
    return defer.promise();
};

let stringify = (obj)=> {
    return JSON.stringify(obj);
};
export {
    stringify,
    getBigQList,
    mergeWorkList,
    notifyNetWorkStatus
}

