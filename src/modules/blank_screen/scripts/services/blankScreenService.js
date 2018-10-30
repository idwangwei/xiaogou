/**
 * Created by ZL on 2017/10/19.
 */
import {Inject, actionCreator} from 'ngDecorator/ng-decorator';
@Inject('$q', '$rootScope', '$http', 'commonService', '$ngRedux', '$state', '$ionicBackdrop', 'blackScreenInterface')
class blankScreenService {
    commonService;
    blackScreenInterface;
    $q;

    getBlankStatus() {
        let defer = this.$q.defer();
        this.commonService.commonPost(this.blackScreenInterface.GET_BLANK_SCREEN)
            .then(data=> {
                if (data.code == 200) {
                    defer.resolve(data.blankScreen)
                } else {
                    defer.resolve(-1)
                }
            }, (e)=> {
                defer.resolve(-1)
            });
        return defer.promise;
    }
}
export default blankScreenService;