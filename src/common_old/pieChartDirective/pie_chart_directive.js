/**
 * Created by 邓小龙 on 2016/8/10.
 * 饼图插件封装指令
 */
import d3 from "./source/d3.min";
import D3pie from "./source/d3pie.min";
import $ from "jquery";

class PieChartCtrl{
    constructor($scope){
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        if(this.screenWidth<760){
            this.canvasHeight=150;
            this.canvasWidth=150;
        }else if(this.screenWidth>=760&&this.screenWidth<1024){
            this.canvasHeight=220;
            this.canvasWidth=340;
        }else{
            this.canvasHeight=260;
            this.canvasWidth=420;
        }

        //默认配置
        this.config={
            header: {
                title: {
                    text: "",
                    fontSize:16
                }
            },
            size: {
                canvasHeight: this.canvasHeight,
                canvasWidth: this.canvasWidth,
                pieInnerRadius:"30%",
                pieOuterRadius:"85%"
            },
            data: {
                sortOrder: "label-asc",
                content: [
                    { label: "", value: 1 },
                    { label: "", value: 2 },
                    { label: "", value: 3 },
                    { label: "", value: 2 },
                    { label: "", value: 6 }
                ]
            }
        };
        $scope.$on('$destroy', ()=> {
            if($scope.chart.instance){
                $scope.chart.instance.destroy();
                $scope.chart.instance=null;
            }
        });
    }


    createPie(setting,attrs,chart){
        this.config.header=setting.header?setting.header:this.config.header;
        this.config.size=setting.size?setting.size:this.config.size;
        this.config.labels=setting.labels?setting.labels:{};
        this.config.data=setting.data?setting.data:this.config.data;
        this.config.tooltips=setting.tooltips?setting.tooltips:{};

        let pie = new D3pie(attrs["id"], this.config);
        chart.instance=pie;
    }
}

PieChartCtrl.$inject=["$scope"];
let pieChartDirective=angular.module("pieChartDirective",[]);

pieChartDirective.controller("pieChartCtrl",PieChartCtrl);
pieChartDirective.directive("pieChart",function () {
    return {
        restrict:"EA",
        scope:{
            settings:"=",
            chart:'='
        },
        controller:"pieChartCtrl as ctrl",
        link:function ($scope,ele,attrs,ctrl) {
            if(!attrs["id"]){
                console.error("目标dom元素需要指定id...");
                return;
            }
            if($scope.chart.instance){
                $scope.chart.instance.destroy();
                $scope.chart.instance=null;
            }
            ctrl.createPie($scope.settings,attrs,$scope.chart);

        }
    }
});
