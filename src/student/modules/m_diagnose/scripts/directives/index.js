/**
 * Created by ZL on 2018/1/12.
 */
import petIconGuide from './pet_icon_guide';
import petIcon from './petIcon';
let directives = angular.module("m_diagnose.directives", []);

directives
    .directive("petIconGuide", petIconGuide)
    .directive("petIcon", petIcon)