/**
 * Created by pengjianlun on 15-12-29.
 * 资源加载界面和加载ios的cordova
 */

var loadingTemplate = document.createElement('div');
loadingTemplate.setAttribute('class', 'loadingScene loadingSceneHide');
var loadingPacMan = document.createElement('img');
loadingPacMan.setAttribute('src', 'images/logo.gif');
loadingPacMan.setAttribute('width', '250px');
loadingPacMan.setAttribute('height', '250px');

var htmlStrs=[
    ['学习就像跑马拉松一样','贵在坚持和耐久'],
    ['太阳每天都是新的','你是否每天都在努力']
];
var index = Math.floor(Math.random()*10)%2;

var loadingDesc = document.createElement('p');
loadingDesc.setAttribute('style', 'width:100%;text-align:center;color: #1973ac;font-weight: bolder;font-size: 16px;');
loadingDesc.innerHTML=htmlStrs[index][0];
var loadingDesc1 = document.createElement('p');
loadingDesc1.setAttribute('style', 'width:100%;text-align:center;color: #1973ac;font-weight: bolder;font-size: 16px;');
loadingDesc1.innerHTML=htmlStrs[index][1];

loadingTemplate.appendChild(loadingPacMan);
// loadingTemplate.appendChild(loadingDesc);
// loadingTemplate.appendChild(loadingDesc1);

var loadingScene = {
    show: function () {
        var loadingScene = document.querySelector('.loadingScene');
        if (loadingScene) {
            loadingScene.setAttribute("class", "loadingScene loadingSceneShow");
        } else {
            document.documentElement.appendChild(loadingTemplate);
            loadingScene = document.querySelector('.loadingScene');
            loadingScene.setAttribute("class", "loadingScene loadingSceneShow");
        }
    },
    hide: function () {
        var loadingScene = document.querySelector('.loadingScene');
        if (loadingScene) {
            loadingScene.setAttribute("class", "loadingScene loadingSceneHide");
        }
    },
    loadCordova: function () {
        try {
            var pathStr = localStorage.assetPath;
            var indexUrlArray = JSON.parse(pathStr).url.split('/');
            var cordovaPathArray = indexUrlArray.splice(0, indexUrlArray.length - 1);
            var cordovaUrl = cordovaPathArray.join('/') + '/cordova.js';
            var script = document.createElement('script');
            script.setAttribute('src', cordovaUrl);
            document.documentElement.appendChild(script);
        } catch (e) {
            console.log(e);
        }
    }
};
//loadingScene.show();

localStorage.setItem("dirLocal", 0); //一旦进入作业端，就设置当前的场景编码

if (typeof module === "object" && module && typeof module.exports === "object") {
    module.exports = loadingScene;
} else {
    window.loadingScene = loadingScene;
    loadingScene.loadCordova();
    loadingScene.show();
}





