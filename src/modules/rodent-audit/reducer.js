import { combineReducers } from 'redux';
import uploadReducer from './upload-findings/reducer';
import queryLateSubmission from './query-late-submission/reducer';
import manpowerList from './manpower-list/reducer';
import manpowerListDetail from './manpower-list-detail/reducer';
import operationalSchedule from './operational-schedule/reducer';
import operationalScheduleInfo from './operational-schedule/surveillance-activities-listed/reducer';
import dailyReport from './daily-report/reducer';
import dailyDeployment from './daily-deployment/reducer';
import feedbackInvestigationReport from './feedback-investigation-report/reducer';
import optionalTaskLDConfiguration from './optional-task-ld-configuration/reducer';

export default combineReducers({
  uploadReducer,
  queryLateSubmission,
  manpowerList,
  manpowerListDetail,
  operationalSchedule,
  operationalScheduleInfo,
  dailyReport,
  dailyDeployment,
  feedbackInvestigationReport,
  optionalTaskLDConfiguration,
});
