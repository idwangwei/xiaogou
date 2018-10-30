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
import './directives/index';
let homeModule = angular.module('m_home',[
    'm_home.directives',
]);
registerModule(homeModule);
export {
    Inject,
    ViewDecorator,
    View,
    Directive,
    Component,
    select,
    actionCreator,
    registerModule,
    homeModule
}
