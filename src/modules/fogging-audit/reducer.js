import { combineReducers } from 'redux';

import foggingSchedule from './fogging-schedule/reducer';
import adHocFoggingAudit from './ad-hoc-listing/reducer';
import adHocFoggingAuditDetail from './ad-hoc-detail/reducer';
import onSiteAuditResults from './on-site-audit-results/reducer';
import onSiteAuditResultsDetail from './on-site-audit-results-detail/reducer';

export default combineReducers({
  foggingSchedule,
  adHocFoggingAudit,
  adHocFoggingAuditDetail,
  onSiteAuditResults,
  onSiteAuditResultsDetail,
});
