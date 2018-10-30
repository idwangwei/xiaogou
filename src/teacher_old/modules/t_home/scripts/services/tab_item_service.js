/**
 * Author ww on 2018/3/1.
 * @description
 */

export default class TabItemService {

    constructor() {
        this.TAB_TITLE = ".tab-title";//tab项内的文字
    }

    handleRedraw(currentTitleLeft, ele) {
        if ($(ele).is("img")) {
            if($(ele).hasClass('tab-top-img-on')){
                ele.style.left = currentTitleLeft<0?'-1000px':(currentTitleLeft-8 +'px');
            }else if($(ele).hasClass('tab-bottom-img')){
                ele.style.left = currentTitleLeft<0?'-1000px':(currentTitleLeft-5 +'px');
            }else if($(ele).hasClass('tab-gzh-img')){
                ele.style.left = currentTitleLeft + 19 + 'px';
            }else{
                ele.style.left = currentTitleLeft<0?'-1000px':(currentTitleLeft +'px');
            }
        }

    }

    redrawTabPosition() {
        let me = this;
        $('.tab-nav.tabs').each((index, tabNavEle)=> {
            let aEleArray = $(tabNavEle).children('a');
            aEleArray.each((index, aEle)=> {
                let currentTitle = $(aEle).children().filter(this.TAB_TITLE),
                    currentTitleLeft = (currentTitle[0].offsetLeft - 12);
                    if(currentTitle.text().length === 1){
                        currentTitleLeft-=8;
                    }
                $(aEle).children().each((index, ele)=>me.handleRedraw(currentTitleLeft, ele));
            });
        });
    }

    hideAllTabs() {
        $(".tab-nav").each((index, ele)=> $(ele).addClass("tabs-item-hide"));
    }

    showAllTabs() {
        $(".tabs-item-hide").each((index, ele)=> $(ele).removeClass("tabs-item-hide"));
    }
}
