/**
 * Created by LuoWen on 2016/8/2.
 */

//import verticalCellCtrl from './verticalCellCtrl'
import verticalCtrl from './verticalCtrl'


export default ["$compile", ($compile)=> {
    return {
        restrict: 'E',
        template: require("../verticalCell.html"),
        controllerAs: 'ctrl',
        scope: {
            cell: '='
        },
        require:"^vertical",
        link: function ($scope, $element, $attr, controller) {
            // $scope.$watch('cell.val',function (val) {
            //      console.log(JSON.stringify(val))
            // })
            // $scope.wrappedCell = {
            //     cell
            // };
            /*$scope.$watch($attr.cellData, function (val) {
                console.log("vertical directive...")
                //$element.html(controller.getKeyboardAddContentVal(val));
            });*/
        }
    };
}];

