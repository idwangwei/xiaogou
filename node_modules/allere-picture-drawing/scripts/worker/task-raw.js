/**
 * Created by LuoWen on 2017/2/23.
 */

import * as TASK_NAME from "./TaskName"
import tasks from './index'
// import tasks from './similarity-raw'

onmessage = function ({data:{options, taskName, args}}) {
    console.log("taskName:", taskName);

    let ret = "no ret";
    ret = tasks[taskName](...args);
    // switch (taskName) {
    //     case TASK_NAME.CALC_IMG_SIMILARITY:
    //         ret = tasks[TASK_NAME.CALC_IMG_SIMILARITY](...args);
    //         break;
    // }

    postMessage({options, taskName, ret});
};