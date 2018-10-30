/**
 * Created by 彭建伦 on 2016/6/3.
 */
import _ from 'underscore';
const USER_MANIFEST_KEY = "USER_MANIFEST";
const SYSTEM_TYPE = {
    TEACHER: "_T",
    STUDENT: "_S",
    PARENT: "_P"
};
class UserManifest {
    constructor(systemType) {
        this.randomCodeItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
            'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        this.systemType = systemType;
        this.NONE_USER = "NONE_USER";
        let userManifestStr = localStorage.getItem(this.getUserManifestKey());
        if (!userManifestStr) {
            userManifestStr = JSON.stringify({
                defaultUser: this.NONE_USER,
                userList: []
            });
            localStorage.setItem(this.getUserManifestKey(), userManifestStr);
        }
        this.generatePropsFromManifestStr(userManifestStr);
    }


    generatePropsFromManifestStr(manifestStr) {
        let res = null;
        try {
            res = JSON.parse(manifestStr);
            this.defaultUser = res.defaultUser;
            this.userList = res.userList;
        } catch (e) {
            console.error(e);
        }
    }

    setDefaultUser(defaultUserName) {
        this.defaultUser = defaultUserName;
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        localStorage.setItem(this.getUserManifestKey(), JSON.stringify({
            defaultUser: this.defaultUser,
            userList: this.userList
        }));
        localStorage.setItem(USER_MANIFEST_KEY, JSON.stringify({ //这个通知要用，不要删了
            defaultUser: this.defaultUser,
            userList: this.userList
        }));
    }

    addUserToUserList(user) {
        let findIndex = -1;
        let userInfo = {
            loginName: user.loginName,
            name: user.name,
            gender: user.gender
        };
        if(user.savePWflag) userInfo.passWord = this.getPasswordCode(user.passWord);//user.passWord;
        /*this.userList.forEach((item, index)=> {
            let isNew=item.hasOwnProperty('gender');
            if ((isNew&& item.loginName === user.loginName)||(!isNew&& item === user.loginName)) findIndex = index;
        });*/
        try{
            this.userList.find((item, index) => {
                if(item.loginName && item.loginName.toLowerCase() === user.loginName.toLowerCase()){
                    findIndex = index;
                }
            })
        }catch(err){
            console.error('添加用户输入数据到本地：',err );
        }
        findIndex > -1 ? this.userList.splice(findIndex, 1, userInfo) : this.userList.push(userInfo);
        this.saveToLocalStorage();
    }

    getUserManifest() {
        let userManifestStr = localStorage.getItem(this.getUserManifestKey());
        let userManifest;
        try {
            userManifest = JSON.parse(userManifestStr);
        } catch (e) {
            //TODO log error when parse manifest failed!
        }
        return userManifest;
    }

    getUserManifestKey() {
        return USER_MANIFEST_KEY + this.systemType;
    }

    getPassWordByLoginName(loginName) {
        if(!loginName) return '';
        let pw = "";
        angular.forEach(this.userList, (v, k)=> {
            if (this.userList[k].loginName == loginName.toUpperCase()||this.userList[k].loginName == loginName.toLowerCase())
                pw = this.userList[k].passWord;
        });
        return this.decodePassword(pw);
    }

    /**
     * 加密
     * @param pw
     */
    getPasswordCode(pw) {
        if(!pw) return '';
        let len = pw.toString().length;
        let codeLen = len;
        if(codeLen<=6) codeLen=6;
        let randomCode = _.sample(this.randomCodeItems, codeLen);
        angular.forEach(randomCode, (v, k)=> {
            if (Number(k) < Number(len)) randomCode[k] = randomCode[k].toString() + pw[k];
        });

        return randomCode.join('');
    };

    /**
     * 解密
     * @param pw
     * @returns {*}
     */
    decodePassword(pw) {
        if(!pw) return '';
        let len = pw.toString().length;
        let pwLen = len % 6;
        if(len==12) pwLen=6;
        if(len>12) pwLen = Math.floor(len/2);
        var pwItems = [];
        let password = "";
        angular.forEach(pw,(v,k)=>{
            if((Number(k)+1)%2==0) pwItems.push(pw[k]);
        });
        password =  pwItems.slice(0,pwLen).join('');
        return password;
    }
}
// let userManifest = new UserManifest();
export  {
    UserManifest,
    SYSTEM_TYPE
};