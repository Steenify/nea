import React, { lazy } from 'react';
import { WEB_ROUTES } from 'constants/index';
import ProtectedRoute from 'components/common/protected-route';

const TaskDetail = lazy(() => import('modules/site-paper-gravitrap-audit/taskdetail'));
const RejectedAdHocAuditTaskDetails = lazy(() => import('modules/site-paper-gravitrap-audit/rejected-ad-hoc-audit-task-details'));
const SupportLD = lazy(() => import('modules/site-paper-gravitrap-audit/template/ld-support'));
const ApprovalLD = lazy(() => import('modules/site-paper-gravitrap-audit/template/ld-approval'));

const SitePaperRoutes = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.SITE_PAPER_GRAVITRAP_AUDIT.TASK_DETAIL} component={TaskDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.SITE_PAPER_GRAVITRAP_AUDIT.LD_APPROVAL} component={ApprovalLD} />
    <ProtectedRoute exact route={WEB_ROUTES.SITE_PAPER_GRAVITRAP_AUDIT.REJECTED_AD_HOC_AUDIT_TASK_DETAILS} component={RejectedAdHocAuditTaskDetails} />
    <ProtectedRoute exact route={WEB_ROUTES.SITE_PAPER_GRAVITRAP_AUDIT.SUPPORT_LD} component={SupportLD} />
  </>
);

export default SitePaperRoutes;
