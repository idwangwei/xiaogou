/**
 * Created by WL on 2017/6/29.
 */

import {Inject, View, Directive, select} from '../../module';


@View('winter_camp_vip_protocol', {
    url: '/winter_camp_vip_protocol/',
    template: require('./page.html'),
    styles: require('./style.less'),
    inject:[
        '$scope',
        '$state',
        '$rootScope',
        '$stateParams',
        '$ngRedux',
        'commonService'
    ]
})

class WinterCampVipProtocol {
    $stateParams;
    commonService;
    @select(state=>state.profile_user_auth.user.name) userName;

    protocolText = [{
        clauseTitle: "1.服务条款的接受与修改",
        clauses: ['1)本协议由您和四川爱里尔科技有限公司（以下简称“爱里尔科技”）共同签署，' +
        '在您使用“智算365”软件服务平台并开通付费功能“期末冲刺月”之前，请仔细阅读本协议(无民事行为能力人、限制民事行为能力人' +
        '应在法定监护人陪同下阅读)。'
            , '2)一旦您使用智算365软件服务平台且在支付页面点击支付按钮，即表示您已仔细阅读并同意完全接受本协议所有条款和所有条件的' +
            '约束，并自动成为智算365的充值用户。'
            , '3）注意：您正在购买付费内容，无民事行为能力、限制民事行为能力人应在法定监护人陪同下完成购买。' +
            '如因监护人监管疏漏导致软件费用的划扣，本公司不予退款。'
            , '4)智算365有权随时修改本协议，一旦协议发生变更，将在智算365软件服务平台公示的方式通知您；修改后的协议自公示时生效。' +
            '本协议的条款修改后，如果您不同意本协议条款的修改，可以取消并停止继续使用智算365软件服务；如果您继续使用智算365软件服务，' +
            '则视为您已经接受本协议的全部修改。'
        ]
    },
        {
            clauseTitle: "2.问题避免和解决准则",
            clauses: []
        },
        {
            clauseTitle: "2.1免责声明",
            clauses: ['1)非爱里尔科技原因致使您的账户密码泄露以及因您的保管、使用、维护账户信息及软件服务平台终端设备不当造成的损失，' +
            '爱里尔科技无需承担与此有关的任何责任。'
                , '2)爱里尔科技不对您因第三方的行为或不作为造成的损失承担任何责任，包括但不限于支付服务和网络接入服务，' +
                '任意第三方的侵权行为等。'
                , '3)因智算365服务平台软件及网络的故障、数据库故障、软件升级等问题，或其他不可抗拒的事由，包括但不限于政府行为、' +
                '自然灾害、黑客攻击等造成的服务中断或终止而造成的任何损失，爱里尔科技无需对您或任何第三方承担任何责任。' +
                '但爱里尔科技应尽可能事先进行通告，并尽早恢复服务，尽全力采取合理措施将用户损失降到最低程度，' +
                '用户应容忍不可抗力发生期间内对用户造成的损失。'
                , '4)以恶意破解、逆向工程等非法手段将智算365软件服务平台提供的产品服务内容与智算365软件服务平台分离的行为，' +
                '由此引起的一切法律后果由行为人自行承担。'
                , '5)如用户违反或被视为违反本协议服务条款中的内容，爱里尔科技有权在不通知用户的情况下立即终止用户购买的所有服务，' +
                '以及取消您的用户账户和使用权限，并不退还已充值的费用。'
                , '6)本软件部分内容为付费项目,使用者须具备完全行为能力或在监护人的监管下进行使用,如违反前述原因导致软件费用的划扣,' +
                '责任均由软件使用方承担,本爱里尔科技对此不承担任何退赔责任。'
            ]
        },
        {
            clauseTitle: "2.2退款明细",
            clauses: ['1）由于产品问题造成的重复付款，审核确认后无理由全额退款。'
                , '2）本协议第2条2.1项所包含的情况不在退款处理的范围之内。']
        },
        {
            clauseTitle: "3.充值用户服务的权利和限制",
            clauses: ['1)用户在智算365软件服务平台使用智算365产品服务的过程中，如果遇到服务纠纷或在使用服务过程中有任何故障或者疑问，' +
            '应在智算365软件服务平台公示的时间范围内提出服务异议，否则爱里尔科技将难以对您的异议作出有效的处理。' +
            '具体的服务异议提出流程以智算365软件平台公示规则为准。'
                , '2)智算365在向您提供用户服务时，所涉及的软件产品及内涵信息（包括但不限于：文本、图片、视频资料）均受著作权、' +
                '商标权及其他财产权的法律保护；未经爱里尔科技及相关权利人的书面授权，您不得将上述资料以任何方式展示于第三方平台或被用于其他商业目的。' +
                '未经爱里尔科技事先书面同意，不得为任何营利性或非营利性的目的自行实施、利用、转让、或允许任何第三方实施、利用、' +
                '转让上述知识产权及相关权利。'
                , '3)爱里尔科技为您提供的全部产品服务，均仅限于您在智算365软件服务平台处使用，任何以恶意破解等非法手段将智算365软件服务平台' +
                '提供的产品服务内容与智算365软件服务平台分离的行为，由此引起的一切法律后果由行为人自行承担，' +
                '造成爱里尔科技损失的，爱里尔科技有权依法追究行为人的法律责任。'
                , '4)爱里尔科技随时有权要求用户继续履行义务或承担相应的违约责任。'
            ]
        },
        {
            clauseTitle: "4.法律的适用和管辖",
            clauses: ['1)本协议所涉及的问题参照国家有关法律法规，当本协议与国家相关法律法规冲突时，以国家法律法规为准。'
                , '2)智算365在向您提供用户服务时，所涉及的软件产品及内涵信息（包括但不限于：文本、图片、视频资料）均受著作权、' +
                '商标权及其他财产权的法律保护；未经爱里尔科技及相关权利人的书面授权，您不得将上述资料以任何方式展示于第三方平台' +
                '或被用于其他商业目的。未经爱里尔科技事先书面同意，不得为任何营利性或非营利性的目的自行实施、利用、转让、' +
                '或允许任何第三方实施、利用、转让上述知识产权及相关权利。'
                , '3)本服务条款的生效、履行、解释及争议的解决均适用中华人民共和国法律，本服务条款因与中华人民共和国现行法律' +
                '相抵触而导致部分条款无效的，不影响其他条款的效力。'
                , '4)如就本协议内容或其执行发生任何争议，应尽量友好协商解决；协商不成，' +
                '则争议各方均可向爱里尔科技所在地有管辖权的人民法院提起诉讼。'
            ]
        },
    ];

    initData(){

    }

    constructor() {
        /*后退注册*/

    }


    initFlags() {

    }

    configDataPipe() {
        this.dataPipe
            .when(() => !this.initCtrl)
            .then(() => {
                this.initCtrl = true;
            })
    }


    onBeforeEnterView() {

    }

    onAfterEnterView() {

    }

    back(){
        this.go("winter_camp_vip_pay");
        this.getRootScope().$injector.get('$ionicViewSwitcher').nextDirection('back');
    }

}

export default WinterCampVipProtocol;