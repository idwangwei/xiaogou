
export const SERVICE_COMPONENT = "service";
export const CONTROLLER_COMPONENT = "controller";
export const CONSTANT_COMPONENT = "constant";
export const FACTORY_COMPONENT = "factory";
export const FILTER_COMPONENT = "filter";
export const PROVIDER_COMPONENT = "provider";
/**
 * 批量为angular module注册组件
 * @param ngModule angular 模块
 * @param componentMap 需要注册的组件Map
 * @param componentType 需要注册的组件类型 [service|controller|constant|factory|filter|provider]
 */
export let registComponent = (ngModule, componentMap, componentType) => {
    Object.keys(componentMap).forEach((componentName) => {
        ngModule[componentType](componentName, componentMap[componentName]);
    });
};