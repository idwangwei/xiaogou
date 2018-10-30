import {registerModule} from 'ngDecoratorForStudent/ng-decorator';
import reducers from "./redux/index";
import * as defaultStates from './redux/default_states/index';

let olympicMathMicrolecture = angular.module('m_olympic_math_microlecture', [
    'm_olympic_math_microlecture.directives',
]);
registerModule(olympicMathMicrolecture, reducers, defaultStates);

olympicMathMicrolecture.run(['$rootScope', '$compile', '$timeout','$state','$window', ($root, $compile, $timeout,$state,$window)=> {

    /*$timeout(()=> {
        //显示奥数微课广告
        if ($root.compileMicrolectureAdToHomePage === undefined) {
            let ad = $('<microlecture-ad ng-show="$root.showOlympicMathMicrolectureAd"></microlecture-ad>');
            $('body').append(ad);
            $compile(ad)($root);
            $root.compileMicrolectureAdToHomePage = true;
        }
    }, 100)*/

    $window.document.addEventListener("pause", ()=> {
        if ($state.current.name === 'micro_lecture_video_page') {
            $root.$broadcast('pauseMicroLectureVideo');
        }
    });

    console.log('model m_olympic_math_microlecture install======================');
}]);

export {olympicMathMicrolecture}
export * from 'ngDecoratorForStudent/ng-decorator'
