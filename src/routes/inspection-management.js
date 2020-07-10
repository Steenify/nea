import React, { lazy } from 'react';
import { WEB_ROUTES } from 'constants/index';
import ProtectedRoute from 'components/common/protected-route';

const PrintScannableCodeLabels = lazy(() => import('modules/vectorInspection/print-scannable-code-labels'));
const DepositSamples = lazy(() => import('modules/vectorInspection/deposit-samples'));
const SendSamples = lazy(() => import('modules/vectorInspection/send-samples'));
const SamplesRoutes = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.PRINT_SCANNABLE_CODE_LABELS} component={PrintScannableCodeLabels} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.DEPOSIT_SAMPLE} component={DepositSamples} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.SEND_SAMPLE} component={SendSamples} />
  </>
);

// * --------------------------------------------------------------------------
const EditSOF = lazy(() => import('modules/vectorInspection/edit-sof'));
const SOFRoutes = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.EDIT_SOF} component={EditSOF} />
  </>
);

// * --------------------------------------------------------------------------
const QueryInspectionFormStatus = lazy(() => import('modules/vectorInspection/query-non-rodent-inspection'));
const QueryRodentInspection = lazy(() => import('modules/vectorInspection/query-rodent-inspection'));
const QueryRodentInspectionDetail = lazy(() => import('modules/vectorInspection/query-rodent-inspection-detail'));
const TrackSampleStatus = lazy(() => import('modules/vectorInspection/track-sample-status'));
const UrgentSample = lazy(() => import('modules/vectorInspection/urgent-samples'));
const ListSamplesIDed = lazy(() => import('modules/sample-identification/identified-samples'));
const VoidForm3Listing = lazy(() => import('modules/vectorInspection/void-form3-listing'));
const QueryForm3Status = lazy(() => import('modules/vectorInspection/query-form3-status'));
const Form3Detail = lazy(() => import('modules/details/form3'));
const GroundSurveillanceDetail = lazy(() => import('modules/vectorInspection/ground-surveillance-detail'));
const GroundSurveillanceListing = lazy(() => import('modules/vectorInspection/ground-surveillance'));
const Form3Routes = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_NON_RODENT_INSPECTION} component={QueryInspectionFormStatus} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_RODENT_INSPECTION} component={QueryRodentInspection} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_RODENT_INSPECTION_DETAIL} component={QueryRodentInspectionDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.TRACK_SAMPLE_STATUS} component={TrackSampleStatus} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.URGENT_SAMPLES} component={UrgentSample} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.IDENTIFIED_SAMPLES} component={ListSamplesIDed} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_VOID_LISTING} component={VoidForm3Listing} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_FORM3_STATUS} component={QueryForm3Status} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_DETAIL} component={Form3Detail} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.MONITORING_OF_INSPECTION_RESULTS} component={GroundSurveillanceListing} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.MONITORING_OF_INSPECTION_RESULTS_DETAIL} component={GroundSurveillanceDetail} />
  </>
);

// * --------------------------------------------------------------------------
const BlockSummary = lazy(() => import('modules/vectorInspection/blockSummary'));
const LatestInspection = lazy(() => import('modules/vectorInspection/latest-inspection'));
const BlockChart = lazy(() => import('modules/vectorInspection/blockChart'));
const BreedingSummary = lazy(() => import('modules/vectorInspection/blockSummary/breedingSummary'));
const BlockSummaryDetail = lazy(() => import('modules/vectorInspection/blockSummary/blockSummaryDetail'));
const BlockSummaryLandedDetail = lazy(() => import('modules/vectorInspection/blockSummary/blockSummaryLandedDetail'));
const GenerateNotice = lazy(() => import('modules/vectorInspection/generate-notice'));
const InsertNotice = lazy(() => import('modules/vectorInspection/insertNotice'));
const EnforceS35 = lazy(() => import('modules/vectorInspection/enforceS35'));
const PrintCallLetter = lazy(() => import('modules/vectorInspection/printCallLetter'));
const NoticeOfEntry = lazy(() => import('modules/vectorInspection/notice-of-entry'));
const ApprovingNoticeDetail = lazy(() => import('modules/vectorInspection/approving-notice-details'));

const BlockSummaryRoutes = () => (
  <>
    {/* Block Summary */}
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.BLOCK_SUMMARY} component={BlockSummary} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.BLOCK_SUMMARY_BLOCK_CHART} component={BlockChart} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.BLOCK_SUMMARY_BREEDING_SUMMARY} component={BreedingSummary} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.BLOCK_SUMMARY_DETAIL} component={BlockSummaryDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.BLOCK_SUMMARY_LANDED_DETAIL} component={BlockSummaryLandedDetail} />

    {/* Latest */}
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION} component={LatestInspection} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION_BLOCK_CHART} component={BlockChart} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION_BREEDING_SUMMARY} component={BreedingSummary} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION_BLOCK_DETAIL} component={BlockSummaryDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION_LANDED_DETAIL} component={BlockSummaryLandedDetail} />

    {/* Notice interaction */}
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.NOTICE_OF_ENTRY} component={NoticeOfEntry} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.PRINT_CALL_LETTER} component={PrintCallLetter} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.INSERT_NOTICE} component={InsertNotice} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.ENFORCE_S35} component={EnforceS35} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.GENERATE_NOTICE} component={GenerateNotice} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.APPROVING_NOTICE_DETAIL} component={ApprovingNoticeDetail} />
  </>
);

// * --------------------------------------------------------------------------
const QueryTownCouncilFineRegime = lazy(() => import('modules/vectorInspection/query-town-council-fine-regime'));
const TownCouncilFineRegime = lazy(() => import('modules/vectorInspection/town-council-fine-regime'));
const TownCouncilFineRegimeDetail = lazy(() => import('modules/vectorInspection/town-council-fine-regime-detail'));
const PCOSchedule = lazy(() => import('modules/vectorInspection/pco-schedule'));
const PCOScheduleUpload = lazy(() => import('modules/vectorInspection/upload-pco'));
const SendTCApprovedForm3ToEEMS2 = lazy(() => import('modules/vectorInspection/send-tc-approved-form3-to-eems2'));
const TownCouncilRoutes = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.PCO_SCHEDULE} component={PCOSchedule} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.UPLOAD_PCO_SCHEDULE} component={PCOScheduleUpload} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_TOWN_COUNCIL_FINE_REGIME} component={QueryTownCouncilFineRegime} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.TOWN_COUNCIL_FINE_REGIME} component={TownCouncilFineRegime} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.TOWN_COUNCIL_FINE_REGIME_DETAIL} component={TownCouncilFineRegimeDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.INSPECTION_MANAGEMENT.SEND_TC_FORM3_TO_EEMS2} component={SendTCApprovedForm3ToEEMS2} />
  </>
);

const InspectionManagementRoutes = () => (
  <>
    <SamplesRoutes />
    <SOFRoutes />
    <Form3Routes />
    <TownCouncilRoutes />
    <BlockSummaryRoutes />
  </>
);

export default InspectionManagementRoutes;
