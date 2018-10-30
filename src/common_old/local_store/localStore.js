/**
 * Created by 彭建伦 on 2016/5/31.
 * 为本地存储提供一个公共的API
 */
import localforage from 'localforage';

class LocalStore {
    constructor() {
        this.paperStore = localforage.createInstance({name: "PAPER_STORE"});
        this.doPaperStore = localforage.createInstance({name: "DO_PAPER_STORE"});
        this.paperAnsStore = localforage.createInstance({name: "PAPER_ANS_STORE"});
        this.workListStore = localforage.createInstance({name: "WORK_LIST_STORE"});
        this.gameListStore = localforage.createInstance({name: "GAME_LIST_STORE"});
        this.tempWorkContentInfo = {id: null, qsList: null};
        this.stateWorkContentInfo = {id: null, qsList: null};
        this.tempPaperContentInfo = {id: null, data: null};
    }

    setTempWork(workInstanceId, qsList) {
        this.tempWorkContentInfo.id = workInstanceId;
        this.tempWorkContentInfo.qsList = qsList;
    };

    getTempWork() {
        return this.tempWorkContentInfo
    }
    setStateWork(workInstanceId, qsList) {
        this.stateWorkContentInfo.id = workInstanceId;
        this.stateWorkContentInfo.qsList = qsList;
    };

    getStateWork() {
        return this.stateWorkContentInfo
    }
    setTempPaper(paperId, paperData) {
        this.tempPaperContentInfo.id = paperId;
        this.tempPaperContentInfo.data = paperData;
    };

    getTempPaper() {
        return this.tempPaperContentInfo
    }
}
let localStore = new LocalStore();

export default localStore;
