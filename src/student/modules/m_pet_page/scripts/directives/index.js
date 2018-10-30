/**
 * Created by ZL on 2018/1/12.
 */
import petImgAnimation from './pet_img_animation/index';
import petGetFood from './pet_get_food/index';
import petLevelUp from './pet_level_up/index';
let directives = angular.module("m_pet_page.directives", []);

directives
    .directive("petImgAnimation", petImgAnimation)
    .directive("petGetFood", petGetFood)
    .directive("petLevelUp", petLevelUp);