import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  RODENT_AUDIT: {
    UPLOAD_BASE_TASK_FINDINGS,
    UPLOAD_OPTIONAL_TASK_FINDINGS,
    UPLOAD_FEEDBACK_TASK_FINDINGS,
    WORKSPACE,
    LATE_SUBMISSION,
    SUBMIT_FOR_SHOWCAUSE,
    UPDATE_SHOW_CAUSE,
    SUBMIT_MANAGER_RECOMMENDATION,
    QUERY_AUDIT_TASK,
    QUERY_AUDIT_TASK_DETAIL,
    SCHEDULE_LISTING,
    EXPIRED_SHOWCAUSE_ASSIGNMENT_DETAIL,
    EXPIRED_SHOWCAUSE_DETAIL,
    EXPIRED_SHOWCAUSE_UPDATE_EXPLANATION,
    EXPIRED_SHOWCAUSE_CHANGE_AUDIT_DATE,
    EXPIRED_SHOWCAUSE_APPROVE_REJECT,
    BURROW_COUNT_LAPSES,
    PENDING_LD_SUPPORT,
    SUPPORT_LD_AMOUNT,
    APPROVE_LD_AMOUNT,
    VIEW_LD_SUMMARY_BREAKDOWN,
    OPERATIONAL_SCHEDULE,
    OPERATIONAL_SCHEDULE_INFO,
    DAILY_REPORT_LISTING,
    DAILY_REPORT_DETAIL,
    UPLOAD_DAILY_REPORT,
    DAILY_DEVELOPMENT_LISTING,
    UPLOAD_DAILY_DEVELOPMENT,
    // OPS_SCHEDULE_LISTING,
    UPLOAD_ROD_CONTRACT_MANPOWER_LIST,
    MANPOWER_LISTING,
    MANPOWER_LIST_INFO,
    FEEDBACK_REPORT_LISTING,
    FEEDBACK_REPORT_LISTING_DETAIL,
    UPLOAD_RODENT_FEEDBACK,
    SUBMIT_CONTRACTOR_CORRESPONDENCE,
    OPTIONAL_INSTANCE_CFG_LISTING,
    SAVE_OPTIONAL_INSTANCE_CFG,
    GET_AUDIT_TASK_LAPSE_TYPE,
  },
} = API_URLS;
export const getAuditTaskLapsTypeService = (data) => request({ data, ...GET_AUDIT_TASK_LAPSE_TYPE });

export const uploadBaseTaskFindingsService = (data) => request({ data, ...UPLOAD_BASE_TASK_FINDINGS });
export const uploadOptionalTaskFindingsService = (data) => request({ data, ...UPLOAD_OPTIONAL_TASK_FINDINGS });
export const uploadFeedbackTaskFindingsService = (data) => request({ data, ...UPLOAD_FEEDBACK_TASK_FINDINGS });

export const rodentAuditWorkspaceListingService = (data) => request({ data, ...WORKSPACE });

export const getAuditTaskService = (data) => request({ data, ...QUERY_AUDIT_TASK });

export const getAuditTaskDetailService = (data) => request({ data, ...QUERY_AUDIT_TASK_DETAIL });

export const getLateSubmissionService = (data) => request({ data, ...LATE_SUBMISSION });

export const submitForShowcauseService = (data) => request({ data, ...SUBMIT_FOR_SHOWCAUSE });

export const updateShowcauseService = (data) => request({ data, ...UPDATE_SHOW_CAUSE });

export const submitManagerRecommendationService = (data) => request({ data, ...SUBMIT_MANAGER_RECOMMENDATION });

export const scheduleRodentAuditlistingService = (data) => request({ data, ...SCHEDULE_LISTING });

export const getAssignmentDetailService = (data) => request({ data, ...EXPIRED_SHOWCAUSE_ASSIGNMENT_DETAIL });

export const getExpiredShowcauseDetailService = (data) => request({ data, ...EXPIRED_SHOWCAUSE_DETAIL });

export const updateExplanationService = (data) => request({ data, ...EXPIRED_SHOWCAUSE_UPDATE_EXPLANATION });

export const approveRejectExpiredShowcauseService = (data) => request({ data, ...EXPIRED_SHOWCAUSE_APPROVE_REJECT });

export const pickNewAuditDateService = (data) => request({ data, ...EXPIRED_SHOWCAUSE_CHANGE_AUDIT_DATE });

export const getshowcauseService = (data) => request({ data, ...BURROW_COUNT_LAPSES });

export const getPendingLDSupportService = (data) => request({ data, ...PENDING_LD_SUPPORT });

export const supportLDService = (data) => request({ data, ...SUPPORT_LD_AMOUNT });

export const approvalWithCommentsService = (data) => request({ data, ...APPROVE_LD_AMOUNT });

export const ldSummaryBreakdownService = (data) => request({ data, ...VIEW_LD_SUMMARY_BREAKDOWN });

export const uploadRodentOperationalSchedulesService = (data) => request({ data, ...OPERATIONAL_SCHEDULE });

export const queryOperationalSchedulesInfoService = (data) => request({ data, ...OPERATIONAL_SCHEDULE_INFO });

export const dailyReportListingService = () => request({ ...DAILY_REPORT_LISTING });

export const getDailyReportDetailService = (data) => request({ data, ...DAILY_REPORT_DETAIL });

export const uploadDailyReportService = (data = {}) => request({ data, ...UPLOAD_DAILY_REPORT });

export const opsTaskScheduleListingService = () => request({ ...SCHEDULE_LISTING });

export const dailyDeploymentListingService = () => request({ ...DAILY_DEVELOPMENT_LISTING });

export const uploadDailyDevelopmentService = (data = {}) => request({ data, ...UPLOAD_DAILY_DEVELOPMENT });

export const uploadRodentContractManpowerListService = (data = {}) => request({ data, ...UPLOAD_ROD_CONTRACT_MANPOWER_LIST });

export const manpowerListingService = (data = {}) => request({ data, ...MANPOWER_LISTING });

export const manpowerListInfoService = (data = {}) => request({ data, ...MANPOWER_LIST_INFO });

export const feedbackReportListing = () => request({ ...FEEDBACK_REPORT_LISTING });

export const getFeedbackReportDetailService = (data) => request({ ...FEEDBACK_REPORT_LISTING_DETAIL, data });

export const uploadRodentFeedbackService = (data = {}) => request({ data, ...UPLOAD_RODENT_FEEDBACK });

export const submitContractorCorrespondenceService = (data = {}) => request({ data, ...SUBMIT_CONTRACTOR_CORRESPONDENCE });

export const optionalInstanceCfgListingService = () => request({ ...OPTIONAL_INSTANCE_CFG_LISTING });

export const saveOptionalInstanceCfgService = (data = {}) => request({ data, ...SAVE_OPTIONAL_INSTANCE_CFG });
