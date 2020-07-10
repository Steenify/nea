import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  SITE_PAPER_GRAVITRAP_AUDIT: {
    QUERY_LD_AMOUNT_BY_MONTH,
    PENDING_APPROVAL_SC_LISTING,
    PENDING_APPROVAL_SC_LISTING_DETAIL,
    LIAISING_WITH_OUTSOURCE_LISTING,
    LIAISING_WITH_OUTSOURCE_LISTING_DETAIL,
    REJECTED_LD_LISTING,
    REJECTED_LD_LISTING_DETAIL,
    PENDING_RESUBMISSION_LISTING,
    PENDING_RESUBMISSION_LISTING_DETAIL,
    APPROVE_REJECT_FINDINGS,
    UPDATE_SHOW_CAUSE,
    SAVE_FINDINGS_AS_DRAFT,
    LAPSES_OBSERVED_LISTING,
    VIEW_LD_APPROVED_BY_MONTH_AND_YEAR,
    UPDATE_LD_REMARKS_BY_MONTH_AND_YEAR,
    APPROVE_REJECT_SITE_PAPER_AUDIT,
    VIEW_LD_SUMMARY,
    UPDATE_GRAVITAP_LAPSES,
    RESUBMISSION_TASK,
    MANAGER_UPDATE_SHOWCAUSE,
    UPDATE_CORRESPONDENCE,
    LD_PENDING_SUPPORT,
    CHANGE_LD_STATUS,
    UPDATE_LAPSES_OBSERVED,
    GET_OUTSTANDING_AUDIT,
    GET_OFFICER_LAPSES,
    GET_LAPSES_BREAKDOWN,
    GET_TRAPS_AND_LAPSES,
    GET_LD_AMOUNT_BY_MONTH,
    UPLOAD_FINDINGS,
    SUPPORT_LD,
    COLLATE_SUPPORT_LD,
    COLLATE_APPROVE_LD,
    UPLOAD_APPROVED_DOCS,
  },
} = API_URLS;
export const queryLdRemarksByMonthAndYearService = (data = {}) => request({ ...data, ...QUERY_LD_AMOUNT_BY_MONTH });

export const pendingApprovalListingService = (data = {}) => request({ data, ...PENDING_APPROVAL_SC_LISTING });
export const pendingApprovalDetailService = (data = {}) => request({ data, ...PENDING_APPROVAL_SC_LISTING_DETAIL });

export const liaisingOutsourceListingService = (data = {}) => request({ data, ...LIAISING_WITH_OUTSOURCE_LISTING });
export const liaisingOutsourceDetailService = (data = {}) => request({ data, ...LIAISING_WITH_OUTSOURCE_LISTING_DETAIL });

export const rejectedLdListingService = (data = {}) => request({ data, ...REJECTED_LD_LISTING });
export const rejectedLdDetailService = (data = {}) => request({ data, ...REJECTED_LD_LISTING_DETAIL });

export const pendingResubmissionListingService = (data = {}) => request({ data, ...PENDING_RESUBMISSION_LISTING });
export const pendingResubmissionDetailService = (data = {}) => request({ data, ...PENDING_RESUBMISSION_LISTING_DETAIL });

export const approveRejectFindingsService = (data = {}) => request({ data, ...APPROVE_REJECT_FINDINGS });

export const updateShowCauseService = (data = {}) => request({ data, ...UPDATE_SHOW_CAUSE });

export const saveAsDraftService = (data = {}) => request({ data, ...SAVE_FINDINGS_AS_DRAFT });

export const lapsesObservedListingService = (data = {}) => request({ data, ...LAPSES_OBSERVED_LISTING });

export const viewLDApprovedByMonthandYearService = (data = {}) => request({ data, ...VIEW_LD_APPROVED_BY_MONTH_AND_YEAR });

export const updateLdRemarksByMonthAndYearService = (data = {}) => request({ data, ...UPDATE_LD_REMARKS_BY_MONTH_AND_YEAR });

export const approveRejectSitePaperAuditService = (data = {}) => request({ data, ...APPROVE_REJECT_SITE_PAPER_AUDIT });

export const viewLDSummaryService = (data = {}) => request({ data, ...VIEW_LD_SUMMARY });

export const updateGravitapLapsesService = (data = {}) => request({ data, ...UPDATE_GRAVITAP_LAPSES });

export const resubmissionService = (data = {}) => request({ data, ...RESUBMISSION_TASK });

export const managerUpdateShowCauseService = (data = {}) => request({ data, ...MANAGER_UPDATE_SHOWCAUSE });

export const updateCorrespondenceService = (data = {}) => request({ data, ...UPDATE_CORRESPONDENCE });

export const viewLDPendingSupportService = (data = {}) => request({ data, ...LD_PENDING_SUPPORT });

export const changeLDStatusService = (data = {}) => request({ data, ...CHANGE_LD_STATUS });

export const updateLapsesObservedService = (data = {}) => request({ data, ...UPDATE_LAPSES_OBSERVED });

export const getOutstandingauditService = (data = {}) => request({ data, ...GET_OUTSTANDING_AUDIT });

export const getOfficerlapsesService = (data = {}) => request({ data, ...GET_OFFICER_LAPSES });

export const getLapsebreakdownService = (data = {}) => request({ data, ...GET_LAPSES_BREAKDOWN });

export const getTrapandLapsesService = (data = {}) => request({ data, ...GET_TRAPS_AND_LAPSES });

export const getLDAmountByMonthService = (data = {}) => request({ data, ...GET_LD_AMOUNT_BY_MONTH });

export const uploadFindingsService = (data = {}) => request({ data, ...UPLOAD_FINDINGS });

export const supportLDService = (data = {}) => request({ data, ...SUPPORT_LD });

export const collateSupportLDService = (data = {}) => request({ data, ...COLLATE_SUPPORT_LD });

export const collateApproveLDService = (data = {}) => request({ data, ...COLLATE_APPROVE_LD });

export const updateApprovedLDService = (data = {}) => request({ data, ...UPLOAD_APPROVED_DOCS });
