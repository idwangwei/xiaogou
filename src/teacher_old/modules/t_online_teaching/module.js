import {
    Inject,
    ViewDecorator,
    View,
    Directive,
    Component,
    select,
    actionCreator,
    registerModule
} from 'ngDecoratorForStudent/ng-decorator';
let mOnlineTeachingModule = angular.module('t_online_teaching',[]);
registerModule(mOnlineTeachingModule);
export {
    Inject,
    ViewDecorator,
    View,
    Directive,
    Component,
    select,
    actionCreator,
    registerModule,
    mOnlineTeachingModule
}
