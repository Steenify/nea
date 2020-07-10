import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  REPORT: {
    SITE_PAPER_AUDIT: {
      PAPER_AUDIT_SHOW_CAUSE_REPORT,
      SITE_AUDIT_SHOW_CAUSE_REPORT,
      CERTIFICATION_REPORT,
      SUMMARY_OF_TRAPS_AUDITED,
      MISSED_MAINTENANCE_TRAP,
      ADHOC_LAPSES,
      AUDIT_TASK_DETAILS,
    },
  },
} = API_URLS;

export const generateAuditTaskDetailsService = data =>
  request({
    data,
    ...AUDIT_TASK_DETAILS,
  });

export const generateCertificationReportService = data =>
  request({
    data,
    ...CERTIFICATION_REPORT,
  });

export const generateMissedMaintenanceTrapService = data =>
  request({
    data,
    ...MISSED_MAINTENANCE_TRAP,
  });

export const generateSummaryOfTrapsAuditedService = data =>
  request({
    data,
    ...SUMMARY_OF_TRAPS_AUDITED,
  });

export const generatePaperAuditShowCauseService = data =>
  request({
    data,
    ...PAPER_AUDIT_SHOW_CAUSE_REPORT,
  });

export const generateSiteAuditShowCauseService = data =>
  request({
    data,
    ...SITE_AUDIT_SHOW_CAUSE_REPORT,
  });

export const generateAdHocLapsesService = data =>
  request({
    data,
    ...ADHOC_LAPSES,
  });
