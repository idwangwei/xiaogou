function getCurrentSystem() {
    var localStr = localStorage.getItem("currentSystem");
    try {
        var system = JSON.parse(localStr);
        return system.id;
    } catch (e) {
        return 0;
    }
}
function getUserName(system) {
    var localStr;
    switch (system) {
        case "student":
            localStr = localStorage.getItem("USER_MANIFEST_S");
            break;
        case "teacher":
            localStr = localStorage.getItem("USER_MANIFEST_T");
            break;
        case "parent":
            localStr = localStorage.getItem("USER_MANIFEST_P");
            break;

    }
    try {
        var res = JSON.parse(localStr);
        var username = res.defaultUser;
        if (username == "NONE_USER") {
            return "未知用户";
        } else {
            return username
        }
    } catch (e) {
        return "未知用户";
    }
}
export default ()=> {
    var system = getCurrentSystem();
    var script = document.createElement("script");
    script.setAttribute("src", `https://qiyukf.com/script/1819ce5b625ba2d23adfedfe6228f19b.js?name=${getUserName(system)}`);
    document.body.appendChild(script);
}