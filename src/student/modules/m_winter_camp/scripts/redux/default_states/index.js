/**
 * Created by ZL on 2018/1/29.
 */

export let winter_camp_selected_textbook = {};//选择的教材版本
export let winter_camp_selected_grade = {selectFlag:false,num:undefined};//选择的年级

export let winter_camp_game_list = [];
export let fetch_winter_camp_game_list_processing = false;
export let select_winter_camp_game = {};

export let winter_camp_all_courses = {
    courseList: []
};
export let fetch_winter_camp_all_course_processing = false;

export let select_winter_camp_course = {};

export let current_course_info = {};

export let winter_camp_vip = {
    goods_list: [],
    select_goods: {},
    fetch_goods_list_processing: false,
    create_order_processing: false,
    created_order_info: {
        app: {},
        scan: {}
    }
};

export let show_winter_camp_ad = true;
export let winter_camp_share_record = false;
export let study_course_count = {};

