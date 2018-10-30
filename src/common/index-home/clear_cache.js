///////////////更新版本后清除LocalStorage、localForage中的“data(用户浏览数据)”存储的数据/////////////////////////////
//注意：要保留来自更新框架的几个字段 change_log 、isNeedCheck 、assetPath，和 currentSystem
//注意：要保留PAPER_STORE(缓存的试卷)、DO_PAPER_STORE(保存的做题内容)、LOG_STORE(错误日志信息)
import localforage from "localforage";

let changeLog = localStorage.getItem("change_log");
// let isNeedCheck=localStorage.getItem("isNeedCheck");
// let assetPath =localStorage.getItem("assetPath");
// let currentSystem =localStorage.getItem("assetPath");


if (changeLog) {
    try {
        changeLog = JSON.parse(changeLog);
        let latestUpdateVersion = null;

        for (let i = 0, len = changeLog.length; i < len; i++) {
            if (!latestUpdateVersion) latestUpdateVersion = changeLog[i];
            if (latestUpdateVersion["dt"]
                && changeLog[i]["dt"]
                && new Date(changeLog[i]["dt"]) > new Date(latestUpdateVersion["dt"])) {
                latestUpdateVersion = changeLog[i];
            }
        }
        if (latestUpdateVersion && !latestUpdateVersion["localStorageCleared"]) {
            // localStorage.clear();
            latestUpdateVersion["localStorageCleared"] = true;
            localStorage.setItem("change_log", JSON.stringify(changeLog));
            // localStorage.setItem("assetPath",assetPath);
            // localStorage.setItem("isNeedCheck",isNeedCheck);
            // localStorage.setItem("currentSystem",currentSystem);
            // console.log("localStorage clear after update !!!!!!!!!");
            localforage.createInstance({name: "data"}).clear();
            console.log("localforage data instance clear after update!!!!!!");
        }
    } catch (e) {
        console.error("parse change_log error!");
        console.log(e);
    }
}