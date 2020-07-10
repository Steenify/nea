import { combineReducers } from 'redux';
import groundSurveillanceListing from './ground-surveillance/reducer';
import groundSurveillanceDetail from './ground-surveillance-detail/reducer';
import depositSamples from './deposit-samples/reducer';
import sendSamples from './send-samples/reducer';
import queryRodentInspectionDetail from './query-rodent-inspection-detail/reducer';
import queryLateSubmission from '../rodent-audit/query-late-submission/reducer';
import blockChart from './blockChart/reducer';
import blockSummaryLandedDetail from './blockSummary/blockSummaryLandedDetail/reducer';
import blockSummaryDetail from './blockSummary/blockSummaryDetail/reducer';
import blockBreedingSummary from './blockSummary/breedingSummary/reducer';
import noticeOfEntry from './notice-of-entry/reducer';
import printCallLetter from './printCallLetter/reducer';
import insertNotice from './insertNotice/reducer';
import pcoSchedule from './pco-schedule/reducer';
import townCouncilFineRegimeDetail from './town-council-fine-regime-detail/reducer';
import sendTCApprovedForm3ToEEMS2 from './send-tc-approved-form3-to-eems2/reducer';
import generateNotice from './generate-notice/reducer';
import uploadPCO from './upload-pco/reducer';
import enforceS35 from './enforceS35/reducer';

export default combineReducers({
  groundSurveillanceListing,
  groundSurveillanceDetail,
  depositSamples,
  sendSamples,
  queryRodentInspectionDetail,
  queryLateSubmission,
  blockChart,
  blockSummaryLandedDetail,
  blockBreedingSummary,
  blockSummaryDetail,
  noticeOfEntry,
  printCallLetter,
  insertNotice,
  pcoSchedule,
  townCouncilFineRegimeDetail,
  sendTCApprovedForm3ToEEMS2,
  generateNotice,
  uploadPCO,
  enforceS35,
});
