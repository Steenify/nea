import React, { lazy } from 'react';
import { BrowserRouter as Route } from 'react-router-dom';
import { WEB_ROUTES } from 'constants/index';
import ProtectedRoute from 'components/common/protected-route';

const NotFound = lazy(() => import('pages/404'));

const UploadedFiles = lazy(() => import('modules/non-functional/uploaded-files'));
const CommonUpload = lazy(() => import('modules/non-functional/common-upload'));
const InappNotifications = lazy(() => import('modules/non-functional/in-app-notifications'));
const InappNotificationsDetail = lazy(() => import('modules/non-functional/in-app-notifications-detail'));

const NonFunctionalRoutes = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.NON_FUNCTIONAL.COMMON_UPLOAD} component={CommonUpload} />
    <ProtectedRoute exact route={WEB_ROUTES.NON_FUNCTIONAL.UPLOADED_FILES} component={UploadedFiles} />
    <ProtectedRoute exact route={WEB_ROUTES.NON_FUNCTIONAL.INAPP_NOTIFICATION_LIST} component={InappNotifications} />
    <ProtectedRoute exact route={WEB_ROUTES.NON_FUNCTIONAL.INAPP_NOTIFICATION_DETAIL} component={InappNotificationsDetail} />

    <Route component={NotFound} />
  </>
);

export default NonFunctionalRoutes;
