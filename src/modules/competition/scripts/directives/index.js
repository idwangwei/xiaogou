/**
 * Created by Administrator on 2017/3/18.
 */
import competitionAdd from "./competitionAdd/competitionAdd";
import stuCompWork from './studentCompetition';
import competitionAddTipStu from './competitionAddTipStu/competitionAddTipStu';
import competitionAddTipTeacher from './competitionAddTipTeacher/competitionAddTipTeacher';
import countdown from './countDown';
import teaCompWork from './teacherCompetition';
import competitionAlertBox from './competitionAlertBox';

let directives = angular.module('competition.directives', []);
directives.directive("competitionAdd", competitionAdd)
    .directive('stuCompWork', stuCompWork)
    .directive('countdown', countdown)
    .directive('teaCompWork', teaCompWork)
    .directive('competitionAddTipStu', competitionAddTipStu)
    .directive('competitionAddTipTeacher', competitionAddTipTeacher)
    .directive('competitionAlertBox',competitionAlertBox);
