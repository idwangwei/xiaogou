/**
 * Created by qiyuexi on 2017/11/9.
 */
/*渲染canvas*/
function drawWheelCanvas(obj){
    this.obj=obj;
    this.zoom=4;
    this.maxLen=obj.goods.length;//长度
    // 获取canvas画板
    this.canvas = document.getElementById("wheelCanvas");
    /*初始化canvas的高宽*/
    this.canvas.width=310*this.zoom;
    this.canvas.height=this.canvas.width;
    this.obj.outsideRadius=this.canvas.width/2-5*this.zoom;
    this.obj.textRadius=this.obj.outsideRadius-36*this.zoom;
    // 计算每块占的角度，弧度制
    this.baseAngle = Math.PI * 2 / (this.obj.goods.length);
    // 获取上下文
    this.ctx=this.canvas.getContext("2d");
    this.canvasW = this.canvas.width; // 画板的高度
    this.canvasH = this.canvas.height; // 画板的宽度
    //在给定矩形内清空一个矩形
    this.ctx.clearRect(0,0,this.canvasW,this.canvasH);

    //strokeStyle 绘制颜色
    this.ctx.strokeStyle = "#fdbf82";
    //font 画布上文本内容的当前字体属性
    this.ctx.font = 12*this.zoom+'px Microsoft YaHei';
    this.init();
}
drawWheelCanvas.prototype={
    init(){
        this.drawAll();
    },
    drawAll(){
        // 画具体内容
        preloadimages(this.obj).then(()=>{
            for(var i = 0 ; i < this.obj.goods.length ; i++)
            {
                this.drawItem(i);
            }
        })
    },
    drawItem(i,win){
        var good=this.obj.goods[i];
        // 当前的角度
        var angle = this.obj.startAngle + i * this.baseAngle-Math.PI/2;

        // 填充颜色
        this.ctx.fillStyle = win?"#ffb66e":(i%2==0||this.maxLen%2!=0?"#fce096":"#fdbf82");

        // 开始画内容
        // ---------基本的背景颜色----------
        this.ctx.beginPath();
        /*
         * 画圆弧，和IOS的Quartz2D类似
         * context.arc(x,y,r,sAngle,eAngle,counterclockwise);
         * x :圆的中心点x
         * y :圆的中心点x
         * sAngle,eAngle :起始角度、结束角度
         * counterclockwise : 绘制方向,可选，False = 顺时针，true = 逆时针
         * */
        this.ctx.arc(this.canvasW * 0.5, this.canvasH * 0.5, this.obj.outsideRadius, angle, angle + this.baseAngle-Math.PI/360, false);
        this.ctx.arc(this.canvasW * 0.5, this.canvasH * 0.5, this.obj.insideRadius, angle + this.baseAngle-Math.PI/360, angle, true);
        this.ctx.stroke();
        this.ctx.fill();
        //保存画布的状态，和图形上下文栈类似，后面可以Restore还原状态（坐标还原为当前的0，0），
        this.ctx.save();
        /*----绘制奖品内容----重点----*/
        // 字体颜色
        this.ctx.fillStyle = "#f74f46";
        //设置字体
        this.ctx.font ='bold  '+(12*this.zoom)+'px Microsoft YaHei';
        var rewardName = good.text;
        var line_height = 17*this.zoom;//两行文字情况
        // translate方法重新映射画布上的 (0,0) 位置
        // context.translate(x,y);
        var translateX =  this.canvasW * 0.5 + Math.cos(angle + this.baseAngle / 2) * this.obj.textRadius;
        var translateY =  this.canvasH * 0.5 + Math.sin(angle + this.baseAngle / 2) * this.obj.textRadius;
        this.ctx.translate(translateX,translateY);

        // rotate方法旋转当前的绘图，因为文字适合当前扇形中心线垂直的！
        // angle，当前扇形自身旋转的角度 +  baseAngle / 2 中心线多旋转的角度  + 垂直的角度90°
        this.ctx.rotate(angle + this.baseAngle / 2 + Math.PI / 2);
        /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
        // canvas 的 measureText() 方法返回包含一个对象，该对象包含以像素计的指定字体宽度。
        // fillText() 方法在画布上绘制填色的文本。文本的默认颜色是黑色. fillStyle 属性以另一种颜色/渐变来渲染文本
        /*
         * context.fillText(text,x,y,maxWidth);
         * 注意！！！y是文字的最底部的值，并不是top的值！！！
         * */
        var img =new Image();
        img.src = good.img;
        var k=.7;
        var imgW=img.width*k*this.zoom;
        var imgH=img.height*k*this.zoom;
        if(imgW>50*this.zoom){
            k=imgW/(40*this.zoom)
            imgW=40*this.zoom;
            imgH=imgH/k;
        }
        if(rewardName.length>6&&false){//奖品名称长度超过一定范围 先暂时占一行
            rewardName = rewardName.substring(0,6)+"||"+rewardName.substring(6);
            var rewardNames = rewardName.split("||");
            for(var j = 0; j<rewardNames.length; j++){
                this.ctx.fillText(rewardNames[j], -this.ctx.measureText(rewardNames[j]).width / 2, j * line_height);
            }
            this.ctx.drawImage(img,-imgW/2,12*this.zoom+line_height,imgW,imgH);
        }else{
            this.ctx.fillText(rewardName, -this.ctx.measureText(rewardName).width / 2, 0);
            this.ctx.drawImage(img,-imgW/2,12*this.zoom,imgW,imgH);
        }

//            ctx.drawImage(imgSorry,-15,10);
        //还原画板的状态到上一个save()状态之前
        this.ctx.restore();

        /*----绘制奖品结束----*/
    },
    /*只加载一个*/
    drawOne(i,win){
        preloadimages({goods:new Array(1).fill(this.obj.goods[i])}).then(()=>{
            this.drawItem(i,win);
        })
    },
    /*重新加载*/
    reDraw(){
        this.drawAll();
    }
}
//对奖品图片预加载
function  preloadimages({goods}){
    return new Promise((resolve,reject)=>{
        var newimages =[], loadedimages =0
        goods =(typeof goods !="object")?[goods]: goods
        function imageloadpost(){
            loadedimages++
            if(loadedimages == goods.length){
                resolve(newimages)
            }
        }
        for(var i =0; i < goods.length; i++){
            newimages[i]=new Image()
            newimages[i].src = goods[i].img;
            newimages[i].onload =function(){
                imageloadpost()
            }
            newimages[i].onerror =function(){
                imageloadpost()
            }
        }
    })
}

//计算旋转角度
function  getAwardInfo(id,goods){
    var currentIndex=0,
        baseAngle=360/goods.length;
    goods.forEach(function (x,i) {
        if(x.id==id){
            currentIndex=i;
        }
    })
    return {
        angle : 360-(baseAngle*currentIndex+Math.floor(Math.random()*(baseAngle-10))+5),
        good:goods[currentIndex],
        index:currentIndex
    }
}

export {
    drawWheelCanvas,
    getAwardInfo
}