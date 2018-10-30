/**
 * Created by Administrator on 2017/3/31.
 */

class recordPlayer {
    constructor() {

        this.config = null;
        this.ruler = null;
        this.triangle = null;
        this.renderer = null;
        this.timer = null;
    }

    initPlayerData(data, ruler, triangle, renderer, toolText) {
        this.config = data.config;
        this.rulerPostion = data.rulerPosition;
        this.trianglePostion = data.trianglePosition;
        this.rulerRotation = data.rulerRotation || 0;
        this.triangleRotation = data.triangleRotation || 0;
        this.toolText = toolText;
        this.ruler = ruler;
        this.triangle = triangle;
        this.renderer = renderer;
        this.playFlag = true;
        this.target = null;
        this.pathPoint = [];
        this.point = [];
        this.degree = 0;
        this.actionType = '';
        this.index = 0;
        this.waitTool = null;
        this.dealConfigObj = null;
        this.animateObj = null;
        this.currentShowText = null;
        this.currentFlagText = null;
    }

    /**
     * 播放路径
     */
    recordPlaying(stuPlayingFlag) {
        if (!this.config || this.config.length == 0) return;
        // this.playFlag = true;
        this.initTargeStatus(stuPlayingFlag);
        if (this.dealConfigObj) cancelAnimationFrame(this.dealConfigObj);
        if (this.animateObj) cancelAnimationFrame(this.animateObj);
        this.dealConfigObj = requestAnimationFrame(this.dealConfig.bind(this));
        this.animateObj = requestAnimationFrame(this.__animate.bind(this));
    }
    
    cancleAnimate(){
        if (this.dealConfigObj) cancelAnimationFrame(this.dealConfigObj);
        if (this.animateObj) cancelAnimationFrame(this.animateObj);
    }

    initTargeStatus(stuPlayingFlag) {
        this.ruler.position.x = this.rulerPostion[0];
        this.ruler.position.y = this.rulerPostion[1];
        this.ruler.rotation = this.rulerRotation;
        this.triangle.position.x = this.trianglePostion[0];
        this.triangle.position.y = this.trianglePostion[1];
        this.triangle.rotation = this.triangleRotation;

        if(stuPlayingFlag)return;
        angular.forEach(this.toolText.ruler.unitArr, (unit)=> {
            unit.alpha = 0;
        });
        angular.forEach(this.toolText.triangle.rectFlagArr, (rect)=> {
            rect.alpha = 0;
        });
        if(this.currentShowText){
            this.currentShowText.alpha = 0;
            this.currentShowText = null;
        }
    }

    /**
     * 动画
     */
    __animate() {
        if (!this.playFlag) return;
        if (+this.target.backIndex != this.target.backIndex) {
            this.target.backIndex = 20;
        }
        if (this.actionType == 'move' && this.pathPoint.length > 0) {
            this.point = this.pathPoint.shift();
            if (this.actionType == 'move' && !this.point) return;
            if (this.actionType == 'move' && this.point.length == 0) return;
        }
        if (this.actionType == 'move') {
            this.target.waitTime = 0;
            this.target.backIndex = 20;
            this.target.position.x = this.point[0];
            this.target.position.y = this.point[1];
            if (this.pathPoint.length == 0) {
                this.index += 1;
            }

        } else if (this.actionType == 'rotate') {
            this.target.waitTime = 0;
            this.target.backIndex = 20;
            this.target.rotation = this.target.rotation || 0;
            let tempr = this.degree - this.target.rotation;
            if (Math.abs(tempr) > 0.05 && tempr > 0) this.target.rotation += 0.05;
            if (Math.abs(tempr) > 0.05 && tempr < 0) this.target.rotation -= 0.05;
            if (Math.abs(tempr) <= 0.05) {
                this.target.rotation = this.degree;
                this.index += 1;
            }
        }
        else if (this.actionType == 'wait') {
            this.target.backIndex = 20;
            if (this.textName && !this.currentShowText) {
                this.currentShowText = this.getShowText(this.textName);
                if (this.currentShowText) {
                    this.currentShowText.alpha = 1;
                }
            }

            let temp = 2;
            let tempr = temp - this.target.waitTime;
            if (Math.abs(tempr) > 0.05 && tempr > 0) this.target.waitTime += 0.05;
            if (Math.abs(tempr) <= 0.05) {
                if (this.currentShowText) {
                    this.currentShowText.alpha = 0;
                    this.currentShowText = null;
                }

                this.target.waitTime = temp;
                this.index += 1;
                if (this.currentFlagText) {
                    this.currentFlagText.alpha = 1;
                    this.currentFlagText = null;
                }
            }
        }
        else if (this.actionType == "back") {
            this.target.rotation = this.target.rotation || 0;
            let tempr = this.degree - this.target.rotation;
            if (Math.abs(tempr) > 0.05 && tempr > 0) this.target.rotation += 0.05;
            if (Math.abs(tempr) > 0.05 && tempr < 0) this.target.rotation -= 0.05;

            if (Math.abs(tempr) <= 0.05) {
                this.target.rotation = this.degree;
                let point = this.pathPoint[0];
                if (this.target.backIndex > 0) {
                    let lenX = (point[0] - this.target.x) / this.target.backIndex;
                    let lenY = (point[1] - this.target.y) / this.target.backIndex;
                    this.target.x += lenX;
                    this.target.y += lenY;
                    this.target.backIndex--;
                } else {
                    this.target.x = point[0];
                    this.target.y = point[1];
                    this.pathPoint.shift();
                    this.index += 1;
                }
            }
        }

        if (this.animateObj) cancelAnimationFrame(this.animateObj);
        this.animateObj = requestAnimationFrame(this.__animate.bind(this));
    }

    dealConfig() {
        if (!this.config || this.config && this.config.length == 0) return;
        if (!this.playFlag) return;

        if (this.index >= this.config.length) {
            this.playFlag = false;
            return;
        }
        this.target = null;
        this.flagIndex = this.config[this.index].textFlagIndex;
        if (this.config[this.index].target == 'ruler') {
            this.target = this.ruler;
            this.waitTool = this.triangle;
            if (+this.flagIndex === this.flagIndex) {
                this.currentFlagText = this.toolText.ruler.unitArr[this.flagIndex];
            }
        }
        if (this.config[this.index].target == 'triangle') {
            this.target = this.triangle;
            this.waitTool = this.ruler;
            if (+this.flagIndex === this.flagIndex) {
                this.currentFlagText = this.toolText.triangle.rectFlagArr[this.flagIndex];
            }
        }
        // this.pathPoint = lodash_assign([], this.config[this.index].path) || [];
        if ((this.config[this.index].action == 'move' || this.config[this.index].action == 'back') && this.pathPoint.length == 0) {
            this.pathPoint.length = 0;
            this.pathPoint = this.deepcopy(this.config[this.index].path);//this.config[this.index].path;
        }
        this.actionType = this.config[this.index].action;
        this.degree = this.config[this.index].degree || 0;
        this.textName = this.config[this.index].textName || null;
        if (this.dealConfigObj) cancelAnimationFrame(this.dealConfigObj);
        this.dealConfigObj = requestAnimationFrame(this.dealConfig.bind(this));
    }

    deepcopy(obj) {
        if (!obj || obj && obj.length == 0) return [];
        var out = [], i = 0, len = obj.length;
        for (; i < len; i++) {
            if (obj[i] instanceof Array) {
                out[i] = this.deepcopy(obj[i]);
            }
            else out[i] = obj[i];
        }
        return out;
    }

    getShowText(name) {
        let spr;
        switch (name) {
            case "width":
                spr = this.toolText.ruler.descWidthCon;
                break;
            case "height":
                spr = this.toolText.ruler.descHeightCon;
                break;
            case "rotate":
                spr = this.toolText.triangle.descCon;
                break;
        }
        return spr;
    }


}

export default recordPlayer;