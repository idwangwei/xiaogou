/**
 * Created by LuoWen on 2016/12/7.
 */

let randomNumber = (end, start)=> {
    return (Math.random() * (end - (start || 0)) + (start || 0)) | 0;
};

export default randomNumber;
