import "./index-home/index_home.less"
import "./index-home/iswiper.min.css"
import "./index-home/clear_cache"
import Swiper from "./index-home/iswiper"
import template from "./index-home/index_home2.html"
import oneImg from 'index-home/images/one.png';
import twoImg from 'index-home/images/two.png';
import threeImg from 'index-home/images/three.png';
import titleOneImg from 'index-home/images/title-one.png';
import titleTwoImg from 'index-home/images/title-two.png';
import titleThreeImg from 'index-home/images/title-three.png';
import cursorImg from 'index-home/images/cursor.png'


let currentSystemStr = localStorage.getItem('currentSystem');
let SUB_APP_DIR = {
    TEACHER: 'teacher_index.html',
    STUDENT: 'student_index.html',
    PARENT: 'parent_index.html'
};
let ROLE = {
    TEACHER: "teacher",
    STUDENT: "student",
    PARENT: "parent"
};
let teacher = {
    id: ROLE.TEACHER,
    image: '',
    name: '我是教师',
    desc: '这是一些描述',
    color: '#6B94D6'
};
let parent = {
    id: ROLE.PARENT,
    image: '',
    name: '我是家长',
    desc: '这是一些描述',
    color: '#8BC855'
};
let student = {
    id: ROLE.STUDENT,
    image: '',
    name: '我是学生',
    desc: '这是一些描述',
    color: '#F38B83'
};
let handleSelect = (item, isRegister) => {
    if (isRegister) localStorage.setItem('firstGoToRegister', JSON.stringify(true));
    if (item === ROLE.TEACHER) {
        location.href = SUB_APP_DIR.TEACHER;
        localStorage.setItem('currentSystem', JSON.stringify(teacher));
        return;
    }
    if (item === ROLE.PARENT) {
        location.href = SUB_APP_DIR.PARENT;
        localStorage.setItem('currentSystem', JSON.stringify(parent));
        return;
    }
    if (item === ROLE.STUDENT) {
        location.href = SUB_APP_DIR.STUDENT;
        localStorage.setItem('currentSystem', JSON.stringify(student));
        return;
    }
};
let scope = {oneImg, twoImg, threeImg, titleOneImg, titleTwoImg, titleThreeImg, cursorImg};
let body = document.querySelector("body");
let processTemplate = (template, scope) => {
    return template.replace(/{{(.+?)}}/mg, function (match, $1) {
        return scope[$1]
    })
};
let appendTemplate = () => {
    body.innerHTML = processTemplate(template, scope);
};
if (currentSystemStr) {
    try {
        var currentSystem = JSON.parse(currentSystemStr);
        handleSelect(currentSystem.id);
    } catch (e) {
        console.error(e);
    }
} else {
    appendTemplate();
    let currentSlide = 0;
    let totalSlide = 3;
    let swiper = new Swiper({
        // 容器
        container: '.ion-slide-box',
        // 每页 className
        item: '.ion-slide',
        // 默认竖屏，可选横屏 horizontal
        direction: 'horizontal',
        // 激活态 className
        activeClass: 'active',
        // 默认不无限首尾相连
        infinite: false,
        // 滑动切换距离阀值
        threshold: 30,
        // 切换动画时间
        duration: 300,
        // 自动切换，默认为 false，自动切换必须 infinite:true
        autoSwitch: false,
        // 切换间隔
        loopTime: 5000,
        // 切换缓动函数，默认为 linear，可传入 cubic-bezier()
        easing: "linear",
        // 进度条，默认没有进度条，可选 true 且需要加上进度条 html 代码
        progressBar: true
    });
    window.onload = function () {
        let toTeacherBtn = document.querySelector(".to-teacher");
        let toParentBtn = document.querySelector(".to-parent");
        let toStudentBtn = document.querySelector(".to-student");
        let leftCursor = document.querySelector(".leftCursor");
        let rightCursor = document.querySelector(".rightCursor");
        /*判断是否为windows*/
        var sUserAgent = navigator.userAgent.toLowerCase();
        var pc=sUserAgent.match(/windows/i) == "windows";
        if(pc){
          let homeIndex=document.querySelector(".index-home");
          homeIndex.className=homeIndex.className+" isWindow";
        }
        /*end*/
        if (currentSlide === 0)
            leftCursor.style.display = "none";
        leftCursor.onclick = function () {
            currentSlide -= 1;
            if (currentSlide === 0) {
                leftCursor.style.display = "none";
            } else {
                leftCursor.style.display = "block";
            }
            if (currentSlide === totalSlide) {
                rightCursor.style.display = "none";
            }else{
                rightCursor.style.display = "block";
            }
            swiper.go(currentSlide);
        };
        rightCursor.onclick = function () {
            currentSlide += 1;
            if (currentSlide === totalSlide) {
                rightCursor.style.display = "none";
            }else{
                rightCursor.style.display = "block";
            }
            if (currentSlide === 0) {
                leftCursor.style.display = "none";
            } else {
                leftCursor.style.display = "block";
            }
            swiper.next();
        };
        toTeacherBtn.onclick = () => handleSelect('teacher', true);
        toParentBtn.onclick = () => handleSelect("parent", true);
        toStudentBtn.onclick = () => handleSelect("student", true);
    }
}


