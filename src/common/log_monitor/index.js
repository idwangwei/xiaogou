/**
 * Created by 彭建伦 on 2016/10/13.
 */
import {LOG_LEVEL} from "./const";

class Logger {
    constructor() {
        this.logMonitor = window.LogMonitor ? window.LogMonitor : {
            logMessage: ()=>null
        }
    }

    debug(message) {
        this.logMonitor.logMessage(LOG_LEVEL.DEBUG, message);
    }

    warn(message) {
        this.logMonitor.logMessage(LOG_LEVEL.WARN, message);
    }

    error(message) {
        this.logMonitor.logMessage(LOG_LEVEL.ERROR, message);
    }
}

export default new Logger();
