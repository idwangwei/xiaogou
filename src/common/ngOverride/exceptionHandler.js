/**
 * Created by 彭建伦 on 2016/10/24.
 */
import logger from "log_monitor";
export default function () {
    return function (exception) {
      logger.error(exception.message);
    };
}
