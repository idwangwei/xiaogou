/**
 * Created by liangqinli on 2017/1/13.
 */
import './style.less'
// import directives from '../../index';

export default function () {
    return {
        restrict: 'E',
        replace: true,
        template: `<a href="javascript:void(0);" class="mFormSelect" tabindex="0" 
                   ng-class="{active: actived}" ng-click="handleClick()"
                   ng-style="rootStyles" ng-blur="handleOnBlur()">
                      <div class="currentSelected">
                          <span data-value="{{currentSelected.value}}">{{currentSelected.name}}</span><i class="mIcon"></i>
                      </div>
                      <div class="options-wrap">
                          <div class="option" ng-class="{selected: currentSelected.value === option.value}" data-value="{{option.value}}" 
                          ng-repeat="option in options" ng-click="handleSelect($event,option)"
                          >{{option.name}}</div>
                      </div>
                  </a>`,
        scope: {
            options: '=',
            defaultOption: '=',
            onChange: '=',
            value: '=',
            rootStyles: '=',
            onValChange:'&'
        },
        controller: ['$scope', function ($scope) {
            $scope.displayStyle = {
            }
            $scope.handleOnBlur = function(){
                $scope.actived = false;
            }
            console.log('defaultOption: ', $scope.defaultOption, typeof $scope.defaultOption);
            try{
                if(Object.prototype.toString.apply($scope.options) !== '[object Array]'){
                    console.error('The array type option is required!');
                    return;
                }
                if(typeof $scope.defaultOption === 'number' && $scope.defaultOption < $scope.options.length){
                    $scope.currentSelected = $scope.options[$scope.defaultOption];
                    $scope.value = $scope.currentSelected.value;
                }else{
                    $scope.currentSelected = {
                        name: '--请选择--',
                        value: ''
                    }
                }
            }catch(err){
                console.error(err);
            }

            $scope.handleClick = function(){
                $scope.actived = !$scope.actived;
            }
            $scope.handleSelect = function(ev, selectOption){
                var previousValue;
                ev.stopPropagation();
                $scope.currentSelected = selectOption;
                previousValue = $scope.value;
                $scope.value = selectOption.value;
                $scope.actived = false;
                if(typeof $scope.onChange === 'function' && previousValue !== $scope.value){
                    $scope.onChange($scope.value, selectOption);
                }
                if(typeof $scope.onValChange === 'function' && previousValue !== $scope.value){
                    $scope.onValChange();
                }
            }
        }],
        link: function ($scope, element, attrs) {

        }
    }
}