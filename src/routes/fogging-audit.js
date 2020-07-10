import React, { lazy } from 'react';
import { BrowserRouter as Route } from 'react-router-dom';
import { WEB_ROUTES } from 'constants/index';
import ProtectedRoute from 'components/common/protected-route';

const NotFound = lazy(() => import('pages/404'));

const AdHocFoggingAudit = lazy(() => import('modules/fogging-audit/ad-hoc-listing'));
const AdHocFoggingAuditDetail = lazy(() => import('modules/fogging-audit/ad-hoc-detail'));
const FoggingSchedule = lazy(() => import('modules/fogging-audit/fogging-schedule'));
const UpcomingFoggingDetail = lazy(() => import('modules/fogging-audit/details/upcoming-fogging'));
const PastFoggingDetail = lazy(() => import('modules/fogging-audit/details/past-fogging'));

const EnforcementDetail = lazy(() => import('modules/fogging-audit/details/fogging-enforcment'));
const ExpiredTaskDetail = lazy(() => import('modules/fogging-audit/details/fogging-expired-task'));

const QueryFogging = lazy(() => import('modules/fogging-audit/query-fogging'));
const QueryFoggingAuditTaskDetail = lazy(() => import('modules/fogging-audit/details/query-fogging-audit-task'));

const OnSiteAuditResults = lazy(() => import('modules/fogging-audit/on-site-audit-results'));
const OnSiteAuditResultsDetail = lazy(() => import('modules/fogging-audit/on-site-audit-results-detail'));

const UploadFilesSchedule = lazy(() => import('modules/fogging-audit/upload-files-schedule'));

const FoggingAuditRoutes = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.FOGGING_AUDIT.AD_HOC} component={AdHocFoggingAudit} />
    <ProtectedRoute exact route={WEB_ROUTES.FOGGING_AUDIT.AD_HOC_DETAIL} component={AdHocFoggingAuditDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.FOGGING_AUDIT.FOGGING_SCHEDULE} component={FoggingSchedule} />
    <ProtectedRoute exact route={WEB_ROUTES.FOGGING_AUDIT.AD_HOC_UPCOMING_FOGGING_DETAIL} component={UpcomingFoggingDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.FOGGING_AUDIT.AD_HOC_PAST_FOGGING_DETAIL} component={PastFoggingDetail} />

    <ProtectedRoute exact route={WEB_ROUTES.FOGGING_AUDIT.FOGGING_WORKSPACE_ENFORCEMENT_DETAIL} component={EnforcementDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.FOGGING_AUDIT.FOGGING_WORKSPACE_EXPIRED_TASK_DETAIL} component={ExpiredTaskDetail} />

    <ProtectedRoute exact route={WEB_ROUTES.FOGGING_AUDIT.QUERY_FOGGING} component={QueryFogging} />
    <ProtectedRoute exact route={WEB_ROUTES.FOGGING_AUDIT.QUERY_FOGGING_AUDIT_TASK_DETAIL} component={QueryFoggingAuditTaskDetail} />

    <ProtectedRoute exact route={WEB_ROUTES.FOGGING_AUDIT.ON_SITE_AUDIT_RESULTS} component={OnSiteAuditResults} />
    <ProtectedRoute exact route={WEB_ROUTES.FOGGING_AUDIT.ON_SITE_AUDIT_RESULTS_DETAIL} component={OnSiteAuditResultsDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.FOGGING_AUDIT.UPLOAD_FILES_SCHEDULE} component={UploadFilesSchedule} />

    <Route component={NotFound} />
  </>
);

export default FoggingAuditRoutes;
