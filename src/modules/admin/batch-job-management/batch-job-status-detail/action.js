import { searchBatchJobStatusService, createBatchJobStatusService, updateBatchJobStatusService, searchJobEndPtService } from 'services/batch-job-management/batch-job-status';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const defaultAddValue = () => ({
  batchName: '',
  cronExpression: '',
  status: false,
  remarks: '',
});

export const BATCH_JOB_STATUS_SEARCH = actionCreator('BATCH_JOB_STATUS_SEARCH');
export const searchAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: BATCH_JOB_STATUS_SEARCH.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: BATCH_JOB_STATUS_SEARCH.SUCCESS,
      payload: data.batchJobDTO,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: BATCH_JOB_STATUS_SEARCH.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(searchBatchJobStatusService(params), onPending, onSuccess, onError);
};

export const BATCH_JOB_STATUS_CREATE = actionCreator('BATCH_JOB_STATUS_CREATE');
export const createAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: BATCH_JOB_STATUS_CREATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: BATCH_JOB_STATUS_CREATE.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: BATCH_JOB_STATUS_CREATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(createBatchJobStatusService(params), onPending, onSuccess, onError);
};

export const BATCH_JOB_STATUS_UPDATE = actionCreator('BATCH_JOB_STATUS_UPDATE');
export const updateAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: BATCH_JOB_STATUS_UPDATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: BATCH_JOB_STATUS_UPDATE.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: BATCH_JOB_STATUS_UPDATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(updateBatchJobStatusService(params), onPending, onSuccess, onError);
};

export const BATCH_JOB_STATUS_SEARCH_END_POINT = actionCreator('BATCH_JOB_STATUS_SEARCH_END_POINT');
export const searchJobEndPtAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: BATCH_JOB_STATUS_SEARCH_END_POINT.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: BATCH_JOB_STATUS_SEARCH_END_POINT.SUCCESS,
      payload: data.batchJobStatusList || [],
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: BATCH_JOB_STATUS_SEARCH_END_POINT.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(searchJobEndPtService(params), onPending, onSuccess, onError);
};
