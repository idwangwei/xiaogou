/**
 * Created by ZL on 2018/1/4.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';
let m_me = angular.module('m_me', []);
registerModule(m_me);
export {m_me};
export * from 'ngDecoratorForStudent/ng-decorator';