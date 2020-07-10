import React, { lazy } from 'react';
import { WEB_ROUTES } from 'constants/index';
import ProtectedRoute from 'components/common/protected-route';

// * ------------------------------------------------------------------------------------
const EpiFindingsReport = lazy(() => import('modules/report/epi/epi-findings-report'));
const ClusterSummaryReport = lazy(() => import('modules/report/epi/cluster-summary-report'));
const ClusterUnderSurveilanceReport = lazy(() => import('modules/report/epi/cluster-under-surveilance-summary-report'));
const DengueFileForActiveCases = lazy(() => import('modules/report/epi/dengue-website-file-for-active-cases'));
const DengueFileForClusterUnderSurveilance = lazy(() => import('modules/report/epi/dengue-website-file-for-cluster-under-surveilance'));
const EPIReports = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.EPI_FINDING_REPORT} component={EpiFindingsReport} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.CLUSTER_SUMMARY_REPORT} component={ClusterSummaryReport} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.CLUSTER_UNDER_SURVEILANCE_SUMMARY_REPORT} component={ClusterUnderSurveilanceReport} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.DENGUE_WEBSITE_FILE_FOR_ACTIVE_CASES} component={DengueFileForActiveCases} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.DENGUE_WEBSITE_FILE_UNDER_SURVEILANCE} component={DengueFileForClusterUnderSurveilance} />
  </>
);

// * ------------------------------------------------------------------------------------
const DailySummaryOfSamplesReport = lazy(() => import('modules/report/sample-identification/daily-summary-of-samples'));
const SamplesTreatmentReport = lazy(() => import('modules/report/sample-identification/samples-treatment'));
const SamplesReceivedByEHIReport = lazy(() => import('modules/report/sample-identification/specimen-samples-received-by-ehi'));
const DailySpecimenReceivedFromRO = lazy(() => import('modules/report/sample-identification/daily-specimen-received-from-ro'));
const SamplesIdentifiedByMonth = lazy(() => import('modules/report/sample-identification/samples-identified-by-month'));
const ReportForLocationsSpeciesHabitatAndDatesService = lazy(() => import('modules/report/sample-identification/report-for-location-species-habitat-and-date'));
const SampleManagementReports = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.DAILY_SUMMARY_OF_SAMPLES} component={DailySummaryOfSamplesReport} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.SAMPLES_TREATMENT} component={SamplesTreatmentReport} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.SPECIMEN_SAMPLES_RECEIVED_BY_EHI} component={SamplesReceivedByEHIReport} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.DAILY_SPECIMEN_RECEIVED_FROM_RO} component={DailySpecimenReceivedFromRO} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.SAMPLES_IDENTIFIED_BY_MONTH} component={SamplesIdentifiedByMonth} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.CUSTOM_REPORT_FOR_LOCATIONS_SPECIES_HABITATS_DATES} component={ReportForLocationsSpeciesHabitatAndDatesService} />
  </>
);

// * ------------------------------------------------------------------------------------
const SurveyByRoadReport = lazy(() => import('modules/report/inspection-management/survey-by-road'));
const QueryBreedingReport = lazy(() => import('modules/report/inspection-management/query-breeding'));
const QueryVoidInspectionReport = lazy(() => import('modules/report/inspection-management/query-void-inspection'));
const DailyHabitatReport = lazy(() => import('modules/report/inspection-management/daily-habitat'));
const InspectionManagementReports = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.SURVEY_BY_ROAD} component={SurveyByRoadReport} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.QUERY_BREEDING} component={QueryBreedingReport} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.QUERY_VOID_INSPECTION} component={QueryVoidInspectionReport} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.DAILY_HABITAT} component={DailyHabitatReport} />
  </>
);

// * ------------------------------------------------------------------------------------
const InspectionAndBreeding = lazy(() => import('modules/report/hq/inspection-and-breeding'));
const AccessibilityRate = lazy(() => import('modules/report/hq/accessibility-rate'));
const BreedingMasterListInspectionEweek = lazy(() => import('modules/report/hq/aedes-breeding-master-list-inspections-eweek'));
const BreedingMasterListInspectionEmonth = lazy(() => import('modules/report/hq/aedes-breeding-master-list-inspections-emonth'));
const AedesBreedingMasterListBreedingEMonth = lazy(() => import('modules/report/hq/aedes-breeding-master-list–premise-with-breeding-emonth'));
const BreedingMasterListPremiseBreedingEweek = lazy(() => import('modules/report/hq/aedes-breeding-master-list-premise-with-breeding-eweek'));
const AedesBreedingMasterListBreedingHabitatsEWeek = lazy(() => import('modules/report/hq/aedes-breeding-master-list-breeding-habitats-eweek'));
const AedesBreedingMasterListBreedingHabitatsEMonth = lazy(() => import('modules/report/hq/aedes-breeding-master-list-breeding-habitats-emonth'));
const AedesBreedingMasterListSummary = lazy(() => import('modules/report/hq/aedes-breeding-master-list-summary'));
const FriendshipBoard = lazy(() => import('modules/report/hq/friendship-board'));
const ConstructionSiteInspection = lazy(() => import('modules/report/hq/construction-site-inspection'));
const ConstructionSiteMonitoring = lazy(() => import('modules/report/hq/construction-site-monitoring'));
const EnforcementMonitoring = lazy(() => import('modules/report/hq/enforcement-monitoring'));
const HQReports = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.INSPECTION_AND_BREEDING} component={InspectionAndBreeding} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.ACCESSIBILITY_RATE} component={AccessibilityRate} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.AEDES_BREEDING_MASTER_LIST_INSPECTIONS_EWEEK} component={BreedingMasterListInspectionEweek} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.AEDES_BREEDING_MASTER_LIST_INSPECTIONS_EMONTH} component={BreedingMasterListInspectionEmonth} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.AEDES_BREEDING_MASTER_LIST_PREMISE_WITH_BREEDING_EMONTH} component={AedesBreedingMasterListBreedingEMonth} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.AEDES_BREEDING_MASTER_LIST_PREMISE_WITH_BREEDING_HABITATS_EWEEK} component={AedesBreedingMasterListBreedingHabitatsEWeek} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.AEDES_BREEDING_MASTER_LIST_PREMISE_WITH_BREEDING_HABITATS_EMONTH} component={AedesBreedingMasterListBreedingHabitatsEMonth} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.AEDES_BREEDING_MASTER_LIST_PREMISE_WITH_BREEDING_EWEEK} component={BreedingMasterListPremiseBreedingEweek} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.AEDES_BREEDING_MASTER_LIST_SUMMARY} component={AedesBreedingMasterListSummary} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.FRIENDSHIP_BOARD} component={FriendshipBoard} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.CONSTRUCTION_SITE_INSPECTION} component={ConstructionSiteInspection} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.CONSTRUCTION_SITE_MONITORING} component={ConstructionSiteMonitoring} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.ENFORCEMENT_MONITORING} component={EnforcementMonitoring} />
  </>
);

// * ------------------------------------------------------------------------------------
const MosquitoID = lazy(() => import('modules/report/gravitrap-ehi-audit/mosquito-id'));
const SummaryMosquitoInCluster = lazy(() => import('modules/report/gravitrap-ehi-audit/summary-mosquito-in-cluster'));
const CompareContractorEHI = lazy(() => import('modules/report/gravitrap-ehi-audit/compare-contractor-ehi'));
const GravitrapEHIShowCause = lazy(() => import('modules/report/gravitrap-ehi-audit/ehi-gravitrap-audit-show-cause'));
const GravitrapEHIAuditReports = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.SUMMARY_OF_MOSQUITO_IN_CLUSTER} component={SummaryMosquitoInCluster} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.MOSQUITO_ID_REPORT} component={MosquitoID} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.COMPARE_CONTRACTOR_EHI} component={CompareContractorEHI} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.EHI_AUDIT_SHOW_CAUSE_REPORT} component={GravitrapEHIShowCause} />
  </>
);

// * ------------------------------------------------------------------------------------
const SiteAuditShowCause = lazy(() => import('modules/report/site-paper-audit/site-audit-show-cause'));
const PaperAuditShowCause = lazy(() => import('modules/report/site-paper-audit/paper-audit-show-cause'));
const SummaryOfTrapsAudited = lazy(() => import('modules/report/site-paper-audit/summary-of-traps-audited'));
const MissedMaintenanceTrap = lazy(() => import('modules/report/site-paper-audit/missed-maintenance-trap'));
const CertificationReport = lazy(() => import('modules/report/site-paper-audit/certification-report'));
const AdhocLapse = lazy(() => import('modules/report/site-paper-audit/ad-hoc-lapse'));
const AuditTaskDetails = lazy(() => import('modules/report/site-paper-audit/audit-task-details'));
const SitePaperReports = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.SITE_AUDIT_SHOW_CAUSE_REPORT} component={SiteAuditShowCause} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.PAPER_AUDIT_SHOW_CAUSE_REPORT} component={PaperAuditShowCause} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.SUMMARY_OF_TRAPS_AUDITED} component={SummaryOfTrapsAudited} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.DISCREPANCY_NUMBER_OF_TRAPS} component={MissedMaintenanceTrap} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.CERTIFICATION_REPORT} component={CertificationReport} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.EHI_ADHOC_LAPSES} component={AdhocLapse} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.AUDIT_TASK_DETAILS} component={AuditTaskDetails} />
  </>
);

// * ------------------------------------------------------------------------------------
const ZoneTracking = lazy(() => import('modules/report/rodent-audit/zone-tracking'));
const ShowCause = lazy(() => import('modules/report/rodent-audit/show-cause'));
const RodentAuditReports = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.ZONE_TRACKING} component={ZoneTracking} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.RODENT_AUDIT_SHOW_CAUSE_REPORT} component={ShowCause} />
  </>
);

// * ------------------------------------------------------------------------------------
const NotificationAndAuditResults = lazy(() => import('modules/report/fogging-audit/notification-and-audit-result'));

const FoggingAuditReports = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.FOGGING_NOTIFICATION_AND_AUDIT} component={NotificationAndAuditResults} />
  </>
);

// * ------------------------------------------------------------------------------------
const OperationReport = lazy(() => import('modules/report/ops-area/operation-report'));

const OpsAreaReports = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.OPERATION_REPORT} component={OperationReport} />
  </>
);

// * ------------------------------------------------------------------------------------
const AdhocReportHeader = lazy(() => import('modules/report/adhoc-report/report-header'));
const AdhocReportQuery = lazy(() => import('modules/report/adhoc-report/query-adhoc-report'));

const AdhocReports = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.ADHOC_REPORT_SELECT_HEADER} component={AdhocReportHeader} />
    <ProtectedRoute exact route={WEB_ROUTES.REPORT.ADHOC_REPORT_QUERY} component={AdhocReportQuery} />
  </>
);

const ReportRoutes = () => (
  <>
    <InspectionManagementReports />
    <EPIReports />
    <SampleManagementReports />
    <GravitrapEHIAuditReports />
    <HQReports />
    <SitePaperReports />
    <RodentAuditReports />
    <FoggingAuditReports />
    <OpsAreaReports />
    <AdhocReports />
  </>
);

export default ReportRoutes;
