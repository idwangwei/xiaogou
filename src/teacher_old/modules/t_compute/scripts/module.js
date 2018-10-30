/**
 * Created by ZL on 2018/3/15.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';

let t_compute = angular.module('t_compute', []);
registerModule(t_compute);
export {t_compute};
export * from 'ngDecoratorForStudent/ng-decorator';