var moduleEntryMap = require('./module_entry_map');
var moduleBundleMap = {};
Object.keys(moduleEntryMap).forEach((key) => {
    moduleBundleMap[key] = `${key}_bundle.js?t=` + new Date().getTime();
});
export default moduleBundleMap;