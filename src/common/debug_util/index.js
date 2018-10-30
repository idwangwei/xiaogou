/**
 * Created by 彭建伦 on 2016/5/31.
 */
window.logState = function () {
    let state = angular.element('body').injector().get('$ngRedux').getState();
    let args = [].slice.call(arguments);
    let rt = state;
    args.forEach(function (param) {
        rt = rt[param];
    });
    console.table(rt);
    return rt;
};
window.logCacheFileList = function () {
    let da = new DownloadApp();
    let file_list = [];
    let file_entry = (file)=> {
        let file_name = file.name;
        if (file_name.indexOf('cache') != -1)
            file_list.push(file_name);
    };
    let success = ()=> {
        console.log(file_list.join('\n\r'));
    };
    da.listDir('mathgames0', false, success, null, file_entry);
};
window.getInjector = function () {
    return angular.element('body').injector();
};
window.getScope = function (ele) {
    return angular.element(ele).scope();
};

window.getScopeNum = function () {
    let rootScope = window.getInjector().get('$rootScope');
    let count = 1;

    function walkChild(scope) {
        count++;
        let childHead = scope.$$childHead;
        if(childHead){
            do {
                walkChild(childHead);
            } while (childHead = childHead.$$nextSibling)
        }
    }

    walkChild(rootScope.$$childHead);

    return count;
};

