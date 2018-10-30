/**
 * Created by 彭建伦 on 2016/8/17.
 * 统一管理controller中数据加载依赖的管道
 */
import genUUID from './uuid';


/**
 * 配置项,每一条配置项具体如下：
 * {
 *   id：配置项ID
 *   criteria： 配置函数 触发条件
 *   invokeList： 配置函数 列表
 *   depList: 该配置项执行所需要依赖的所有条件
 * }
 *
 */
class CriteriaConfig {
    /**
     *
     * @param criteria
     * @param invokeList
     * @param sequence
     */
    constructor(criteriaList, invokeList, sequence) {
        this.id = genUUID();
        this.criteriaList = criteriaList || [];
        this.invokeList = invokeList || [];
        this.sequence = sequence || 0;
    }

    /**
     * 设置条件
     * @param criteria
     */
    pushCriteria(criteria) {
        this.criteriaList.push(criteria);
    }

    /**
     * 配置函数 列表
     * @param invoke
     */
    pushInvoke(invoke) {
        this.invokeList.push(invoke);
    }
}
class DataPipe {

    constructor() {
        this.configList = [];
        this.lastConfigId = null;
        this.lastActionType = ACTION_TYPES.PUSH_CRITERIA;
    }

    /**
     * 获取上一条配置
     * @returns {*}
     */
    getLastConfig() {
        let lastConfig = null,nextConfig;
        switch (this.lastActionType) {
            case ACTION_TYPES.PUSH_CRITERIA:
                if (this.lastConfigId) {
                    this.configList.forEach(config=> {
                        if (config.id == this.lastConfigId)
                            lastConfig = config;
                    });
                } else {
                    lastConfig = new CriteriaConfig();
                    lastConfig.sequence = 1;
                    this.configList.push(lastConfig);
                    this.lastConfigId = lastConfig.id;
                }
                return lastConfig;
            case ACTION_TYPES.PUSH_INVOKE:
                this.configList.forEach(config=> {
                    if (config.id == this.lastConfigId)
                        lastConfig = config;
                });
                nextConfig = new CriteriaConfig();
                nextConfig.sequence = lastConfig.sequence++;
                this.configList.push(nextConfig);
                this.lastConfigId = nextConfig.id;
                return nextConfig;
            case ACTION_TYPES.NEXT:
                this.configList.forEach(config=> {
                    if (config.id == this.lastConfigId)
                        lastConfig = config;
                });
                nextConfig = new CriteriaConfig();
                nextConfig.sequence = lastConfig.sequence++;
                this.configList.push(nextConfig);
                this.lastConfigId = nextConfig.id;
                return nextConfig;
        }

    }

    /**
     * 收集各种数据加载依赖的条件
     * @param criteria [boolean|function]
     */
    when(criteria) {
        if (typeof criteria != "function")
            return console.error(ERROR_TIPS.CRITERIA_ERROR);
        this.getLastConfig().pushCriteria(criteria);
        this.lastActionType = ACTION_TYPES.PUSH_CRITERIA;
        return this;
    }

    /**
     * 提供数据加载方案
     */
    then(invoke) {
        if (typeof invoke != "function")
            return console.error(ERROR_TIPS.INVOKE_ERROR);
        this.getLastConfig().pushInvoke(invoke);
        this.lastActionType = ACTION_TYPES.PUSH_INVOKE;
        return this;
    }

    /**
     * 下一步
     * @returns {DataPipe}
     */
    next() {
        this.lastActionType = ACTION_TYPES.NEXT;
        return this;
    }

    /**
     * 根据配置执行流程
     * @param scope 配置中函数执行的作用域
     */
    run(scope) {
        let continueFlag = true;
        let configList=this.configList.slice(0,this.configList.length);
        while (continueFlag && configList.length) {
            let executeConfigList = [configList.shift()];
            while (configList[0]&&executeConfigList[0].sequence == configList[0].sequence) {
                executeConfigList.push(configList.shift());
            }
            for (let i = 0; i < executeConfigList.length; i++) {
                let config = executeConfigList[i];
                let res = true;
                config.criteriaList.forEach(criteria=> {
                    res = res && criteria.call(scope);
                });
                if (res) {
                    config.invokeList.forEach(invoke=> {
                        invoke.call(scope);
                    });
                }else{
                    continueFlag = false;
                }
            }
        }
    }
}

const ERROR_TIPS = {
    CRITERIA_ERROR: "criteria should be function!",
    INVOKE_ERROR: "invoke should be function"
};
const ACTION_TYPES = {
    PUSH_CRITERIA: "PUSH_CRITERIA",
    PUSH_INVOKE: "PUSH_INVOKE",
    NEXT: "NEXT"
};


window.dataPipe=new DataPipe();

export default DataPipe;