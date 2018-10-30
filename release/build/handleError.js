/**
 * Created by qiyuexi on 2018/4/2.
 */
(function () {
    /**/
    var errCount=0,clickMark="",key="1234121213241324",clickCount=0,isDebug=false;//12123434132411332244
    var controlBtn=$("<div style='display:none;position: fixed;width: 30px;height: 30px;z-index: 10000;background: red;right: 20px;bottom: 60px'></div>");//控制显示的按钮
    var controlDiv=$("<div id='handleErrorBox' style='display:none;padding:40px 10px 20px;position: fixed;width: 100vw;height: 100vh;overflow-y: scroll;left: 0;top:0;z-index: 10001;background: #000'></div>");
    var hideBtn=$("<div style='position: absolute;right: 5px;top: 35px;width: 30px;height: 30px;background: #999;color: #fff'>隐</div>")
    var destroyBtn=$("<div style='position: absolute;right: 45px;top: 35px;width: 30px;height: 30px;background: #999;color: #fff'>毁</div>")
    controlDiv.append(hideBtn).append(destroyBtn);
    $('html').append(controlDiv).append(controlBtn);
    window.addEventListener('error', function (err) {
        var lineAndColumnInfo = err.colno ? ' line:' + err.lineno +', column:'+ err.colno : ' line:' + err.lineno;
        var txt="<p style='font-size: 12px;color: red;border-bottom: 1px dashed #fff;margin-bottom: 5px;word-break: break-all;padding-bottom: 5px'>w.error错误信息：\t"
        txt+="Error: " + err.message + "\t"
        txt+="Line: " + lineAndColumnInfo + "</p>"
        controlDiv.append(txt)
        console.info("**************************************"+err.message)
        return true
    });
    /*
    *启动机关事件
    * 左上 1
    * 右上 2
    * 左下 3
    * 右下 4
    * 机关密码约定为key
    * 必须按顺序来
    * 为了避免点击过
    * */
    $(document).on('click','body,.loadingScene',function (e) {
        if(isDebug)return;
        var x=e.clientX,y=e.clientY,w=window.innerWidth,h=window.innerHeight;
        clickCount++;
        clickCount++;
        if(clickCount>=100) {
            clickMark="";
            clickCount=0;
        };
        /*左上*/
        if(x<w/2&&y<h/2){
            clickMark+="1";
        }
        /*右上*/
        if(x>=w/2&&y<h/2){
            clickMark+="2";
        }
        /*左下*/
        if(x<w/2&&y>=h/2){
            clickMark+="3";
        }
        /*右下*/
        if(x>=w/2&&y>=h/2){
            clickMark+="4";
        }
        /*判断机关是否开启*/
        if(clickMark.indexOf(key)!==-1){
            isDebug=true;
            clickMark="";
            controlBtn.show();
            alert&&alert("请注意,调试模式已开启");
        }
    })
    destroyBtn.click(function () {
        controlBtn.hide();
        controlDiv.hide().children("p").remove();
        isDebug=false;
        clickMark="";
    })
    hideBtn.click(function () {
        controlDiv.hide();
    })
    controlBtn.click(function () {
        controlDiv.show();
    })
})()