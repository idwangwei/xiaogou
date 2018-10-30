/**
 *  存储所有页面的数据
 *
 */
class PageRefreshManager {

    constructor($rootScope) {
        this.store = [];
        this.refreshTime = 10000;
        this.$rootScope = $rootScope;
    }

    saveOrUpdateStore(key, value) {
        this.store[key] = value;
    }

    deleteValue(key) {
        delete this.store[key];
    }

    getStateUrl(toState, toStateParams) {
        var urlTemplate = toState.url;
        for (var key in toStateParams) {
            urlTemplate = urlTemplate.replace(':' + key, toStateParams[key]);
        }
        return urlTemplate;
    }

    getListenerName(toState, toStateParams) {
        var url = this.getStateUrl(toState, toStateParams);
        return url.replace(/\//mg, '.');
    }

    shouldUpdate(state, updateUrl) {
        var url = this.getStateUrl(state.current, state.params);
        return url == updateUrl;
    }

    updateOrCollectStateUrl(toState, toStateParams) {
        let has = false;
        let pageUrl = this.getStateUrl(toState, toStateParams);
        this.store.forEach((item)=> {
            var nowTime = new Date().getTime();
            if (item.url == pageUrl) {
                has = true;
                if (nowTime - item.lastEnterTime >= this.refreshTime) {
                    let listenerName = this.getListenerName(toState, toStateParams);
                    this.$rootScope.$broadcast(listenerName, {url: item.url});
                }
                item.lastEnterTime = nowTime;
            }
        });
        if (!has)
            this.store.push({
                url: pageUrl,
                lastEnterTime: new Date().getTime()
            });
    }

    update(toState, toStateParams) {
        let listenerName = this.getListenerName(toState, toStateParams);
        this.$rootScope.$broadcast(listenerName, {forceUpdate:true});
    }
}
PageRefreshManager.$inject = ['$rootScope'];

export default angular.module('pageRefreshManager', []).service('pageRefreshManager', PageRefreshManager);
