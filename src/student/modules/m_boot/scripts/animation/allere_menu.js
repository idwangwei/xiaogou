/**
 * Created by 邓小龙 on 2016/11/1.
 */
import animation from './index';
animation.animation('.allereMenu', [function() {
    return {
        // make note that other events (like addClass/removeClass)
        // have different function input parameters
        enter: function(element, doneFn) {
            element.hide().slideDown(1200, doneFn);
            // remember to call doneFn so that angular
            // knows that the animation has concluded
        },

        leave: function(element, doneFn) {
            element.slideUp(500, doneFn);
        }
    }
}]);