/**
 * Created by ZL on 2018/1/29.
 */

// import winterCampAd from './winter_camp_ad/index';
import  winterCampAllCourses from './winter_camp_all_courses/index'
import  winterCampRewardPrompt from './winterCamprewardPrompt/index'

let directives = angular.module("m_winter_camp.directives",[]);
// directives.directive('winterCampAd',winterCampAd);
directives.directive('winterCampAllCourses',winterCampAllCourses);
directives.directive('winterCampRewardPrompt',winterCampRewardPrompt);