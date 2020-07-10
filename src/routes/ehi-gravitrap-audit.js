import React, { lazy } from 'react';
import { WEB_ROUTES } from 'constants/index';
import ProtectedRoute from 'components/common/protected-route';

const QueryTaskAudited = lazy(() => import('modules/ehi-gravitrap-audit/query-task-audited'));
const QueryLapseObserved = lazy(() => import('modules/ehi-gravitrap-audit/query-lapse-observed'));
const UserLoggedTask = lazy(() => import('modules/ehi-gravitrap-audit/userLoggedTask'));
const AdHocLapse = lazy(() => import('modules/ehi-gravitrap-audit/upload-adhoc-lapse'));
const EHITaskDetail = lazy(() => import('modules/ehi-gravitrap-audit/taskdetail'));
const UploadDocumentLDApproved = lazy(() => import('modules/site-paper-gravitrap-audit/upload-documents-for-approved-ld'));
const UploadFindings = lazy(() => import('modules/ehi-gravitrap-audit/upload-findings'));

const QueryOutstandingAuditTask = lazy(() => import('modules/site-paper-gravitrap-audit/queries/outstanding-audit-task'));
const QueryTrapsAndLapses = lazy(() => import('modules/site-paper-gravitrap-audit/queries/traps-audited-lapses-observed'));
const QueryLapsesBreakdown = lazy(() => import('modules/site-paper-gravitrap-audit/queries/breakdown-of-lapses-observed'));
const QueryOfficerLapses = lazy(() => import('modules/site-paper-gravitrap-audit/queries/officer-with-low-lapses'));
const QueryLDByMonth = lazy(() => import('modules/site-paper-gravitrap-audit/queries/ld-by-month'));
const EHIGravitrapAuditRoutes = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.EHI_GRAVITRAP_AUDIT.USER_LOGGED_TASK} component={UserLoggedTask} />
    <ProtectedRoute exact route={WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_TASK_AUDITED_EHI} component={QueryTaskAudited} />
    <ProtectedRoute exact route={WEB_ROUTES.EHI_GRAVITRAP_AUDIT.UPLOADED_DOCUMENT_FOR_LD} component={UploadDocumentLDApproved} />
    <ProtectedRoute exact route={WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_LAPSE_OBSERVED_EHI} component={QueryLapseObserved} />
    <ProtectedRoute exact route={WEB_ROUTES.EHI_GRAVITRAP_AUDIT.UPDATE_ADHOC_LAPSE} component={AdHocLapse} />

    <ProtectedRoute exact route={WEB_ROUTES.EHI_GRAVITRAP_AUDIT.TASK_DETAIL} component={EHITaskDetail} />

    <ProtectedRoute exact route={WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_OUTSTANDING_AUDIT_TASK} component={QueryOutstandingAuditTask} />
    <ProtectedRoute exact route={WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_TRAPS_AUDITED_LAPSES_OBSERVED} component={QueryTrapsAndLapses} />
    <ProtectedRoute exact route={WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_BREAKDOWN_LAPSES_OBSERVED} component={QueryLapsesBreakdown} />
    <ProtectedRoute exact route={WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_OFFICER_WITH_LOW_LAPSE} component={QueryOfficerLapses} />
    <ProtectedRoute exact route={WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_LD_AMOUNT_BY_MONTH} component={QueryLDByMonth} />
    <ProtectedRoute exact route={WEB_ROUTES.EHI_GRAVITRAP_AUDIT.UPLOAD_FINDINGS} component={UploadFindings} />
  </>
);

export default EHIGravitrapAuditRoutes;
