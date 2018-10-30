/**
 * Created by 彭建伦 on 2016/10/20.
 */

function getDevice() {
    var ua = navigator.userAgent;
    if (/Android/i.test(ua)) {
        return "android";
    } else if (/CrOS/i.test(ua)) {
        return "chrome_os";
    } else if (/iP[ao]d/i.test(ua)) {
        return "ipad";
    } else if (/iPhone/i.test(ua)) {
        return "iphone";
    } else if (/Linux/i.test(ua)) {
        return "linux";
    } else if (/Mac OS/i.test(ua)) {
        return "mac";
    } else if (/windows/i.test(ua)) {
        return "windows";
    }
}
let device = getDevice();

export default device;
