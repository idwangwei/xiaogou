/**
 * Created by pengjianlun on 15-12-29.
 * 资源加载界面和加载ios的cordova
 */
import  img from '../images/logo.gif';
import '../css/loadingScene.css';

let loadingScene = null;
class LoadingScene {
    constructor() {
        this.loadingDiv = null;
        this.generateNodes();
    }

    generateNodes() {
        let htmlStrs=[
            ['学习就像跑马拉松一样','贵在坚持和耐久'],
            ['太阳每天都是新的','你是否每天都在努力']
        ];
        let index = Math.floor(Math.random()*10)%2;

        this.loadingDiv = document.createElement('div');
        this.loadingDiv.setAttribute('class', 'loadingScene loadingSceneHide');
        let loadingSplash = document.createElement('img');
        loadingSplash.setAttribute('src', img);
        loadingSplash.setAttribute('width', '60%');
        loadingSplash.setAttribute('maxHeight', '540px');
        loadingSplash.setAttribute('maxWidth', '540px');

        let loadingDesc = document.createElement('p');
        loadingDesc.setAttribute('style', 'width:100%;text-align:center;color: #1973ac;font-weight: bolder;font-size: 16px;');
        loadingDesc.innerHTML=htmlStrs[index][0];
        let loadingDesc1 = document.createElement('p');
        loadingDesc1.setAttribute('style', 'width:100%;text-align:center;color: #1973ac;font-weight: bolder;font-size: 16px;');
        loadingDesc1.innerHTML=htmlStrs[index][1];


        this.loadingDiv.appendChild(loadingSplash);
        // this.loadingDiv.appendChild(loadingDesc);
        // this.loadingDiv.appendChild(loadingDesc1);
        document.body.appendChild(this.loadingDiv)
    }


    show() {
        this.loadingDiv.setAttribute('class', 'loadingScene loadingSceneShow');
    }

    hide() {
        this.loadingDiv.setAttribute('class', 'loadingScene loadingSceneHide');
    }

    loadCordova() {
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

    static getLoadingScene() {
        if (!loadingScene)
            loadingScene = new LoadingScene();
        return loadingScene;
    }
}
export default LoadingScene.getLoadingScene();





