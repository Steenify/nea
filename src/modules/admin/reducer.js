import { combineReducers } from 'redux';
import masterCodeMaintenance from './administration-configuration/master-code/reducer';
import masterCodeMaintenanceDetail from './administration-configuration/master-code-detail/reducer';
import holidayMaintenance from './administration-configuration/holiday/reducer';

import eWeekMaintenance from './administration-configuration/eWeek/reducer';
import eWeekListingMaintenance from './administration-configuration/eWeek-listing/reducer';

import specimenMaintenance from './administration-configuration/specimen/reducer';
import speciesCodeMaintenance from './administration-configuration/species-code/reducer';
import divisionMaintenance from './administration-configuration/division-mapping/reducer';
import productMaintenance from './administration-configuration/product/reducer';
import systemConfiguration from './administration-configuration/system-configuration/reducer';
import notificationTemplate from './administration-configuration/notification-template/reducer';
import notificationTemplateDetail from './administration-configuration/notification-template-detail/reducer';
import broadcastOnlineMessage from './administration-configuration/broadcast-online-message/reducer';
import broadcastOnlineMessageDetail from './administration-configuration/broadcast-online-message-detail/reducer';

import emailHistory from './administration-configuration/email-history-detail/reducer';
import notificationHistory from './administration-configuration/notification-history-detail/reducer';

import userApproverMapping from './administration-configuration/user-approver-mapping/reducer';

import roleFunctionMapping from './authentication-authorisation/role-function-mapping/reducer';
import roleFunctionMappingDetail from './authentication-authorisation/role-function-mapping-detail/reducer';

import userAuditLog from './audit-trails-reports/user-audit-log/reducer';
import systemAuditLog from './audit-trails-reports/system-audit-log/reducer';

import batchJobStatus from './batch-job-management/batch-job-status/reducer';
import batchJobStatusDetail from './batch-job-management/batch-job-status-detail/reducer';
import batchJobStatusDetailListing from './batch-job-management/batch-job-status-detail-listing/reducer';

import widgetByRole from './dashboard-configuration/widget-by-role/reducer';
import widgetByRoleDetail from './dashboard-configuration/widget-by-role-detail/reducer';

import lapseConfiguration from './administration-configuration/lapse-configuration/reducer';

export default combineReducers({
  masterCodeMaintenance,
  masterCodeMaintenanceDetail,
  holidayMaintenance,
  eWeekMaintenance,
  eWeekListingMaintenance,
  speciesCodeMaintenance,
  specimenMaintenance,
  productMaintenance,
  divisionMaintenance,
  systemConfiguration,
  notificationTemplate,
  notificationTemplateDetail,
  broadcastOnlineMessage,
  broadcastOnlineMessageDetail,
  roleFunctionMapping,
  roleFunctionMappingDetail,
  userAuditLog,
  systemAuditLog,
  emailHistory,
  notificationHistory,
  userApproverMapping,
  batchJobStatus,
  batchJobStatusDetail,
  batchJobStatusDetailListing,
  widgetByRole,
  widgetByRoleDetail,
  lapseConfiguration,
});
