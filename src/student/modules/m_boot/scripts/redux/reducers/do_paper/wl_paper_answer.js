/**
 * Created by 彭建伦 on 2016/6/15.
 */
import _assign from 'lodash.assign';
import _findIndex from 'lodash.findindex';
import {SELECT_QUESTION} from '../../actiontypes/actiontypes';
import * as defaultStates from './../../default_states/default_states';
function wl_paper_answer(state = defaultStates.wl_paper_answer, action = null) {
    let newState = _assign({},state);
    let payload = action.payload;
    switch (action.type) {
        case SELECT_QUESTION.MODIFY_PAPER_ANSWER:
            //用户该试卷已经有本地答案
            let paperAnsArr = newState[payload.userPaperInstanceId];
            if(paperAnsArr){
                let index = _findIndex(paperAnsArr, {currentQIdInPaper: payload.ans.currentQIdInPaper});

                //查看该小题是否已经保存了答案,是则更新,否则添加
                if (index != -1) {
                    paperAnsArr[index] = payload.ans;
                } else {
                    paperAnsArr.push(payload.ans);
                }
            }
            else {
                newState[payload.userPaperInstanceId] = [payload.ans]
            }

            return newState;
        case SELECT_QUESTION.CLEAR_PAPER_ANSWER:
            if(newState[payload.userPaperInstanceId]){
                newState[payload.userPaperInstanceId] = null;
                delete newState[payload.userPaperInstanceId];
            }
            return newState;
        default :
            return state;
    }
}
export default wl_paper_answer;