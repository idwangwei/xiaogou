/**
 * Created by ZL on 2018/3/23.
 */
import * as default_states from '../default_states/index';

import {EDITING_QUES} from '../action_types';

export default (state = default_states.select_ques_info, action = null)=> {
    let nextState = Object.assign({}, state);
    switch (action.type) {
        case EDITING_QUES.SELECT_BOOK_TYPE:
            if (nextState.textbook && nextState.textbook.code != action.playLoad.textbook.code) {
                //教材改变其他的都要清空
                nextState.grade = '';
                nextState.unit = '';
                nextState.chapter = '';
                nextState.knowledge = '';
            }
            if (nextState.grade && nextState.grade.seq != action.playLoad.grade.seq) {
                //年级改变 单元、课时、知识点的都要清空
                nextState.unit = '';
                nextState.chapter = '';
                nextState.knowledge = '';
            }
            nextState.textbook = action.playLoad.textbook;
            nextState.grade = action.playLoad.grade;
            return nextState;
        case EDITING_QUES.SELECT_CHAPTER_UNIT:
            if (nextState.unit && nextState.unit.id != action.playLoad.unit.id) {
                //单元改变；课时、知识点都要清空
                nextState.chapter = '';
                nextState.knowledge = '';
            }
            if (nextState.chapter && nextState.chapter.id != action.playLoad.chapter.id) {
                //课时改变、知识点都要清空
                nextState.knowledge = '';
            }
            nextState.unit = action.playLoad.unit;
            nextState.chapter = action.playLoad.chapter;
            return nextState;
        case EDITING_QUES.SELECT_KNOWLEDGE_POINT:
            nextState.knowledge = action.playLoad.knowledge;
            return nextState;
        case EDITING_QUES.SELECT_DIFFICULTY_LEVEL:
            nextState.difficulty = action.playLoad.difficulty;
            return nextState;
        case EDITING_QUES.CLEAR_EDITING_QUES:
            nextState = {};
            return nextState;
        default:
            return state;
    }
};