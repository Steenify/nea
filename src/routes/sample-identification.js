import React, { lazy } from 'react';
import { WEB_ROUTES } from 'constants/index';
import ProtectedRoute from 'components/common/protected-route';

const QuerySampleStatus = lazy(() => import('modules/sample-identification/query-sample-status'));
const QueryInspectionFormStatus = lazy(() => import('modules/sample-identification/query-inspection-form-status'));
const ReceiveSample = lazy(() => import('modules/sample-identification/receive-sample'));
const SampleKPIMonthly = lazy(() => import('modules/sample-identification/query-sample-kpi-monthly'));
const SampleKPIMonthlyDetail = lazy(() => import('modules/sample-identification/query-sample-kpi-monthly/detail'));

const SampleIdentificationRoutes = () => (
  <>
    <ProtectedRoute exact route={WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_STATUS} component={QuerySampleStatus} />
    <ProtectedRoute
      exact
      route={WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_INSPECTION_FORM_STATUS}
      component={QueryInspectionFormStatus}
    />
    <ProtectedRoute exact route={WEB_ROUTES.SAMPLE_IDENTIFICATION.RECEIVE_SAMPLE} component={ReceiveSample} />
    <ProtectedRoute
      exact
      route={WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_KPI_MONTHLY}
      component={SampleKPIMonthly}
    />
    <ProtectedRoute
      exact
      route={WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_KPI_MONTHLY_DETAIL}
      component={SampleKPIMonthlyDetail}
    />
  </>
);

export default SampleIdentificationRoutes;
