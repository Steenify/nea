import React, { lazy } from 'react';
import { WEB_ROUTES } from 'constants/index';
import ProtectedRoute from 'components/common/protected-route';

const UploadAuditFinding = lazy(() => import('modules/rodent-audit/upload-findings'));

const ManpowerList = lazy(() => import('modules/rodent-audit/manpower-list'));
const ManpowerListDetail = lazy(() => import('modules/rodent-audit/manpower-list-detail'));

const QueryLateSubmission = lazy(() => import('modules/rodent-audit/query-late-submission'));
const QueryAuditTask = lazy(() => import('modules/rodent-audit/query-audit-task'));
const QueryAuditTaskDetail = lazy(() => import('modules/rodent-audit/details/audit-task'));
const ShowCauseDetail = lazy(() => import('modules/rodent-audit/details/show-cause'));
const PendingContractorExplanationDetail = lazy(() => import('modules/rodent-audit/details/pending-contractor-explanation'));
const ExpiredTaskDetail = lazy(() => import('modules/rodent-audit/details/expired-task'));
const OperationalSchedule = lazy(() => import('modules/rodent-audit/operational-schedule'));
const SurveillanceActivitiesListed = lazy(() => import('modules/rodent-audit/operational-schedule/surveillance-activities-listed'));
const DailyReport = lazy(() => import('modules/rodent-audit/daily-report'));
const DailyReportDetail = lazy(() => import('modules/rodent-audit/daily-report-detail'));
const DailyDeployment = lazy(() => import('modules/rodent-audit/daily-deployment'));
const FeedbackInvestigationReport = lazy(() => import('modules/rodent-audit/feedback-investigation-report'));
const FeedbackInvestigationReportDetail = lazy(() => import('modules/rodent-audit/feedback-investigation-report-detail'));

const SupportLDAmountDetail = lazy(() => import('modules/rodent-audit/details/support-ld-amount'));
const LDAmountByMonth = lazy(() => import('modules/rodent-audit/details/approve-ld-amount'));

const RodentAuditRoutes = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.UPLOAD_FILES} component={UploadAuditFinding} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.MANPOWER_LIST} component={ManpowerList} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.MANPOWER_LIST_DETAIL} component={ManpowerListDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.QUERY_LATE_SUBMISSION} component={QueryLateSubmission} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.QUERY_AUDIT_TASK} component={QueryAuditTask} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.QUERY_AUDIT_TASK_DETAIL} component={QueryAuditTaskDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.EXPIRED_SHOWCAUSE_DETAIL} component={ExpiredTaskDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.SHOW_CAUSE_DETAIL} component={ShowCauseDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.PENDING_CONTRACTOR_EXPLANATION_DETAIL} component={PendingContractorExplanationDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.OPERATIONAL_SCHEDULE} component={OperationalSchedule} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.SURVEILLANCE_ACTIVITIES_LISTED} component={SurveillanceActivitiesListed} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.DAILY_DEPLOYMENT} component={DailyDeployment} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.DAILY_REPORT} component={DailyReport} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.DAILY_REPORT_DETAIL} component={DailyReportDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.FEEDBACK_INVESTIGATION_REPORT} component={FeedbackInvestigationReport} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.FEEDBACK_INVESTIGATION_REPORT_DETAIL} component={FeedbackInvestigationReportDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.SUPPORT_LD_AMOUNT} component={SupportLDAmountDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.APPROVE_LD_AMOUNT} component={LDAmountByMonth} />
  </>
);

export default RodentAuditRoutes;
