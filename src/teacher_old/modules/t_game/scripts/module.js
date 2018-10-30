/**
 * Created by ZL on 2018/3/14.
 */
import {registerModule} from 'ngDecoratorForStudent/ng-decorator';

let t_game = angular.module('t_game', []);
registerModule(t_game);
export {t_game};
export * from 'ngDecoratorForStudent/ng-decorator';