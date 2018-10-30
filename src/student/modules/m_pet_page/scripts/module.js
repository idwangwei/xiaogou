/**
 * Created by ZL on 2018/1/12.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';
let m_pet_page = angular.module('m_pet_page', [
    'm_pet_page.directives'
]);
registerModule(m_pet_page);
export {m_pet_page};
export * from 'ngDecoratorForStudent/ng-decorator';