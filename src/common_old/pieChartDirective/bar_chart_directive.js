/**
 * Created by ww on 2017/3/30.
 * 柱状图插件封装指令
 */
import d3 from "./source/d3.js";
import './bar_chart.css';
import _keys from 'lodash.keys';
import _values from 'lodash.values';

angular.module("barChartDirective", [])
    .directive("barChart", ()=> {
        return {
            restrict: "EA",
            scope: {
                selectData: "=",
                questionId:'='
            },
            template: '<div class="bar-chart-css"></div>',
            replace:true,
            link: ($scope, ele, attrs) => {
                $scope.selectData = $scope.selectData || {A:12,B:9};
                let selectDataKeys = _keys($scope.selectData);
                let selectDataValues = _values($scope.selectData);
                //确定画布的大小
                let width = 200, height = 200;

                //矩形之间的空白
                let rectPadding = 10;

                //在 body 里添加一个 SVG 画布
                $(ele).attr('id',$scope.questionId);
                let svg = d3.select(ele[0]).append("svg").attr("width", width)
                    .attr("height", height);

                //定义画布周围空白的地方
                let padding = {left: 40, right: 40, top: 20, bottom: 20};

                //x轴的比例尺
                let xScale = d3.scale.ordinal()
                    .domain(selectDataKeys)
                    .rangeBands([0, width - padding.left - padding.right]);
                let yScale = d3.scale.linear()
                    .domain([0, d3.max(selectDataValues)])
                    .range([height - padding.top - padding.bottom, 0]);
                //定义x轴
                let xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");
                //定义y轴
                let yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");
                //添加矩形元素
                let rects = svg.selectAll(".MyRect")
                    .data(selectDataValues)
                    .enter()
                    .append("rect")
                    .attr("class", "MyRect")
                    .attr("fill", "#d2f7ef")
                    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
                    .attr("x", (d, i)=> {
                        return xScale.range()[i] + rectPadding / 2;
                    })
                    .attr("y", (d) => {
                        return yScale(d);
                    })
                    .attr("width", xScale.rangeBand() - rectPadding)
                    .attr("height", (d) => {
                        return height - padding.top - padding.bottom - yScale(d);
                    });
                //添加文字元素
                let texts = svg.selectAll(".MyText")
                    .data(selectDataValues)
                    .enter()
                    .append("text")
                    .attr("class", "MyText")
                    .attr("fill", "#387ef5")
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
                    .attr("x", (d, i) => {
                        return xScale.range()[i] + rectPadding / 2;
                    })
                    .attr("y", (d) => {
                        return yScale(d);
                    })
                    .attr("dx", () => {
                        return (xScale.rangeBand() - rectPadding) / 2;
                    })
                    .attr("dy", '-2')
                    .text((d) => {
                        return d;
                    });
                //添加x轴
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
                    .call(xAxis);
                //添加y轴
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
                    .call(yAxis);
                //文字选项
                svg.append('text')
                    .attr('class', 'axis-text-font')
                    .attr('x', () => {
                        return xScale.rangeExtent()[1] + padding.left;
                    })
                    .attr('y', () => {
                        return yScale.range()[0] + padding.top;
                    })
                    .attr('dx', '2')
                    .attr('dy', '12')
                    .text('选项');
                //文字人数
                svg.append('text')
                    .attr('class', 'axis-text-font')
                    .attr('x', '0')
                    .attr('y', '0')
                    .attr('dy', '16')
                    .text('人数');
            }
        }
    });
