import React, { Suspense, lazy } from 'react';
import { connect } from 'react-redux';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { WEB_ROUTES } from 'constants/index';
import ProtectedRoute from 'components/common/protected-route';

import customHistory from './custom-history';

import SampleIdentificationRoutes from './routes/sample-identification';
import ReportRoutes from './routes/report';
import AdminRoutes from './routes/admin';
import OpsAreaRoutes from './routes/ops-area';
import NonFunctionalRoutes from './routes/non-functional';
import InspectionManagementRoutes from './routes/inspection-management';
import SitePaperGravitrapAudit from './routes/site-paper-gravitrap-audit';
import FoggingAuditRoutes from './routes/fogging-audit';
import EHIGravitrapAuditRoutes from './routes/ehi-gravitrap-audit';
import RodentAuditRoutes from './routes/rodent-audit';

const NotFound = lazy(() => import('pages/404'));
const FlashScreen = lazy(() => import('pages/flashscreen'));
const MyWorkspace = lazy(() => import('modules/my-workspace'));
const ClaimTask = lazy(() => import('modules/claim-task'));
const DetailPage = lazy(() => import('pages/detail'));
const Login = lazy(() => import('pages/login'));

// const Dashboard = lazy(() => import('pages/dashboard'));
const Dashboard = lazy(() => import('modules/dashboard'));
const Blocked = lazy(() => import('pages/blocked'));

// EPI Investigation
const EPICaseDetail = lazy(() => import('modules/epi-investigation/case-detail'));
const UploadArcGRISFile = lazy(() => import('modules/epi-investigation/upload-arcgis-file'));
const EPIReassignTask = lazy(() => import('modules/epi-investigation/reassign-tasks'));
const BulkUpdate = lazy(() => import('modules/epi-investigation/bulk-update'));

const App = (props) => {
  const { fontsize } = props;
  return (
    <Router history={customHistory}>
      <Suspense
        fallback={
          <div className="loading-ripple d-flex align-items-center justify-content-center w-100 vh-100">
            <div className="lds-ripple">
              <div />
              <div />
            </div>
          </div>
        }>
        <div className="app__main" style={{ fontSize: `${fontsize}px` }}>
          <Switch>
            <Route exact path="/" component={FlashScreen} />
            <Route exact path={WEB_ROUTES.BLOCKED.url} component={Blocked} />
            <Route exact path={WEB_ROUTES.LOGIN.url} component={Login} />
            <Route exact path={`${WEB_ROUTES.DETAILS.url}/:type`} component={DetailPage} />
            {/* <Route exact path={`${WEB_ROUTES.DETAILS.url}/:type/:id`} component={DetailPage} />
            <Route exact path={`${WEB_ROUTES.DETAILS.url}/:type/:id/:action`} component={DetailPage} /> */}
            <ProtectedRoute exact path={WEB_ROUTES.DASHBOARD.url} route={WEB_ROUTES.DASHBOARD} component={Dashboard} />
            <ProtectedRoute exact path={WEB_ROUTES.CLAIM_TASK.url} route={WEB_ROUTES.CLAIM_TASK} component={ClaimTask} />
            <ProtectedRoute exact path={WEB_ROUTES.MY_WORKSPACE.url} route={WEB_ROUTES.MY_WORKSPACE} component={MyWorkspace} />
            <SampleIdentificationRoutes path="/sample-identification/" />

            <ReportRoutes path="/report/" />

            <OpsAreaRoutes path="/ops/" />

            <SitePaperGravitrapAudit path="/site-paper-gravitrap-audit/" />

            <InspectionManagementRoutes path="/inspection-management/" />

            <FoggingAuditRoutes path="/fogging-audit/" />

            {/* EPI Investigation */}
            <Route exact path={WEB_ROUTES.EPI_INVESTIGATION.CASE_DETAIL.url} roles={WEB_ROUTES.EPI_INVESTIGATION.CASE_DETAIL.roles} component={EPICaseDetail} />
            <ProtectedRoute exact path={WEB_ROUTES.EPI_INVESTIGATION.UPLOAD_ARCGIS_FILE.url} roles={WEB_ROUTES.EPI_INVESTIGATION.UPLOAD_ARCGIS_FILE.roles} component={UploadArcGRISFile} />
            <ProtectedRoute exact path={WEB_ROUTES.EPI_INVESTIGATION.REASSIGN_TASK.url} roles={WEB_ROUTES.EPI_INVESTIGATION.REASSIGN_TASK.roles} component={EPIReassignTask} />
            <ProtectedRoute exact path={WEB_ROUTES.REPORT.BULK_UPDATE_FINDINGS.url} roles={WEB_ROUTES.REPORT.BULK_UPDATE_FINDINGS.roles} component={BulkUpdate} />

            <AdminRoutes path="/admin/" />

            <EHIGravitrapAuditRoutes path="/gravitrap-audit/" />

            <RodentAuditRoutes path="/rodent-audit/" />

            <NonFunctionalRoutes />

            {/* Others */}
            <Route component={NotFound} />
          </Switch>
        </div>
      </Suspense>
    </Router>
  );
};
const mapStateToProps = ({ global }) => ({
  fontsize: global.ui.fontSize,
  // functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App);

// export default App;
