import { combineReducers } from 'redux';

import caseDetail from './case-detail/reducer';
import reassignTask from './reassign-tasks/reducer';
import bulkFindings from './bulk-update/reducer';
import uploadFile from './upload-arcgis-file/reducer';

export default combineReducers({
  caseDetail,
  reassignTask,
  bulkFindings,
  uploadFile,
});
