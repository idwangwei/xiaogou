/**
 * Created by 彭建伦 on 2016/5/27.
 * 这是一个用于创建在webWorker中执行任务的组件
 */
import Deferred from './deferred';
let tasksWithRunnerCallbacks = {}; //所有注册的任务,其结构为 {task_name:task_function}
let defers = {}; //延迟对象Map
let deferId = 0;


/**
 * 注册一个任务
 * @param task_name 任务名称
 * @param callback 任务回调用
 */
let registerTask = (task_name, callback)=> {
    if (!isFunction(callback)) return console.error('the funner fn is not function!');
    if (hasSameTaskName(task_name))return console.error(`the task ${task_name} is already exist!`);
    tasksWithRunnerCallbacks[task_name] = callback;
};
/**
 * 创建一个taskRunner
 * @param tasks 所有注册的task函数
 * @param opts 配置参数
 */
let createTaskRunner = (tasks, worker_url)=> {
    let worker_file_url = worker_url
    let result = {};
    let keys = Object.keys(tasks);
    keys.forEach((task_name)=> {
        registerTask(task_name, tasks[task_name]);
    });
    if (window.Worker && !window.disableWorker) {
        result.worker = new Worker(worker_file_url);
        result.isWorker = true;
        result.worker.addEventListener('message', function (e) {
            let data = e.data;
            let defer_id = data.defer_id;
            let result = data.result;
            let progress = data.progress;
            if (progress)
                defers[defer_id].notify(result);
            else
                defers[defer_id].resolve(result);
        });
    }
    /**
     *
     * @param task_name 需要调用webworker中的函数名
     * @param args 传递给webworker中调用函数的参数
     * @returns {*}
     */
    result.runTask = function (task_name, args) {
        let defer = new Deferred();
        if (this.isWorker) {
            defers[deferId] = defer;
            this.worker.postMessage({task_name: task_name, defer_id: deferId, args: args});
            deferId++;
        } else {
            result = tasksWithRunnerCallbacks[task_name].apply(this, args);
            defer.resolve(result);
        }
        return defer.promise();
    };
    return result;
};
/**
 * 创建webworker
 * @param tasks
 */
let createWorker = (tasks)=> {
    let keys = Object.keys(tasks);
    keys.forEach((task_name)=> {
        registerTask(task_name, tasks[task_name]);
    });
    self.addEventListener('message', (e)=> {
        let data = e.data;
        let task_name = data.task_name;
        let task = tasksWithRunnerCallbacks[task_name];
        let result = task.apply(this, data.args);
        if (result.progress && typeof result.progress === 'function') {//表示返回的是promise
            result.progress(function (res) {
                self.postMessage({
                    defer_id: data.defer_id,
                    result: res,
                    progress: true //通知类型
                });
            });
        } else {
            self.postMessage({
                defer_id: data.defer_id,
                result: result
            });
        }
    });
};
/**
 * 判断对象是否为函数
 * @param fn
 * @returns {boolean}
 */
let isFunction = (fn)=> {
    return typeof fn === 'function';
};
/**
 * 判断是否有重名的task
 * @param task_name
 * @returns {*}
 */
let hasSameTaskName = (task_name)=> {
    return tasksWithRunnerCallbacks[task_name];
};
export {
    createWorker,
    createTaskRunner,

}