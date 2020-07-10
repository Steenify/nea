import React, { lazy } from 'react';
import { WEB_ROUTES } from 'constants/index';
import ProtectedRoute from 'components/common/protected-route';

const MasterCodeMaintenance = lazy(() => import('modules/admin/administration-configuration/master-code'));
const MasterCodeMaintenanceDetail = lazy(() => import('modules/admin/administration-configuration/master-code-detail'));
const HolidayMaintenance = lazy(() => import('modules/admin/administration-configuration/holiday'));
const EWeekGeneration = lazy(() => import('modules/admin/administration-configuration/eWeek'));
const EWeekListing = lazy(() => import('modules/admin/administration-configuration/eWeek-listing'));
const DivisionMaintenance = lazy(() => import('modules/admin/administration-configuration/division-mapping'));
const SpecimenMaintenance = lazy(() => import('modules/admin/administration-configuration/specimen'));
const SpeciesCodeMaintenance = lazy(() => import('modules/admin/administration-configuration/species-code'));
const ConfigurationParameterMaintenance = lazy(() => import('modules/admin/administration-configuration/system-configuration'));
const ProductMaintenance = lazy(() => import('modules/admin/administration-configuration/product'));
const NotificationTemplateMaintenance = lazy(() => import('modules/admin/administration-configuration/notification-template'));
const NotificationTemplateMaintenanceDetail = lazy(() => import('modules/admin/administration-configuration/notification-template-detail'));
const BroadcastOnlineMessageMaintenance = lazy(() => import('modules/admin/administration-configuration/broadcast-online-message'));
const BroadcastOnlineMessageMaintenanceDetail = lazy(() => import('modules/admin/administration-configuration/broadcast-online-message-detail'));
const UserApproverMapping = lazy(() => import('modules/admin/administration-configuration/user-approver-mapping'));
const LapseConfiguration = lazy(() => import('modules/admin/administration-configuration/lapse-configuration'));

const OptionalTaskLDConfigurationList = lazy(() => import('modules/rodent-audit/optional-task-ld-configuration/list'));
const OptionalTaskLDConfigurationNew = lazy(() => import('modules/rodent-audit/optional-task-ld-configuration/new'));

// * Administration & Configuration
const AdministrationAndCofiguration = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.ADMINISTRATION.MASTER_CODE} component={MasterCodeMaintenance} />
    <ProtectedRoute exact route={WEB_ROUTES.ADMINISTRATION.MASTER_CODE_DETAIL} component={MasterCodeMaintenanceDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.ADMINISTRATION.HOLIDAY} component={HolidayMaintenance} />
    <ProtectedRoute exact route={WEB_ROUTES.ADMINISTRATION.EWEEK} component={EWeekListing} />
    <ProtectedRoute exact route={WEB_ROUTES.ADMINISTRATION.EWEEK_GENERATE} component={EWeekGeneration} />
    <ProtectedRoute exact route={WEB_ROUTES.ADMINISTRATION.DIVISION_TC_MAPPING} component={DivisionMaintenance} />
    <ProtectedRoute exact route={WEB_ROUTES.ADMINISTRATION.SPECIES_CODE} component={SpeciesCodeMaintenance} />
    <ProtectedRoute exact route={WEB_ROUTES.ADMINISTRATION.SPECIMEN} component={SpecimenMaintenance} />
    <ProtectedRoute exact route={WEB_ROUTES.ADMINISTRATION.CONFIGURATION_MAINTENANCE} component={ConfigurationParameterMaintenance} />
    <ProtectedRoute exact route={WEB_ROUTES.ADMINISTRATION.PRODUCT} component={ProductMaintenance} />
    <ProtectedRoute exact route={WEB_ROUTES.ADMINISTRATION.NOTIFICATION_TEMPLATE} component={NotificationTemplateMaintenance} />
    <ProtectedRoute exact route={WEB_ROUTES.ADMINISTRATION.NOTIFICATION_TEMPLATE_DETAIL} component={NotificationTemplateMaintenanceDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.ADMINISTRATION.BROADCAST_MESSAGES} component={BroadcastOnlineMessageMaintenance} />
    <ProtectedRoute exact route={WEB_ROUTES.ADMINISTRATION.BROADCAST_MESSAGES_DETAIL} component={BroadcastOnlineMessageMaintenanceDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.ADMINISTRATION.USER_APPROVER_MAPPING} component={UserApproverMapping} />
    <ProtectedRoute exact route={WEB_ROUTES.ADMINISTRATION.LAPSE_CONFIGURATION} component={LapseConfiguration} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.OPTIONAL_TASK_LD_CONFIGURATION_LIST} component={OptionalTaskLDConfigurationList} />
    <ProtectedRoute exact route={WEB_ROUTES.RODENT_AUDIT.OPTIONAL_TASK_LD_CONFIGURATION_NEW} component={OptionalTaskLDConfigurationNew} />
  </>
);

const RoleFunctionMapping = lazy(() => import('modules/admin/authentication-authorisation/role-function-mapping'));
const RoleFunctionMappingDetail = lazy(() => import('modules/admin/authentication-authorisation/role-function-mapping-detail'));

// * Authentication & Authorisation
const AuthenticationAndAuthorisation = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.AUTHENTICATION_AUTHORISATION.FUNCTION_ROLE_MAPPING} component={RoleFunctionMapping} />
    <ProtectedRoute exact route={WEB_ROUTES.AUTHENTICATION_AUTHORISATION.FUNCTION_ROLE_MAPPING_DETAIL} component={RoleFunctionMappingDetail} />
  </>
);

// * --------------------------------------------------------------
const UserAuditLog = lazy(() => import('modules/admin/audit-trails-reports/user-audit-log'));
const SystemAuditLog = lazy(() => import('modules/admin/audit-trails-reports/system-audit-log'));

// * Audit Trails & Reports
const AuditTrailsAndReports = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.AUDIT_TRAILS_REPORT.USER_AUDIT_LOG} component={UserAuditLog} />
    <ProtectedRoute exact route={WEB_ROUTES.AUDIT_TRAILS_REPORT.SYSTEM_AUDIT_LOG} component={SystemAuditLog} />
  </>
);

// * --------------------------------------------------------------
const BatchJobStatus = lazy(() => import('modules/admin/batch-job-management/batch-job-status'));
const BatchJobStatusDetail = lazy(() => import('modules/admin/batch-job-management/batch-job-status-detail'));
const BatchJobStatusDetailListing = lazy(() => import('modules/admin/batch-job-management/batch-job-status-detail-listing'));
const BatchJobManagementRoutes = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS} component={BatchJobStatus} />
    <ProtectedRoute exact route={WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS_DETAIL} component={BatchJobStatusDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS_DETAIL_LISTING} component={BatchJobStatusDetailListing} />
  </>
);

// * --------------------------------------------------------------
const EmailHistoryDetail = lazy(() => import('modules/admin/administration-configuration/email-history-detail'));
const NotificationHistoryDetail = lazy(() => import('modules/admin/administration-configuration/notification-history-detail'));
const AdminDashboardRoutes = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.DASHBOARD.EMAIL_HISTORY_DETAIL} component={EmailHistoryDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.DASHBOARD.NOTIFICATION_HISTORY_DETAIL} component={NotificationHistoryDetail} />
  </>
);

// * --------------------------------------------------------------
const WidgetByRole = lazy(() => import('modules/admin/dashboard-configuration/widget-by-role'));
const WidgetByRoleDetail = lazy(() => import('modules/admin/dashboard-configuration/widget-by-role-detail'));

const DashboardConfiguration = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.DASHBOARD_CONFIGURATION.WIDGET_BY_ROLE} component={WidgetByRole} />
    <ProtectedRoute exact route={WEB_ROUTES.DASHBOARD_CONFIGURATION.WIDGET_BY_ROLE_DETAIL} component={WidgetByRoleDetail} />
  </>
);

const AdminRoutes = () => (
  <>
    <AdministrationAndCofiguration />
    <AuthenticationAndAuthorisation />
    <AuditTrailsAndReports />
    <AdminDashboardRoutes />
    <BatchJobManagementRoutes />
    <DashboardConfiguration />
  </>
);

export default AdminRoutes;
