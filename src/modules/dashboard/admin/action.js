import { getAmountEmailSentService, viewApplicationStatusService, getAmtOfNotificationSentService } from 'services/non-functional';
import { viewBatchJobStatusService } from 'services/batch-job-management/batch-job-status';
import { getServiceStatusService, getPerformanceMetricsService } from 'services/dashboard';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const ADMIN_DASHBOARD_AMOUNT_EMAIL_SENT = actionCreator('ADMIN_DASHBOARD_AMOUNT_EMAIL_SENT');
export const getAmountEmailSentAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: ADMIN_DASHBOARD_AMOUNT_EMAIL_SENT.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: ADMIN_DASHBOARD_AMOUNT_EMAIL_SENT.SUCCESS,
      payload: data,
    });
  };
  const onError = (error) => {
    dispatch({
      type: ADMIN_DASHBOARD_AMOUNT_EMAIL_SENT.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getAmountEmailSentService(params), onPending, onSuccess, onError);
};

export const ADMIN_DASHBOARD_AMOUNT_NOTIFICATION_SENT = actionCreator('ADMIN_DASHBOARD_AMOUNT_NOTIFICATION_SENT');
export const getAmtOfNotificationSentAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: ADMIN_DASHBOARD_AMOUNT_NOTIFICATION_SENT.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: ADMIN_DASHBOARD_AMOUNT_NOTIFICATION_SENT.SUCCESS,
      payload: data,
    });
  };
  const onError = (error) => {
    dispatch({
      type: ADMIN_DASHBOARD_AMOUNT_NOTIFICATION_SENT.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getAmtOfNotificationSentService(params), onPending, onSuccess, onError);
};

export const ADMIN_DASHBOARD_APPLICATION_STATUS = actionCreator('ADMIN_DASHBOARD_APPLICATION_STATUS');
export const viewApplicationStatusAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: ADMIN_DASHBOARD_APPLICATION_STATUS.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: ADMIN_DASHBOARD_APPLICATION_STATUS.SUCCESS,
      payload: data.applicationStatusVoList || [],
    });
  };
  const onError = (error) => {
    dispatch({
      type: ADMIN_DASHBOARD_APPLICATION_STATUS.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(viewApplicationStatusService(params), onPending, onSuccess, onError);
};

export const ADMIN_DASHBOARD_BATCH_JOB_STATUS = actionCreator('ADMIN_DASHBOARD_BATCH_JOB_STATUS');
export const viewBatchJobStatusAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: ADMIN_DASHBOARD_BATCH_JOB_STATUS.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: ADMIN_DASHBOARD_BATCH_JOB_STATUS.SUCCESS,
      payload: data.batchJobStatusList || [],
    });
  };
  const onError = (error) => {
    dispatch({
      type: ADMIN_DASHBOARD_BATCH_JOB_STATUS.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(viewBatchJobStatusService(params), onPending, onSuccess, onError);
};

export const ADMIN_DASHBOARD_SERVICE_STATUS = actionCreator('ADMIN_DASHBOARD_SERVICE_STATUS');
export const getServiceStatusAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: ADMIN_DASHBOARD_SERVICE_STATUS.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: ADMIN_DASHBOARD_SERVICE_STATUS.SUCCESS,
      payload: data.results || [],
    });
  };
  const onError = (error) => {
    dispatch({
      type: ADMIN_DASHBOARD_SERVICE_STATUS.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getServiceStatusService(), onPending, onSuccess, onError);
};

export const ADMIN_DASHBOARD_PERFORMANCE_METRICS = actionCreator('ADMIN_DASHBOARD_PERFORMANCE_METRICS');
export const getPerformanceMetricsAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: ADMIN_DASHBOARD_PERFORMANCE_METRICS.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: ADMIN_DASHBOARD_PERFORMANCE_METRICS.SUCCESS,
      payload: data.results || [],
    });
  };
  const onError = (error) => {
    dispatch({
      type: ADMIN_DASHBOARD_PERFORMANCE_METRICS.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getPerformanceMetricsService(), onPending, onSuccess, onError);
};
