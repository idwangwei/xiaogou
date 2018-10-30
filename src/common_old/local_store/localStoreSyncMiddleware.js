/**
 * Created by 彭建伦 on 2016/6/2.
 */
import UserManifest from './UserManifest';
const SAVE_TO_LOCAL_STORE_PERIOD = 1000; //保存state到localStore的时间间隔

function LocalStoreSyncMiddleware(ngLocalStore,ngWorkerRunner) {
    let previousActionTimeStamp = 0;
    return store=>next=>action=> {
        setTimeout(()=>{
            let nowActionTimeStamp = new Date().getTime();
            if (nowActionTimeStamp - previousActionTimeStamp >= SAVE_TO_LOCAL_STORE_PERIOD)
                saveStateToLocalStore(store.getState(), ngLocalStore,ngWorkerRunner);
        },500);
        next(action);
    }
}
function saveStateToLocalStore(state, ngLocalStore,ngWorkerRunner) {
    let loginName = state.profile.user.loginName;
    if (!loginName) return; //如果没有用户名，则表示用户没有登录,则不把state保存到本地

    //尝试从本地获取 userManifest.cache,如果没有,则创建,并存储当前登录的用户名，有则更新
    ngLocalStore.getItem(UserManifest.getLocalStoreUserManifestCacheKey())
        .then((res)=> {
            saveUserManifest(loginName, res);
        }, ()=> {
            saveUserManifest(loginName);
        });
    let saveUserManifest = (loginName, userManifest)=> {
        let manifest = new UserManifest(userManifest);
        manifest.setDefaultUser(loginName);
        manifest.addUserToUserList(loginName);
        ngLocalStore.setItem(UserManifest.getLocalStoreUserManifestCacheKey(), JSON.stringify(manifest))
            .then(()=> {
                //let stateCopy=Object.assign({},state);
                //stateCopy.work_list.clazzListWithWorks={};
                ngLocalStore.setItem(loginName,JSON.stringify(state) );

            });
    };
}
LocalStoreSyncMiddleware.$inject = ['ngLocalStore','ngWorkerRunner'];

export default LocalStoreSyncMiddleware;