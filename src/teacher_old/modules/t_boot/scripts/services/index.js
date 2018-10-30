/**
 * created by �?�� on 2015/7/23
 */
import gameRepoService from "./game_repo/game_repo_service";
import {SERVICE_COMPONENT, registComponent} from "module_register/module_register";
import workGeneratePaperService from "./work_statistics/work_generate_paper_server";
import workPaperBankService from "./work_statistics/work_paper_bank_service";

import clazzService from "./clazz_service";
import teacherProfileService from "./profile/teacher_profile_service";
import baseInfoService from "./bese_info_service";

import gameManageService from  "./game_manage_service";
// import rapidCalcCountService from '../../../t_compute/scripts/services/rapid_calc_count/rapid_calc_count_service';
// import studentListService from './clazz/student_list_service';
import diagnoseService from './diagnose_service';
import moreInfoManageService from './more_info_manage_service';
// import omClazzService from './olympiad_math_clazz_service';
import teacherShareService from './teacher_share_service';
import stuWorkReportService from './work_report_service';

import pubWorkService from './work_statistics/pub_work_service';
import creditsInfoService from './t_credits_store/credits_info_service';


let services = angular.module('app.services', []);
registComponent(services,{
     gameRepoService
    ,workGeneratePaperService
    ,workPaperBankService
    ,clazzService
    ,baseInfoService
    ,teacherProfileService
    ,gameManageService
    // ,rapidCalcCountService
    // ,studentListService
    ,diagnoseService
    ,moreInfoManageService
    // ,omClazzService
    ,teacherShareService
    ,stuWorkReportService
    ,pubWorkService
    ,creditsInfoService
},SERVICE_COMPONENT);

export default services;
