import { combineReducers } from 'redux';

import areaCluster from './area-cluster/reducer';
import createAdhocOperation from './create-new-operation/reducer';
import operationDetail from './operation-detail/reducer';
import linkToExistingOps from './link-to-existing-ops/reducer';
import addressListInOps from './address-list-in-ops/reducer';
import additionalInfo from './additional-info/reducer';

export default combineReducers({
  areaCluster,
  createAdhocOperation,
  operationDetail,
  linkToExistingOps,
  addressListInOps,
  additionalInfo,
});
