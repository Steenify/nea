import { combineReducers } from 'redux';
import receiveSample from './receive-sample/reducer';
import querySampleKPIMonthly from './query-sample-kpi-monthly/reducer';
import querySampleKPIMonthlyDetail from './query-sample-kpi-monthly/detail/reducer';
import listOfSamplesIDed from './identified-samples/reducer';
import urgentSamples from '../vectorInspection/urgent-samples/reducer';

export default combineReducers({
  receiveSample,
  querySampleKPIMonthly,
  querySampleKPIMonthlyDetail,
  listOfSamplesIDed,
  urgentSamples,
});
