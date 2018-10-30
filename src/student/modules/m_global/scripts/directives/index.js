/**
 * Created by ZL on 2017/12/28.
 */
// import broadcastMsgItem from './broadcast/broadcast-msg-item';
import changeHeadImg from './change_head_img/change_head_img';
import diagnoseFindWeak from './diagnose_find_weak/diagnose_find_weak';
import formSelect from './form/select/index';
import msgFromTeacher from './msgFromTeacher/index'
import monitorAd from './monitor_ad/index'
import winterCampAd from '../../../m_winter_camp/scripts/directives/winter_camp_ad/index';
import microlectureAd from '../../../m_olympic_math_microlecture/scripts/directives/microlecture_ad/index';
import finalSprintAd from '../../../m_final_sprint/scripts/directives/final_sprint_ad/index';
import liveAd from '../../../m_live/scripts/directives/live_ad/index';
import childrenDayAd from './children_day_ad/index';
import {
    paperLayout,
    paperHeader,
    paperMain,
    paperFooter,
    paperOperation,
    paperOperateItem
} from './user_directive/do_question';
import selectInputArea from './select_input_area/select-input-area';
import {
    questionList,
    questionItem,
    questionTitle,
    questionContent,
    questionToolbar,
    questionToolItem
} from './work_lib_manage/questionList'

let directives = angular.module("m_global.directives", []);

// directives.directive("broadcastMsgItem", broadcastMsgItem);
directives.directive("changeHeadImg", changeHeadImg);
directives.directive("diagnoseFindWeak", diagnoseFindWeak);
directives.directive("formSelect", formSelect);
directives.directive("msgFromTeacher", msgFromTeacher);
directives.directive("paperLayout", paperLayout);
directives.directive("paperHeader", paperHeader);
directives.directive("paperMain", paperMain);
directives.directive("paperFooter", paperFooter);
directives.directive("paperOperation", paperOperation);
directives.directive("paperOperateItem", paperOperateItem);
directives.directive("selectInputArea", selectInputArea);
directives.directive("questionList", questionList);
directives.directive("questionItem", questionItem);
directives.directive("questionTitle", questionTitle);
directives.directive("questionContent", questionContent);
directives.directive("questionToolbar", questionToolbar);
directives.directive("questionToolItem", questionToolItem);
directives.directive('winterCampAd',winterCampAd);
directives.directive('microlectureAd', microlectureAd);
directives.directive('monitorAd', monitorAd);
directives.directive('liveAd', liveAd);
directives.directive('childrenDayAd', childrenDayAd);
directives.directive('finalSprintAd', finalSprintAd);