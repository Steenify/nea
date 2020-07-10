import { combineReducers } from 'redux';
import taskDetail from './taskdetail/reducer';
import rejectedAdHocAuditTaskDetails from './rejected-ad-hoc-audit-task-details/reducer';

export default combineReducers({
  taskDetail,
  rejectedAdHocAuditTaskDetails,
});
