/**
 * Created by ZL on 2018/1/4.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';
let m_diagnose_pk = angular.module('m_diagnose_pk', [
    'm_diagnose_pk.services'
]);
registerModule(m_diagnose_pk);
export {m_diagnose_pk};
export * from 'ngDecoratorForStudent/ng-decorator';