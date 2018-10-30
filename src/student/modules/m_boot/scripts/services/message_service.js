/**
 * Author 邓小龙 on 2015/11/25.
 * @description 消息service
 */
import _each from 'lodash.foreach';
import _sortBy from 'lodash.sortby';
define(['./index'], function (services) {
    services.service('messageServices', ['$state', '$log', '$timeout','$rootScope','serverInterface', 'commonService', 'finalData', 'dateUtil','localstorageDbUtil',
        function ($state, $log, $timeout,$rootScope, serverInterface, commonService, finalData, dateUtil,localstorageDbUtil) {

            var SUB_MSG_CONTENT={//消息内容体截取长度
                PHONE:16,
                PAD:25
            };
            var SENT_DB_KEY="senderId";
            var MSG_DB_KEY="msgId";

            var me = this;
            this.msgData = {
                msgList:[]
            };//共享数据对象
            this.msgDetailData = {};//共享消息详情对象
            this.unRead={ //未读
                count:0
            };




            /**
             * 获取消息列表
             */
            this.getMsgList = function () {
                var contactDb=localstorageDbUtil.getAll(finalData.DB_CONTACTS_S);
                var messageDb=localstorageDbUtil.getAll(finalData.DB_MSG_S);
                _each(contactDb, function (sender) {
                    if(sender.revId==$rootScope.user.userId){
                        var msgLastDateTime = '0';
                        var msgLastContent = "";
                        var msgNotViewedCount = 0;
                        _each(messageDb, function (msg) {
                            if (msg[SENT_DB_KEY] == sender[SENT_DB_KEY]) {
                                if (msg.msgDateTime > msgLastDateTime) {
                                    msgLastDateTime = msg.msgDateTime;
                                    msgLastContent = msg.msgContent;
                                }
                                if (msg.magStatus == 0) {
                                    msgNotViewedCount++;
                                }
                                if(msg.msgId=='1'){//默认的智算365消息
                                    if ($rootScope.user.name && $rootScope.user.name != "") {
                                        msg.msgContent = $rootScope.user.name + "同学，智算365欢迎您!";
                                    } else {
                                        msg.msgContent = "您好，智算365欢迎您!";
                                    }
                                    msgLastContent=msg.msgContent;
                                    localstorageDbUtil.save(finalData.DB_MSG_S,msg,MSG_DB_KEY);
                                }
                            }
                        });
                        sender.msgLastDateTime = msgLastDateTime;
                        sender.msgNotViewedCount = msgNotViewedCount;
                        sender.msgLastContent=msgLastContent;
                        sender.imgUrl=handleRolePhoto(sender.senderRole);
                    }
                });
                me.msgData.msgList.length=0;
                _each(contactDb,function(item){
                    me.msgData.msgList.push(item);
                });
                parseMsgList(me.msgData.msgList,"msgLastDateTime","msgLastContent",true);
            };

            /**
             * 获取消息详情
             */
            this.getMsgDetail = function () {
                me.msgData.msgDetail = {
                    msgList: []
                };
                var messageDb=localstorageDbUtil.getAll(finalData.DB_MSG_S);
                _each(messageDb, function (msg) {
                    if (msg[SENT_DB_KEY] == me.msgData[SENT_DB_KEY]) {
                        me.msgData.msgDetail.msgList.push(msg);
                        msg.magStatus=1;
                        localstorageDbUtil.save(finalData.DB_MSG_S,msg,MSG_DB_KEY);
                    }
                });
                me.msgData.msgDetail.msgList = parseMsgList(me.msgData.msgDetail.msgList,"msgDateTime",null,false);
                $timeout(function(){
                    $rootScope.$emit(finalData.JPUSH_MSG_EVENT);
                });


            };

            /**
             *获取未读的消息数目
             */
            this.getUnReadMsgCount=function(){
                var messageDb=localstorageDbUtil.getAll(finalData.DB_MSG_S);
                var count=0;
                angular.forEach(messageDb,function(msg){
                    if(msg.magStatus==0){
                        count++;
                    }
                });
                me.unRead.count=count;
            };

            this.clearData=function(){
                this.msgData.msgList.length=0;//共享数据对象
                this.msgDetailData = {};//共享消息详情对象
            };

            /**
             * 根据角色处理头像
             * @param role
             */
            function handleRolePhoto(role){
                var imgUrl;
                switch (role){
                    case "S":  //系统角色
                        imgUrl="other/logo_p.jpg";
                        break;
                    case "T": //老师角色
                        imgUrl="student.svg";
                        break;
                    case "P": //家长角色
                        imgUrl="student.svg";
                        break;
                    case "C": //学生角色
                        imgUrl="student.svg";
                        break;
                    default :
                        imgUrl="student.svg";
                        break;
                }
                return imgUrl;
            }

            /**
             * 解析消息列表
             * @param data
             */
            function parseMsgList(data,dateName,textName,sortFlag) {
                var formatStr = dateUtil.dateFormat.prototype.DEFAULT_DATETIME_FORMAT;//格式成“2015-08-01”
                var sortData = _sortBy(data, function (msg) {//日期倒序排序
                    var dateTime = dateUtil.dateFormat.prototype.parseDate(msg[dateName], formatStr);
                    if(textName&&textName!=""){
                        /*msg[textName] = commonService.interceptName(msg[textName], 20);*/
                        if($rootScope.platform.type>=3){//非手机
                            msg[textName] = commonService.interceptName(msg[textName], SUB_MSG_CONTENT.PAD);
                        }else{
                            msg[textName] = commonService.interceptName(msg[textName], SUB_MSG_CONTENT.PHONE);
                        }
                    }
                    if(sortFlag){
                        return -dateTime.getTime();
                    }else{
                        return dateTime.getTime();
                    }

                });
                parseDate(sortData,dateName);
                return sortData;
            }

            function parseDate(sortData,dateName){
                var now = new Date();
                var yesterday = (new Date()).setDate(now.getDate() - 1);//昨天
                var formatStr = dateUtil.dateFormat.prototype.DEFAULT_DATE_FORMAT;//格式成“2015-08-01”
                var nowDate = dateUtil.dateFormat.prototype.format(now, formatStr); //当前日期
                var yesterdayStr = dateUtil.dateFormat.prototype.format(new Date(yesterday), formatStr); //当前日期
                _each(sortData, function (msg) {
                    var msgDate = msg[dateName].substring(0, 10);
                    var msgYear = msg[dateName].substring(0, 4);
                    var tempStr = msg[dateName];
                    var nowYear = nowDate.substring(0, 4);
                    if (nowDate == msgDate) {//如果当前日期等于消息日期就显示时间，否则就显示日期
                        msg[dateName] = msg[dateName].substring(11, msg[dateName].length - 3);
                    } else if (yesterdayStr == msgDate) {
                        msg[dateName] = "昨天";
                    } else if (msgYear < nowYear) {
                        msg[dateName] = tempStr.substring(0, 4) + "年" + tempStr.substring(6, 7) + "月" + tempStr.substring(9, 10) + "日";
                    } else {
                        msg[dateName] = tempStr.substring(6, 7) + "月" + tempStr.substring(9, 10) + "日";
                    }
                });
            }


        }]);
});
