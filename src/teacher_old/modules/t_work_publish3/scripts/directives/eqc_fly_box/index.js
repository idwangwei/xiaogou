/**
 * Created by ww on 16-12-29.
 */
export default function ($timeout) {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        scope:{
            id:"=questionId",
            isFlyBox:"="
        },
        link: function ($scope, $element, $attrs) {

            let clickCheckBox = $(".eqc_detail_file .eqc_detail_content #" + $scope.id);
            $element.css({
                "height": "24px",
                "width": "24px",
                "background": "#387ef5",
                "position": "absolute",
                "zIndex": 100,
                "borderRadius": "50%",
                "top":clickCheckBox.offset().top+"px",
                "left":"25px",
                "display":"none",
            });
            $timeout(()=>{
                $element.css("display","block");
                $element.animate({
                    "top":$element.position().top + window.screen.availHeight - clickCheckBox.offset().top - 40 +"px",
                    "left":$(".eqc_detail_file ion-footer-bar .eqc_detail_footer_btn .ion-android-folder").offset().left +"px"
                },600,undefined,()=>{$scope.$apply(()=>{$scope.isFlyBox = false})})
            });
        }
    }
}
