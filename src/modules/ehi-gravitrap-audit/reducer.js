import { combineReducers } from 'redux';
import userLoggedTask from './userLoggedTask/reducer';
import caseDetail from './taskdetail/reducer';
import adHocLapse from './upload-adhoc-lapse/reducer';
import uploadFile from './upload-findings/reducer';

export default combineReducers({ userLoggedTask, adHocLapse, caseDetail, uploadFile });
