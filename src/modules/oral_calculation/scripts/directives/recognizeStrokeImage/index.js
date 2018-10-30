/**
 * Created by WL on 2017/9/27.
 */
import './style.less';

export default function () {
    return {
        restrict: 'AE',
        scope: {
        },
        template: require('./page.html'),
        link: function ($scope, element, attrs, ctrl) {
            $scope.showRecognizeStroke = false;
            $scope.initData();

            $scope.$root.$on('show-recognize-stroke-image', (e,data) => {
                $scope.inputId = data.inputId;
                $scope.showRecognizeStroke = true;
                $scope.getCurrentStrokeImages();
            });

            $scope.$on('hide-recognize-stroke-image', () => {
                $scope.showRecognizeStroke = false;
            });

            $scope.$root.$on('clear-recognize-temp-images', $scope.clearTempImage);
        },
        controller: ['$scope', '$window', '$http',  function ($scope, $window, $http) {
            $scope.initData = function () {
                $scope.hostUrl = 'http://www.xuexig.cn:3001/';
                $scope.userName = $scope.$root.loginName || "18000000001S";
                $scope.showSampleTypesFlag = false;
                $scope.showScreenshotFlag = false;
                $scope.selectedImgIndex = -1;
                $scope.allImgs = [];
                $scope.allSampleTypes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '－', '干扰项'];
                $scope.addSampleFlag = true;
            };

            $scope.getPaddingTop = function () {
                return $scope.$root.platform.type == 2 ? '25px' : '5px'
            };

            $scope.getScreenshot = function () {

                return $scope.hostUrl + 'resource_oral_calculation_distracter/recognize_temp_images/'+ $scope.userName + '/total_images/'+ $scope.inputId+'.jpg';
            };

            $scope.getHeight = function () {
                let h1 = $window.screen.availHeight;
                let h2 = $window.innerHeight;
                let h = 200;
                if (h1 && h2) h = Math.min(Number(h1), Number(h2));
                if (h1 && !h2) h = Number(h1);
                if (!h1 && h2) h = Number(h2);
                return Number(h) - 135;
            };

            $scope.back = function () {
                $scope.addAssignModle("back");
                $scope.$broadcast('hide-recognize-stroke-image');
            };

            /**
             * 显示原图
             */
            $scope.showScreenshot = function () {
                $scope.showScreenshotFlag = true;
            };

            /**
             * 隐藏截图
             */
            $scope.hideScreenshot = function () {
                $scope.showScreenshotFlag = false;
            };

            /**
             * 显示所有可选择的样本
             */
            $scope.showSampleTypes = function (index) {
                $scope.selectedImgIndex = index;
                $scope.showSampleTypesFlag = true;
            };

            /**
             * 隐藏选择样本
             */
            $scope.hideSampleTypes = function () {
                $scope.showSampleTypesFlag = false;
            };

            /**
             * 选择样本
             * @param item
             */
            $scope.selectSampleType = function (item) {
                $scope.allImgs[this.selectedImgIndex].sample = item;
                $scope.hideSampleTypes();
            };

            /**
             * 取消加入样本
             * @param index
             */
            $scope.cancelAddToSample = function (index) {
                this.allImgs[index].sample = "";
            };

            /**
             * 阻止事件冒泡
             */
            $scope.stopEvent = function ($event) {
                if (typeof $event === 'object' && $event.stopPropagation) {
                    $event.stopPropagation();
                } else if (event && event.stopPropagation) {
                    event.stopPropagation();
                }
            };

            /**
             * 获取本次输入生成的图片
             */
            $scope.getCurrentStrokeImages = function () {
                $scope.addSampleFlag = true;
                let params = {
                    type: "filtrate",
                    userName: $scope.userName,
                    inputId: $scope.inputId
                };
                params = JSON.stringify(params);
                $http.post($scope.hostUrl + 'deal_recognize_image', {message: params})
                    .then(function (response) {
                        $scope.analysisData(response.data.result);
                    }, function (err) {
                        alert(err)
                    });
            };

            $scope.analysisData = function (data) {
                $scope.allImgs.length = 0;
                let imgUrlArr = data.split(',');
                imgUrlArr.forEach((v, k) => {
                    if (!v) return;
                    let obj = {};
                    obj.imgUrl = v;
                    obj.sample = "";
                    obj.recognizeResult = v.match(/\d+_(\S+)\.jpg/)[1];
                    $scope.allImgs.push(obj);
                })
            };

            /**
             * 找出所有需要加入样本的图片
             */
            $scope.findAllSelectedSample = function () {
                let selectedSamples = [];
                $scope.allImgs.forEach((v, k) => {
                    if ($scope.allImgs[k].sample !== '') {
                        selectedSamples.push($scope.allImgs[k]);
                        // selectedSamples[selectedSamples.length - 1].uuid = genUUID() + "_" + window.screenShotUuid;
                    }
                });
                return selectedSamples;
            };

            /**
             * 添加样本到指定样本文件
             */
            $scope.addAssignModle = function (type) {
                let selectSampleArr = [];
                if (type == 'back') {
                    $scope.$broadcast('hide-recognize-stroke-image');
                    return;
                }

                selectSampleArr = $scope.findAllSelectedSample();
                if (!$scope.addSampleFlag) return;
                $scope.addSampleFlag = false;
                let params = {
                    type: "saveSample",
                    samples: selectSampleArr,
                    userName: $scope.userName,
                    inputId: $scope.inputId
                };

                if (selectSampleArr.length > 0) {
                    params.saveTotalFlag = true;
                }

                $http.post($scope.hostUrl + 'deal_recognize_image', {message: JSON.stringify(params)})
                    .then(function (response) {
                        console.log(response.data.result);
                        if (type != 'back') {
                            alert(response.data.result);
                            $scope.$broadcast('hide-recognize-stroke-image');
                        }
                    }, function (err) {
                        alert(err)
                    });
            };

            $scope.clearTempImage = function () {
                let params = {
                    type: "saveSample",
                    samples: [],
                    userName: $scope.userName,
                    inputId: $scope.inputId || "id",
                };
                $http.post($scope.hostUrl + 'deal_recognize_image', {message: JSON.stringify(params)})
                    .then(function (response) {
                        if (response.data.result == "ok") {
                            console.log(response.data.result)
                        }
                    }, function (err) {
                        console.log(err)
                    });
            }
        }]
    }
}
