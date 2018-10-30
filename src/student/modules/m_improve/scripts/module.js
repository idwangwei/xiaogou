/**
 * Created by ZL on 2018/2/1.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';
let m_improve = angular.module('m_improve', [
]);
registerModule(m_improve);
m_improve.run(['$rootScope',($root)=>{
    // $root.loadImproveImg = (imgUrl)=> {
    //     return require('../images/' + imgUrl);
    // };
}]);
export {m_improve};
export * from 'ngDecoratorForStudent/ng-decorator';