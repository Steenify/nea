import React, { lazy } from 'react';
import { WEB_ROUTES } from 'constants/index';
import ProtectedRoute from 'components/common/protected-route';

const AreaCluster = lazy(() => import('modules/ops-management/area-cluster'));
const OperationDetail = lazy(() => import('modules/ops-management/operation-detail'));
const CreateAdhocOperation = lazy(() => import('modules/ops-management/create-new-operation'));
const LinkToExistingOps = lazy(() => import('modules/ops-management/link-to-existing-ops'));
const AddressListInOps = lazy(() => import('modules/ops-management/address-list-in-ops'));
const AdditionalInfo = lazy(() => import('modules/ops-management/additional-info'));

const OpsAreaRoutes = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.OPS_AREA.LANDING_PAGE} component={AreaCluster} />
    <ProtectedRoute exact route={WEB_ROUTES.OPS_AREA.CREATE_OPERATION} component={CreateAdhocOperation} />
    <ProtectedRoute exact route={WEB_ROUTES.OPS_AREA.OPERATION_DETAIL} component={OperationDetail} />
    <ProtectedRoute exact route={WEB_ROUTES.OPS_AREA.LINK_TO_EXISTING_OPS} component={LinkToExistingOps} />
    <ProtectedRoute exact route={WEB_ROUTES.OPS_AREA.ADDRESS_LIST_IN_OPS} component={AddressListInOps} />
    <ProtectedRoute exact route={WEB_ROUTES.OPS_AREA.ADDITIONAL_INFO} component={AdditionalInfo} />
  </>
);

export default OpsAreaRoutes;
