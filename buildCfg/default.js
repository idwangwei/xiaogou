var path = require('path');
module.exports = {
    "modules":path.normalize("src/modules"),
    "teacher": path.normalize("src/teacher_old"),
    "teacher_base": path.normalize("src/common"),

    "student": path.normalize("src/student"),
    "student_base": path.normalize("src/common"),

    "parent": path.normalize("src/parent_old"),
    "parent_base": path.normalize("src/common"),
    //一定不要给下面两行代码添加代码注释哦！！！！！
    "backend": "www.xuexihappy.com:9080",
    "img_server": "www.xuexihappy.com/static"
};