import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  FOGGING_AUDIT: {
    ADHOC_LISTING,
    ADHOC_UPCOMING_DETAIL,
    ADHOC_PAST_DETAIL,
    ADHOC_DETAIL,
    ADHOC_UPCOMING_SUBMIT,
    SCHEDULE_LISTING,
    QUERY_FOGGING,
    QUERY_FOGGING_AUDIT_TASK_DETAIL,
    UPLOAD_FOGGING_SCHEDULE,
    ON_SITE_AUDIT_LISTING,
    ON_SITE_AUDIT_DETAIL,
    ON_SITE_AUDIT_SUBMIT_SCHEDULE_MATCHING,
    FOGGING_WORKSPACE,
    FOGGING_WORKSPACE_ENFORCEMENT_DETAIL,
    FOGGING_WORKSPACE_ENFORCEMENT_DETAIL_SAVE,
    FOGGING_WORKSPACE_ENFORCEMENT_DETAIL_SUBMIT,
    FOGGING_WORKSPACE_EXPIRED_TASK_DETAIL,
    FOGGING_WORKSPACE_EXPIRED_TASK_SUBMIT,
    FOGGING_WORKSPACE_EXPIRED_TASK_PICK_NEW_DATE,
    FOGGING_WORKSPACE_EXPIRED_TASK_APPROVE_OR_REJECT,
    UPLOAD_FOGGING_FINDINGS,
  },
} = API_URLS;

export const getFoggingList = () =>
  request({
    ...ADHOC_LISTING,
  });

export const adHocUpcomingDetailService = (data) =>
  request({
    data,
    ...ADHOC_UPCOMING_DETAIL,
  });

export const adHocPastDetailService = (data) =>
  request({
    data,
    ...ADHOC_PAST_DETAIL,
  });

export const getFoggingAuditScheduleListService = () =>
  request({
    ...SCHEDULE_LISTING,
  });

export const uploadFoggingScheduleService = (data) => request({ data, ...UPLOAD_FOGGING_SCHEDULE });

export const uploadFoggingFindingsService = (data) =>
  request({
    data,
    ...UPLOAD_FOGGING_FINDINGS,
  });

// * ---------------------------- Ad Hoc Fogging ----------------------------
export const adHocFoggingAuditService = () => request({ ...ADHOC_LISTING });
export const adHocDetailService = (data) => request({ data, ...ADHOC_DETAIL });
// export const adHocDetailService = data => request({ data, ...ADHOC_DETAIL, host: hostConfigs.swagger.HostAPI });
export const submitAdhocFoggingAuditService = (data) => request({ data, ...ADHOC_UPCOMING_SUBMIT });

// * ---------------------------- Query Fogging ----------------------------
export const getFoggingActivityListingService = () => request({ ...QUERY_FOGGING });
export const viewFoggingAuditTaskDetailService = (data) => request({ ...QUERY_FOGGING_AUDIT_TASK_DETAIL, data });
// export const viewFoggingAuditTaskDetailService = data =>
//   request({ ...QUERY_FOGGING_AUDIT_TASK_DETAIL, data, host: hostConfigs.swagger.HostAPI });

// * ---------------------------- On Site Audit ----------------------------
export const getOnsiteAuditListingService = (data) =>
  request({
    data,
    ...ON_SITE_AUDIT_LISTING,
  });

export const getOnsiteAuditDetailService = (data) =>
  request({
    data,
    ...ON_SITE_AUDIT_DETAIL,
  });

export const submitOnsiteAuditScheduleMatchingService = (data) =>
  request({
    data,
    ...ON_SITE_AUDIT_SUBMIT_SCHEDULE_MATCHING,
  });

// * ---------------------------- Workspace ----------------------------
export const getFoggingWorkspaceListingService = (data) =>
  request({
    data,
    ...FOGGING_WORKSPACE,
  });

export const getFoggingEnforcementDetailService = (data) =>
  request({
    data,
    ...FOGGING_WORKSPACE_ENFORCEMENT_DETAIL,
  });

export const saveFoggingEnforcementService = (data) =>
  request({
    data,
    ...FOGGING_WORKSPACE_ENFORCEMENT_DETAIL_SAVE,
  });

export const submitFoggingEnforcementService = (data) =>
  request({
    data,
    ...FOGGING_WORKSPACE_ENFORCEMENT_DETAIL_SUBMIT,
  });

export const getFoggingExpiredTaskDetailService = (data) =>
  request({
    data,
    ...FOGGING_WORKSPACE_EXPIRED_TASK_DETAIL,
  });

export const submitFoggingExpiredTaskService = (data) =>
  request({
    data,
    ...FOGGING_WORKSPACE_EXPIRED_TASK_SUBMIT,
  });

export const pickNewFoggingAuditDateService = (data) =>
  request({
    data,
    ...FOGGING_WORKSPACE_EXPIRED_TASK_PICK_NEW_DATE,
  });

export const approveOrRejectFoggingExpiredTaskService = (data) =>
  request({
    data,
    ...FOGGING_WORKSPACE_EXPIRED_TASK_APPROVE_OR_REJECT,
  });
