import { combineReducers } from 'redux';

import inAppNotificationDetail from './in-app-notifications-detail/reducer';
import commonUpload from './common-upload/reducer';

export default combineReducers({
  inAppNotificationDetail,
  commonUpload,
});
