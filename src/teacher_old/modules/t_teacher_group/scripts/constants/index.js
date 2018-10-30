/**
 * Created by ZL on 2018/3/13.
 */
import {Constant} from "../module";
@Constant('teacherGroupInterface', {
    GET_TEACHER_GROUP: '/um/TGroup/teacher/getTGroupList',//普通教师获取教研群信息
    GET_T_GROUP_INFO: '/um/TGroup/teacher/getTGroupInfo',//根据教研群号获取该群的详细信息
    SUBMIT_T_GROUP_APPLICATION: '/um/TGroup/teacher/submitTGroupApplication',//申请教学群
    REMOVE_TEACHER_FROM_T_GROUP: '/um/TGroup/teacher/removeTeacherFromTGroup',//教师退出教学群
    T_CAN_CREATE_CLASS: '/um/TGroup/teacher/canTCreateClass',//教师能否创建班级
    GET_T_GROUP_LIST: '/um/trGroup/admin/getTrGroupList',//教研员获取所有的教研群
    GET_T_GROUP_DETAIL: '/um/trGroup/admin/getTrGroupDetail',//教研圈子级详情

    UPDATE_T_GROUP:"/um/TGroup/admin/updateTGroup",//修改群
    GET_APPLICATION_SCHOOL_LIST:"/um/TGroup/admin/getApplicationSchoolList",//申请学校列表
    UPDATE_GROUP_STATUS:"/um/TGroup/admin/gateStatus/update",//变更群的状态
    GET_APPLICATION_TEACHER_LIST:"/um/TGroup/admin/getApplicationTeacherList",//申请学校列表
    GET_PASSED_SCHOOL_LIST:"/um/TGroup/admin/getPassedSchoolList",//已批准教师所在的学校列表
    GET_PASSED_TEACHER_LIST:"/um/TGroup/admin/getPassedTeacherList",//已批准教师列表
    ACCEPT_OR_REJECT_APPLICATION:"/um/TGroup/admin/acceptOrRejectApplication",//允许或拒绝申请
})
class teacherGroupInterface {
}