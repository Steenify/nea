import { combineReducers } from 'redux';

import inAppNotificationDetail from './in-app-notifications-detail/reducer';
import uploadedFiles from './uploaded-files/reducer';
import commonUpload from './common-upload/reducer';

export default combineReducers({
  inAppNotificationDetail,
  uploadedFiles,
  commonUpload,
});
