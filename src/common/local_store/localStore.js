/**
 * Created by 彭建伦 on 2016/5/31.
 * 为本地存储提供一个公共的API
 */
import localforage from 'localforage';

class LocalStore {
    constructor() {
        window.paperStore =this.paperStore = localforage.createInstance({name: "PAPER_STORE"});
        window.doPaperStore =this.doPaperStore = localforage.createInstance({name: "DO_PAPER_STORE"});
        window.paperAnsStore =this.paperAnsStore = localforage.createInstance({name: "PAPER_ANS_STORE"});
        window.workListStore =this.workListStore = localforage.createInstance({name: "WORK_LIST_STORE"});
        window.gameListStore =this.gameListStore = localforage.createInstance({name: "GAME_LIST_STORE"});
        window.diagnoseKnowledgeQStore =this.diagnoseKnowledgeQStore = localforage.createInstance({name: "DIAGNOSE_KNOWLEDGE_Q"});
        this.tempWorkContentInfo = {id: null, qsList: null};
        this.stateWorkContentInfo = {id: null, qsList: null};
        this.diagnoseKnowledgeQContentInfo = {id: null, question: null,answer:null};
        this.localforage=localforage;
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

    setDiagnoseKnowledgeQ(knowledgeQId,question,answer){
        this.diagnoseKnowledgeQContentInfo.id = knowledgeQId;
        this.diagnoseKnowledgeQContentInfo.question = question;
        this.diagnoseKnowledgeQContentInfo.answer = answer;
    }

    getDiagnoseKnowledgeQ() {
        return this.diagnoseKnowledgeQContentInfo;
    }

    getLocalForage(){
        return this.localforage;
    }

    clear(){
        this.localforage.clear();
    }
}
let localStore = new LocalStore();

export default localStore;
