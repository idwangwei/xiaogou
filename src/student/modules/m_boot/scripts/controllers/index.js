/**
 * Created by 彭建伦 on 2015/7/8.
 */
import messageListCtrl from "./msg/message_list_ctrl";
// import broadcastListCtrl from "./msg/broadcast_list_ctrl";
// import trophyRankCtrl from "./msg/trophy_rank_ctrl";
// import achievementCtrl from "./achievement/achievement_ctrl";
// import computeCtrl from "./compute/compute_ctrl";
import {CONTROLLER_COMPONENT, registComponent} from "module_register/module_register";
// import trainingPetsMaster from './training_pets_master'
// import studyIndexCtrl from './study_index/study_index_ctrl'
// import stuPassLevelsCtrl from './compute/stuPassLevelsCtrl'
// import clearLocalDataCtrl from './clear_local_data/clear_local_data_ctrl';
import organizePaper from './organize_paper';
// import personalMath from './personal_math'
// import paperDetail from './paper_detail'
// import commonProblem from './commonProblem'

let controllers = angular.module('m_boot.controllers', []);
registComponent(controllers, {
     messageListCtrl
    // ,broadcastListCtrl
    // ,trophyRankCtrl
    // ,achievementCtrl
    // ,computeCtrl
    // ,trainingPetsMaster
    // ,studyIndexCtrl
    // ,stuPassLevelsCtrl
    // ,clearLocalDataCtrl
    ,organizePaper
    // ,personalMath
    // ,paperDetail
    // ,commonProblem
},CONTROLLER_COMPONENT);

export default controllers;
