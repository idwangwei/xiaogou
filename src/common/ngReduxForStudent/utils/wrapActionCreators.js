import { bindActionCreators } from 'redux';

export default  (actionCreators)=> {
  return dispatch => bindActionCreators(actionCreators, dispatch);
}
