/**
 * Created by ZL on 2017/11/28.
 */

import videoKeyboard from './video_keyboard/index';
import videoOption from './video_option/index';
import videoItem from './video_item/index';
// import microlectureAd from './microlecture_ad/index';

let directives = angular.module('m_olympic_math_microlecture.directives',[]);
directives.directive('videoKeyboard', videoKeyboard);
directives.directive('videoOption', videoOption);
directives.directive('videoItem', videoItem);
// directives.directive('microlectureAd', microlectureAd);
