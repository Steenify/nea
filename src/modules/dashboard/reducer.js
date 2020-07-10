import { combineReducers } from 'redux';

import adminDashboard from './admin/reducer';
import userDashboard from './user/reducer';

export default combineReducers({
  adminDashboard,
  userDashboard,
});
