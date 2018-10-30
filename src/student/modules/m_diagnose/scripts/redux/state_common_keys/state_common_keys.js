/**
 * Created by 邓小龙 on 2016/10/17.
 */

let getDiagnoseknowledgeStateKey = (unitSelectKnowledge)=> {
    if(!unitSelectKnowledge) return "";
    let unitId=unitSelectKnowledge.unitId;
    let clazzId=unitSelectKnowledge.clazzId;
    let knowledgeStateKey=clazzId+'#'+unitId+'/'+unitSelectKnowledge.knowledgeId;
    return knowledgeStateKey;
};
export {
    getDiagnoseknowledgeStateKey
}

