/**
 * Created by 彭建伦 on 2015/7/8.
 */

// import workGeneratePaperCtrl from "./work_statistics/work_generate_paper_ctrl";
// import qFeedbackCtrl from "./work_statistics/q_feedback_ctrl";
import {CONTROLLER_COMPONENT, registComponent} from "module_register/module_register";
// import paperMath from '../pages/paper_math'

let controllers = angular.module('app.controllers', []);
registComponent(controllers, {
    // workGeneratePaperCtrl
    // ,qFeedbackCtrl
    // ,paperMath
},CONTROLLER_COMPONENT);

export default controllers;
