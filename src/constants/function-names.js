export const DashboardFunctions = {
  getDashboardDetail: 'getDashboardDetail',
};

export const WorkspaceFunctions = {
  getWorkspaceListing: 'getWorkspaceListing',

  ehiWorkspace: 'ehiWorkspace',

  // * Inspection Management
  getForm3WorkspaceListing: 'getForm3WorkspaceListing',
  getNoEnforcementListing: 'getNoEnforcementListing',
  getNoFurtherActionListing: 'getNoFurtherActionListing',

  getEpiWorkspaceListing: 'getEpiWorkspaceListing',

  viewLDSummary: 'viewLDSummary',
  getPendingapprovalShowcause: 'getPendingapprovalShowcause',
  getPendingapprovalShowcauseDetail: 'getPendingapprovalShowcauseDetail',

  // * Rodent Audit
  rodentAuditWorkspaceListing: 'rodentAuditWorkspaceListing',
  pickNewAuditDate: 'pickNewAuditDate',
  ldSummaryBreakdown: 'ldSummaryBreakdown',
  approvalWithComments: 'approvalWithComments',

  getshowcause: 'getshowcause',

  getPendingLDSupport: 'getPendingLDSupport',

  // * Fogging Audit
  getFoggingWorkspaceListing: 'getFoggingWorkspaceListing',

  approvalListing: 'approvalListing',

  getLocSitePaperAudit: 'getLocSitePaperAudit',
  getLocSitePaperAuditDetail: 'getLocSitePaperAuditDetail',
  geRejectedSiteAudit: 'geRejectedSiteAudit',
  getRejectedSiteAuditDetail: 'getRejectedSiteAuditDetail',
  geRejectedSiteAuditDyhead: 'geRejectedSiteAuditDyhead',
  getLocSitePaperAuditRejected: 'getLocSitePaperAuditRejected',
  getLocSitePaperAuditRejectedDetail: 'getLocSitePaperAuditRejectedDetail',
  getPendingSupportWorkspaceListing: 'getPendingSupportWorkspaceListing',
};

export const CommonPoolFunctions = {
  getEHIAuditTasksCommonPoolListing: 'getEHIAuditTasksCommonPoolListing',

  getForm3CommonPoolListing: 'getForm3CommonPoolListing',

  ehiCommonpool: 'ehiCommonpool',

  getClaimTaskListing: 'getClaimTaskListing',

  claimEHIAuditTasks: 'claimEHIAuditTasks',
};

export const OpsAreaFunctions = {
  getActiveOps: 'getActiveOps',
  getActiveOpsUser: 'getActiveOpsUser',
  getAllActiveOpsRO: 'getAllActiveOpsRO',
  createAdhocOps: 'createAdhocOps',
  createUpdateOps: 'createUpdateOps',
  linktoOps: 'linktoOps',
  getAddressList: 'getAddressList',
  closeOperations: 'closeOperations',
  searchPostalcode: 'searchPostalcode',
  getSummary: 'getSummary',
  findbyOfficer: 'findbyOfficer',
  reassignOps: 'reassignOps',
  updateAdditionalInfo: 'updateAdditionalInfo',
  getAdditionalInfo: 'getAdditionalInfo',
  getActiveOpsSG: 'getActiveOpsSG',
};

export const AdministrationFunctions = {
  // * Master Codes
  deleteMasterDet: 'deleteMasterDet',
  updateMasterDet: 'updateMasterDet',
  createMasterDet: 'createMasterDet',

  // * Holiday
  searchHoliday: 'searchHoliday',
  deleteHoliday: 'deleteHoliday',
  updateHoliday: 'updateHoliday',
  createHoliday: 'createHoliday',

  // * Generate EWeek
  searchEweek: 'searchEweek',
  generateEweek: 'generateEweek',
  confirmEweek: 'confirmEweek',
  previousEweekYear: 'previousEweekYear',

  // * TC Division Mapping
  deleteDivision: 'deleteDivision',
  updateDivision: 'updateDivision',
  createDivision: 'createDivision',

  // * System Configuration
  searchSysConfig: 'searchSysConfig',
  deleteSysConfig: 'deleteSysConfig',
  updateSysConfig: 'updateSysConfig',
  createSysConfig: 'createSysConfig',

  // * Species Codes
  searchSpecies: 'searchSpecies',
  deleteSpecies: 'deleteSpecies',
  createSpecies: 'createSpecies',
  updateSpecies: 'updateSpecies',

  // * Specimen Codes
  deleteSpecimen: 'deleteSpecimen',
  createSpecimen: 'createSpecimen',
  updateSpecimen: 'updateSpecimen',

  // * Notification Template
  searchNotificationTemplate: 'searchNotificationTemplate',
  deleteNotificationTemplate: 'deleteNotificationTemplate',
  updateNotificationTemplate: 'updateNotificationTemplate',
  createNotificationTemplate: 'createNotificationTemplate',
  searchNotificationInfoForDropDown: 'searchNotificationInfoForDropDown',

  // * Broadcast Online Message
  searchBroadcastMessage: 'searchBroadcastMessage',
  deleteBroadcastMessage: 'deleteBroadcastMessage',
  updateBroadcastMessage: 'updateBroadcastMessage',
  createBroadcastMessage: 'createBroadcastMessage',

  // * Product
  searchProduct: 'searchProduct',
  deleteProduct: 'deleteProduct',
  updateProduct: 'updateProduct',
  createProduct: 'createProduct',

  // * User - Approver Mapping
  searchApprover: 'searchApprover',
  createApprover: 'createApprover',
  updateApprover: 'updateApprover',
  deleteApprover: 'deleteApprover',

  // * Lapse
  getLapseConfigList: 'getLapseConfigList',
  deleteLapseConfig: 'deleteLapseConfig',
  saveLapseConfig: 'saveLapseConfig',

  // * Optional Task LD Configuration
  queryOptionalLdInstanceCfgHistory: 'queryOptionalLdInstanceCfgHistory',
  createNewOptionalLdInstanceCfg: 'createNewOptionalLdInstanceCfg',
};

export const AuditLogsFunctions = {
  // * User Audit Logs
  retrieveUserAuditLog: 'retrieveUserAuditLog',
  downloadUserAuditLog: 'downloadUserAuditLog',

  // * System Audit Logs
  retrieveSystemAuditLog: 'retrieveSystemAuditLog',
  downloadSystemAuditLog: 'downloadSystemAuditLog',
};

export const AuthenticationFunctions = {
  // * Function Role Mapping
  searchAllRoles: 'searchAllRoles',
  getRolesNonAssigned: 'getRolesNonAssigned',
  getRolesAssigned: 'getRolesAssigned',
  submitRoleFunction: 'submitRoleFunction',
};

export const DashboardConfigurationFunctions = {
  saveWidgets: 'saveWidgets',
  deleteWidgets: 'deleteWidgets',
  getRoleWidgetList: 'getRoleWidgetList',
};

export const BatchJobManagementFunctions = {
  // * Batch Job
  searchBatchJobStatus: 'searchBatchJobStatus',
  viewBatchJobStatus: 'viewBatchJobStatus',
  createBatchJob: 'createBatchJob',
  deleteBatchJob: 'deleteBatchJob',
  triggerBatchJob: 'triggerBatchJob',
  updateBatchJob: 'updateBatchJob',
  searchJobEndPt: 'searchJobEndPt',
  terminateBatchJob: 'terminateBatchJob',
};

export const NonCheckFunctions = {
  rejectAssessment: 'rejectAssessment',
  supportAssessment: 'supportAssessment',

  submitTechOfficerAssessment: 'submitTechOfficerAssessment',
  submitUnitLeaderAssessment: 'submitUnitLeaderAssessment',
  saveAsDraftTechOfficerAssessment: 'saveAsDraftTechOfficerAssessment',
  saveAsDraftUnitLeaderAssessment: 'saveAsDraftUnitLeaderAssessment',
  saveAdhocTask: 'saveAdhocTask',
  submitAdhocTask: 'submitAdhocTask',

  approveRejectSitePaperAudit: 'approveRejectSitePaperAudit',
  updateShowcause: 'updateShowcause',
  saveDraftSitePaperAudit: 'saveDraftSitePaperAudit',
  getLapsesObserved: 'getLapsesObserved',
  approveLD: 'approveLD',
  supportCollateLd: 'supportCollateLd',
  approveCollateLd: 'approveCollateLd',
  updateApprovedLD: 'updateApprovedLD',
  getLapsesListing: 'getLapsesListing',
  updategravitapLapses: 'updategravitapLapses',
  updateAuditFindings: 'updateAuditFindings',
  updateShowcauseResubmission: 'updateShowcauseResubmission',
  updateContractorCorrespondencewithLapses: 'updateContractorCorrespondencewithLapses',

  uploadGraviTrapAuditFindings: 'uploadGraviTrapAuditFindings',
  supportGravitrapLd: 'supportGravitrapLd',
  saveEHIAdditionalLapse: 'saveEHIAdditionalLapse',
  deleteEHILapseById: 'deleteEHILapseById',
  deleteAllLapse: 'deleteAllLapse',
  submitLdSupportByMonthAndYear: 'submitLdSupportByMonthAndYear',
  viewLDApprovedByMonthandYear: 'viewLDApprovedByMonthandYear',
  viewLDSupportByMonthandYear: 'viewLDSupportByMonthandYear',
};

export const InspectionManagementFunctions = {
  printBarcode: 'printBarcode',
  getDefaultBarcodeQuantity: 'getDefaultBarcodeQuantity',

  // * General
  getInspectionFormListing: 'getInspectionFormListing',

  // * Sample
  depositSampleListing: 'depositSampleListing',
  sendSampleListing: 'sendSampleListing',
  validateDepositSampleBarcode: 'validateDepositSampleBarcode',
  validateSendSampleBarcode: 'validateSendSampleBarcode',
  submitDepositSample: 'submitDepositSample',
  submitSendSample: 'submitSendSample',

  // * Inspection SOF
  inspectionSofListing: 'inspectionSofListing',
  inspectionSofDetail: 'inspectionSofDetail',
  inspectionSofSave: 'inspectionSofSave',
  inspectionSofSubmit: 'inspectionSofSubmit',
  inspectionSofDownload: 'inspectionSofDownload',

  // * Form 3
  saveUrgentSample: 'saveUrgentSample',
  trackSampleListing: 'trackSampleListing',
  urgentSampleListing: 'urgentSampleListing',
  getSampleIdentifiedListing: 'getSampleIdentifiedListing',
  getForm3Detail: 'getForm3Detail',
  getQueryForm3Listing: 'getQueryForm3Listing',
  voidForm3: 'voidForm3',
  voidForm3Listing: 'voidForm3Listing',
  createForm3: 'createForm3',
  saveForm3: 'saveForm3',
  submitForm3: 'submitForm3',
  claimForm3: 'claimForm3',
  submitNoFutherAction: 'submitNoFutherAction',
  approveNoFurtherAction: 'approveNoFurtherAction',
  submitEnforcement: 'submitEnforcement',
  approveNoEnforcement: 'approveNoEnforcement',

  // * LOI
  getLOIListing: 'getLOIListing',
  createLOI: 'createLOI',
  saveLOI: 'saveLOI',
  downloadLOI: 'downloadLOI',
  previewLOI: 'previewLOI',
  submitLOIApproval: 'submitLOIApproval',
  approveLOI: 'approveLOI',

  // * Block Summary
  getBlockSummaryListing: 'getBlockSummaryListing',
  getLatestBlockSummaryListing: 'getLatestBlockSummaryListing',
  getLatestBreedingSummary: 'getLatestBreedingSummary',
  getBlockChart: 'getBlockChart',
  getBreedingSummary: 'getBreedingSummary',
  getBlockInspectionDetail: 'getBlockInspectionDetail',
  getLatestBlockInspectionDetail: 'getLatestBlockInspectionDetail',
  getInspectionNoticeApproverLov: 'getInspectionNoticeApproverLov',

  // * Ground Surveilance For Red Cluster
  getSurveillanceForRedCluster: 'getSurveillanceForRedCluster',
  getSurveillanceForRedClusterDetail: 'getSurveillanceForRedClusterDetail',

  // * Query Rodent Listing
  getRodentListing: 'getRodentListing',

  // * Town Council Fine Regime
  getAllTcRegimeListing: 'getAllTcRegimeListing',
  getTcRegimeListing: 'getTcRegimeListing',
  confirmTcRegime: 'confirmTcRegime',
  getTcRegimeSummary: 'getTcRegimeSummary',
  getTcRegimeDetail: 'getTcRegimeDetail',
  updateTcRegimeListing: 'updateTcRegimeListing',
  rejectTcRegime: 'rejectTcRegime',
  supportTcRegime: 'supportTcRegime',
  approveTcRegime: 'approveTcRegime',
  uploadTcRegimePcoInfo: 'uploadTcRegimePcoInfo',
  getTcRegimeDetailApprovedTcForm3List: 'getTcRegimeDetailApprovedTcForm3List',
  submitToEems: 'submitToEems',
};

export const SampleManagementFunctions = {
  claimSample: 'claimSample',
  validateRecSampleBarcode: 'validateRecSampleBarcode',
  getSampleInspectionFormListing: 'getSampleInspectionFormListing',
  certifyInspectionForm: 'certifyInspectionForm',
  submitFindings: 'submitFindings',
  getCertifyEmailGroups: 'getCertifyEmailGroups',

  listQuerySampleStatus: 'listQuerySampleStatus',
  submitReceivedSamples: 'submitReceivedSamples',
  getSampleKpiReportDetail: 'getSampleKpiReportDetail',
  getSampleKpiReport: 'getSampleKpiReport',
};

export const ReportFunctions = {
  // * Sample Identification
  generateDailySummaryOfSamples: 'generateDailySummaryOfSamples',
  generateSampleTreatment: 'generateSampleTreatment',
  generateSpecimenSamplesReceivedByEHI: 'generateSpecimenSamplesReceivedByEHI',
  generateDailySpecimenReceivedFromRO: 'generateDailySpecimenReceivedFromRO',
  generateSamplesIdentifiedByMonth: 'generateSamplesIdentifiedByMonth',
  generateReportForLocationsSpeciesHabitatAndDates: 'generateReportForLocationsSpeciesHabitatAndDates',

  // * Inspection Management
  generateSurveyByRoad: 'generateSurveyByRoad',
  generateQueryBreeding: 'generateQueryBreeding',
  generateQueryVoidInspection: 'generateQueryVoidInspection',
  generateDailyHabitat: 'generateDailyHabitat',

  // * EPI
  generateEPIFindings: 'generateEPIFindings',
  generateEPIClusterSummary: 'generateEPIClusterSummary',
  generateEPIClusterUnderSurveillance: 'generateEPIClusterUnderSurveillance',
  generateEPIFileActiveCases: 'generateEPIFileActiveCases',
  generateEPIFileUnderSurveillance: 'generateEPIFileUnderSurveillance',
  getCDCListing: 'getCDCListing',

  // * Gravitrap EHI Audit
  generateMosquitoSpecies: 'generateMosquitoSpecies',
  generateMosquitoID: 'generateMosquitoID',
  generateCompareContractorEHI: 'generateCompareContractorEHI',
  generateEHIAuditShowCause: 'generateEHIAuditShowCause',
  generateEHISampleMonth: 'generateEHISampleMonth',

  // * HQ
  generateInspectionAndBreeding: 'generateInspectionAndBreeding',
  generateAccessibilityRate: 'generateAccessibilityRate',
  generateABMLeweekInspections: 'generateABMLeweekInspections',
  generateABMLemonthInspections: 'generateABMLemonthInspections',
  generateABMLeweekPremiseWithBreeding: 'generateABMLeweekPremiseWithBreeding',
  generateABMLemonthPremiseWithBreeding: 'generateABMLemonthPremiseWithBreeding',
  generateABMLeweekBreedingHabitats: 'generateABMLeweekBreedingHabitats',
  generateABMLemonthBreedingHabitats: 'generateABMLemonthBreedingHabitats',
  generateABMLSummary: 'generateABMLSummary',
  generateFriendshipBoard: 'generateFriendshipBoard',
  generateConstructionSiteInspection: 'generateConstructionSiteInspection',
  generateConstructionSiteMonitoring: 'generateConstructionSiteMonitoring',
  generateEnforcementMonitoring: 'generateEnforcementMonitoring',

  // * Site Paper Audit
  generatePaperAuditShowCause: 'generatePaperAuditShowCause',
  generateSiteAuditShowCause: 'generateSiteAuditShowCause',
  generateMissedMaintenanceTrap: 'generateMissedMaintenanceTrap',
  generateCertificationReport: 'generateCertificationReport',
  generateSummaryOfTrapsAudited: 'generateSummaryOfTrapsAudited',
  generateAdHocLapses: 'generateAdHocLapses',
  generateAuditTaskDetails: 'generateAuditTaskDetails',

  // * Rodent Audit
  zoneTracking: 'zoneTracking',
  getAllCompanyNames: 'getAllCompanyNames',
  genereateShowCauseReport: 'genereateShowCauseReport',

  // * Fogging Audit
  generateFoggingNotificationsAndAuditResult: 'generateFoggingNotificationsAndAuditResult',

  // * Ops
  generateOperationReport: 'generateOperationReport',

  // * Admin Adhoc Report
  getTableListing: 'getTableListing',
  queryAdhocReport: 'queryAdhocReport',
};

export const EPIFunctions = {
  getUrgentEpiCaseTasks: 'getUrgentEpiCaseTasks',
  claimEpiCase: 'claimEpiCase',
  getEpiCaseInfoDetail: 'getEpiCaseInfoDetail',
  getReassignTaskListing: 'getReassignTaskListing',
  reassignEpiCase: 'reassignEpiCase',
  downloadBulkEpiFindings: 'downloadBulkEpiFindings',
  uploadEpiCase: 'uploadEpiCase',
  submitEpiCase: 'submitEpiCase',
  getBulkEpiFindingListing: 'getBulkEpiFindingListing',
};

export const GravitrapAuditFunctions = {
  // * EHI ------------------------------------------------
  uploadGraviTrapAdhocLapses: 'uploadGraviTrapAdhocLapses',
  // * User Logged Task
  getUserLoggedTasks: 'getUserLoggedTasks',
  updateUserLoggedTasks: 'updateUserLoggedTasks',

  // * Update Adhoc Lapse
  getEHILapseList: 'getEHILapseList',

  // * Queries
  queryLapseObserved: 'queryLapseObserved',
  queryTaskAudited: 'queryTaskAudited',

  // * Site - Paper ------------------------------------------------

  updateLdRemarksByMonthAndYear: 'updateLdRemarksByMonthAndYear',

  queryLdRemarksByMonthAndYear: 'queryLdRemarksByMonthAndYear',
  updateLapsesObserved: 'updateLapsesObserved',

  // * Queries
  getOutstandingaudit: 'getOutstandingaudit',
  getOfficerlapses: 'getOfficerlapses',
  getLapsebreakdown: 'getLapsebreakdown',
  getTrapandLapses: 'getTrapandLapses',
  queryapprovedLDAmount: 'queryapprovedLDAmount',
};

export const RodentAuditFunctions = {
  uploadBaseTaskFindings: 'uploadBaseTaskFindings',
  uploadOptionalTaskFindings: 'uploadOptionalTaskFindings',
  uploadFeedbackTaskFindings: 'uploadFeedbackTaskFindings',

  uploadRodentOperationalSchedules: 'uploadRodentOperationalSchedules',

  queryOperationalSchedulesInfo: 'queryOperationalSchedulesInfo',

  dailyReportListing: 'dailyReportListing',
  getDailyReportDetail: 'getDailyReportDetail',

  uploadRodentDailyReport: 'uploadRodentDailyReport',

  queryDailyDeployments: 'queryDailyDeployments',

  uploadDailyDeployment: 'uploadDailyDeployment',

  queryOperationalTaskSchedules: 'queryOperationalTaskSchedules',

  queryManpowerLists: 'queryManpowerLists',

  queryManpowerListInfo: 'queryManpowerListInfo',

  feedbackReportListing: 'getFeedbackReportListing',
  getFeedbackReportDetail: 'getFeedbackReportDetail',

  uploadRodentFeedback: 'uploadRodentFeedback',

  submitContractorCorrespondance: 'submitContractorCorrespondance',

  queryLateSubmission: 'queryLateSubmission',
  submitLateSubmissionsForShowcause: 'submitLateSubmissionsForShowcause',

  uploadRodentContractManpowerList: 'uploadRodentContractManpowerList',
  scheduleRodentAuditlisting: 'scheduleRodentAuditlisting',

  queryAuditTask: 'queryAuditTask',

  getExpiredPendingTaskDetail: 'getExpiredPendingTaskDetail',

  getNoShowCauseDetail: 'getNoShowCauseDetail',

  getAssignmentDetail: 'getAssignmentDetail',
  updateExplanation: 'updateExplanation',
  approveRejectExpiredTask: 'approveRejectExpiredTask',
  updateShowCause: 'updateShowCause',
  submitShowCause: 'submitShowCause',
  submitManagerRecommendation: 'submitManagerRecommendation',
  supportLD: 'supportLD',

  getAuditTaskLapsType: 'getAuditTaskLapsType',
};

export const FoggingAuditFunctions = {
  // * Workspace

  getFoggingEnforcementDetail: 'getFoggingEnforcementDetail',
  saveFoggingEnforcement: 'saveFoggingEnforcement',
  submitFoggingEnforcement: 'submitFoggingEnforcement',

  getFoggingExpiredTaskDetail: 'getFoggingExpiredTaskDetail',
  submitFoggingExpiredTask: 'submitFoggingExpiredTask',
  pickNewFoggingAuditDate: 'pickNewFoggingAuditDate',
  approveOrRejectFoggingExpiredTask: 'approveOrRejectFoggingExpiredTask',

  uploadFoggingFindings: 'uploadFoggingFindings',

  getAdhocFoggingAuditListing: 'getAdhocFoggingAuditListing',
  viewAdhocFoggingDetail: 'viewAdhocFoggingDetail',
  submitAdhocFoggingAudit: 'submitAdhocFoggingAudit',
  viewAdhocUpcomingFoggingDetail: 'viewAdhocUpcomingFoggingDetail',
  viewAdhocPastFoggingDetail: 'viewAdhocPastFoggingDetail',

  getFoggingActivityListing: 'getFoggingActivityListing',
  viewFoggingAuditTaskDetail: 'viewFoggingAuditTaskDetail',

  uploadFoggingSchedule: 'uploadFoggingSchedule',
  getFoggingScheduleListing: 'getFoggingScheduleListing',

  getOnsiteAuditListing: 'getOnsiteAuditListing',
  getOnsiteAuditDetail: 'getOnsiteAuditDetail',
  submitOnsiteAuditScheduleMatching: 'submitOnsiteAuditScheduleMatching',
};

export const NonFunctionalFunctions = {
  getAmountOfEmailSent: 'getAmountOfEmailSent',
  getEmailHistoryDetails: 'getEmailHistoryDetails',
  getAmtOfNotificationSent: 'getAmtOfNotificationSent',
  getInAppNotificationListDetails: 'getInAppNotificationListDetails',
  getInAppNotificationList: 'getInAppNotificationList',
  viewInAppNotification: 'viewInAppNotification',
  updateInAppNotification: 'updateInAppNotification',
  downloadInAppNotification: 'downloadInAppNotification',

  // * View Details
  querySampleInfo: 'querySampleInfo',
  getInspectionFormDetail: 'getInspectionFormDetail',
  viewAuditTasksByCaseId: 'viewAuditTasksByCaseId',

  getUserRolesLov: 'getUserRolesLov',

  searchUsers: 'searchUsers',

  viewSgAddress: 'viewSgAddress',

  getAllFunctionsForRoles: 'getAllFunctionsForRoles',

  getMasterCdLovByCodes: 'getMasterCdLovByCodes',

  viewApplicationStatus: 'viewApplicationStatus',

  serviceStatus: 'serviceStatus',

  searchSpecimen: 'searchSpecimen',
  searchMasterCd: 'searchMasterCd',
  searchDivision: 'searchDivision',

  broadcastOnlineMessage: 'broadcastOnlineMessage',
  searchBatchJob: 'searchBatchJob',

  getAuditTaskDetail: 'getAuditTaskDetail',

  commonFileUpload: 'commonFileUpload',
  showUpload: 'showUpload',

  checkForEncryption: 'checkForEncryption',
  uploadEncryptionCheck: 'uploadEncryptionCheck',

  // * Inspection
  getLatestLandedInspectionDetail: 'getLatestLandedInspectionDetail',
  getLandedInspectionDetail: 'getLandedInspectionDetail',

  // * Notice
  getApprovingNoticeDetail: 'getApprovingNoticeDetail',
  approveInspectionNotice: 'approveInspectionNotice',
  rejectInspectionNotice: 'rejectInspectionNotice',
  viewApprovedInspectionNotice: 'viewApprovedInspectionNotice',
  downloadInspectionNotice: 'downloadInspectionNotice',
  insertInspectionNotice: 'insertInspectionNotice',
  generateInspectionNotice: 'generateInspectionNotice',
  submitS35Enforcement: 'submitS35Enforcement',
  previewInspectionNotice: 'previewInspectionNotice',

  // * Block chart
  getLatestBlockChart: 'getLatestBlockChart',
};

export const FileOperationFunctions = {
  downloadErrorFile: 'downloadErrorFile',
  getUploadedFileListing: 'getUploadedFileListing',
  uploadFile: 'uploadFile',
  downloadFile: 'downloadFile',
  deleteFile: 'deleteFile',
  getSysConfigurations: 'getSysConfigurations',
};

const FUNCTION_NAMES = {
  ...DashboardConfigurationFunctions,
  ...WorkspaceFunctions,
  ...CommonPoolFunctions,
  ...DashboardFunctions,
  ...OpsAreaFunctions,
  ...AdministrationFunctions,
  ...InspectionManagementFunctions,
  ...SampleManagementFunctions,
  ...ReportFunctions,
  ...EPIFunctions,
  ...GravitrapAuditFunctions,
  ...RodentAuditFunctions,
  ...FoggingAuditFunctions,
  ...NonFunctionalFunctions,
  ...FileOperationFunctions,
  ...BatchJobManagementFunctions,
  ...AuditLogsFunctions,
  ...AuthenticationFunctions,
  ...NonCheckFunctions,
};

export default FUNCTION_NAMES;
