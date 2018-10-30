/**
 * Created by 彭建伦 on 2016/6/3.
 */
import LocalStorageWrapper from './localStorageWrapper';
import localStore from './localStore';
function NgLocalStoreService() {
    this.$get = [function () {
        return localStore;
    }]
}
export default NgLocalStoreService;
