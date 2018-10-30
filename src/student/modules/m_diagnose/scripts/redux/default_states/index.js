/**
 * Created by qiyuexi on 2018/1/22.
 */
/**----------- 诊断相关 start-------------**/
export let diagnose_selected_textbook={};//诊断当前选中的教材
export let diagnose_selected_grade={};//诊断当前选中的年级
export let diagnose_selected_clazz={};//诊断当前选中的班级
export let fetch_home_stati_processing=false;//是否正在加载主页诊断统计
export let diagnose_home_with_statistic={};//诊断主页过滤条件所对应的诊断
export let home_select_chapter={};//诊断主页选中章节
export let chapter_select_point={};//章节选中知识点
export let fetch_chapter_diagnose_processing=false;//是否正在加载章节诊断
export let knowledge_with_question={};//诊断知识点所对应的试题
export let knowledge_with_report={};//诊断知识点所对应的诊断报告
export let fetch_diagnose_report_processing=false;//是否正在加载诊断诊断

export let diagnose_clazz_with_unit={};//诊断当前选中的班级所包含的单元信息
export let unit_with_diagnose_stati={};//不同的单元对应的诊断统计
export let chapter_with_diagnose_stati={};//不同的单元对应的诊断统计
export let fetch_unit_stati_processing=false;//是否正在加载单元对应的诊断统计
export let diagnose_goods_menus_list={};//诊断中的商品列表
export let fetch_goods_menus_processing=false;//是否正在加载商品信息
export let fetch_chapter_stati_processing=false;//是否正在加载章节对应的诊断统计
export let fetch_unit_knowledge_stati_processing=false;//是否正在加载子知识点的诊断统计
export let unit_select_chapter={};//在诊断总页面选中的章节。
export let unit_select_knowledge={};//在诊断总页面选中的子知识点。
export let fetch_q_records_processing=false;//是否正在加载获取做题记录。
export let fetch_error_q_records_processing=false;//是否正在加载获取错题记录。
export let q_records_pagination_info={//做题记录的分页信息
    lastKey: 0, quantity: 16
};
export let fetch_diagnose_question_processing=false;//是否正在加载试题。
export let go_to_do_question={   //去做题，1表示错题，2表示新题
    type:1
};
export  let diagnose_submit_q_processing=false;//是否正在提交试题
export  let knowledge_selected_q=null;//知识点下获取的试题
export let fetch_diagnose_textbook_processing=false;//是否正在诊断的选择教材
export let diagnose_entry_url_from = {
    urlFrom:''
};//进入诊断提分的入口url
export let first_submit_work_after_update = true; //诊断提分付费修改（改为考点付费）更新后首次提交作业
export let increase_score_goods_menus_list=[
    {
        desc: {
            fee: "10",
            subTitle: "不限年级，不限册数，20个考点的提分特权",
            title: "20个考点特权包"
        },
        id: "ZD-TF-001",
        totalFee: 1000
    },
    {
        desc: {
            fee: "99",
            subTitle: "一年级上册所有考点提分特权",
            title: "一年级上册考点特权包"
        },
        id: "ZD-TF-002",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "一年级下册所有考点提分特权",
            title: "一年级下册考点特权包"
        },
        id: "ZD-TF-003",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "二年级上册所有考点提分特权",
            title: "二年级上册考点特权包"
        },
        id: "ZD-TF-004",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "二年级下册所有考点提分特权",
            title: "二年级下册考点特权包"
        },
        id: "ZD-TF-005",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "三年级上册所有考点提分特权",
            title: "三年级上册考点特权包"
        },
        id: "ZD-TF-006",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "三年级下册所有考点提分特权",
            title: "三年级下册考点特权包"
        },
        id: "ZD-TF-007",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "四年级上册所有考点提分特权",
            title: "四年级上册考点特权包"
        },
        id: "ZD-TF-008",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "四年级下册所有考点提分特权",
            title: "四年级下册考点特权包"
        },
        id: "ZD-TF-009",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "五年级上册所有考点提分特权",
            title: "五年级上册考点特权包"
        },
        id: "ZD-TF-010",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "五年级下册所有考点提分特权",
            title: "五年级下册考点特权包"
        },
        id: "ZD-TF-011",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "六年级上册所有考点提分特权",
            title: "六年级上册考点特权包"
        },
        id: "ZD-TF-012",
        totalFee: 9900
    },
    {
        desc: {
            fee: "99",
            subTitle: "六年级下册所有考点提分特权",
            title: "六年级下册考点特权包"
        },
        id: "ZD-TF-013",
        totalFee: 9900
    },
];//诊断提分中的商品列表
/**----------- 诊断相关 end-------------**/