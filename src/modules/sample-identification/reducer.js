import { combineReducers } from 'redux';
import querySampleStatus from './query-sample-status/reducer';
import receiveSample from './receive-sample/reducer';
import trackSampleStatus from '../vectorInspection/track-sample-status/reducer';
import querySampleKPIMonthly from './query-sample-kpi-monthly/reducer';
import querySampleKPIMonthlyDetail from './query-sample-kpi-monthly/detail/reducer';
import listOfSamplesIDed from './identified-samples/reducer';
import urgentSamples from '../vectorInspection/urgent-samples/reducer';
import queryInspectionFormStatus from './query-inspection-form-status/reducer';

export default combineReducers({
  queryInspectionFormStatus,
  receiveSample,
  querySampleStatus,
  trackSampleStatus,
  querySampleKPIMonthly,
  querySampleKPIMonthlyDetail,
  listOfSamplesIDed,
  urgentSamples,
});
