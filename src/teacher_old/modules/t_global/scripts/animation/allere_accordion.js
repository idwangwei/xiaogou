/**
 * Created by 邓小龙 on 2016/11/1.
 */
export default function() {
    return {
        // make note that other events (like addClass/removeClass)
        // have different function input parameters
        enter: function(element, doneFn) {
            element.hide().slideDown(200, doneFn);
            // remember to call doneFn so that angular
            // knows that the animation has concluded
        },

        leave: function(element, doneFn) {
            element.slideUp(200, doneFn);
        }
    }
};