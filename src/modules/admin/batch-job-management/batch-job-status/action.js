import { viewBatchJobStatusService, deleteBatchJobStatusService, terminateBatchJobStatusService, triggerBatchJobStatusService } from 'services/batch-job-management/batch-job-status';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

export const defaultFilterValue = {
  sortValue: {
    id: 'jobName',
    label: 'Job Name',
    desc: false,
  },
  filterValue: null,
  datePickerValue: null,
  searchText: '',
  searchType: 'jobName',
};

export const BATCH_JOB_STATUS_FILTER_LISTING = 'BATCH_JOB_STATUS_FILTER_LISTING';
export const filterListingAction = (data = defaultFilterValue) => (dispatch, getState) => {
  const {
    adminReducers: {
      batchJobStatus: {
        data: { editingList },
      },
    },
  } = getState();
  const addedList = editingList
    .filter((item) => item.action === 'add')
    .filter((item) => filterFunc(item, data))
    .sort((a, b) => sortFunc(a, b, data.sortValue));
  const oldList = editingList
    .filter((item) => item.action !== 'add')
    .filter((item) => filterFunc(item, data))
    .sort((a, b) => sortFunc(a, b, data.sortValue));

  dispatch({
    type: BATCH_JOB_STATUS_FILTER_LISTING,
    payload: [...addedList, ...oldList],
  });
};

export const BATCH_JOB_STATUS_LISTING = actionCreator('BATCH_JOB_STATUS_LISTING');
export const getListingAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: BATCH_JOB_STATUS_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: BATCH_JOB_STATUS_LISTING.SUCCESS,
      payload: data.batchJobStatusList || [],
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: BATCH_JOB_STATUS_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(viewBatchJobStatusService(), onPending, onSuccess, onError);
};

export const BATCH_JOB_STATUS_DELETE = actionCreator('BATCH_JOB_STATUS_DELETE');
export const deleteAction = ({ id }) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: BATCH_JOB_STATUS_DELETE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: BATCH_JOB_STATUS_DELETE.SUCCESS,
      payload: id,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: BATCH_JOB_STATUS_DELETE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(deleteBatchJobStatusService({ id }), onPending, onSuccess, onError);
};

export const BATCH_JOB_STATUS_TERMINATE = actionCreator('BATCH_JOB_STATUS_TERMINATE');
export const terminateAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: BATCH_JOB_STATUS_TERMINATE.PENDING,
    });
  };
  const onSuccess = () => {
    dispatch({
      type: BATCH_JOB_STATUS_TERMINATE.SUCCESS,
      payload: params.batchId,
    });
    if (callback) callback();
    dispatch(getListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: BATCH_JOB_STATUS_TERMINATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(terminateBatchJobStatusService(params), onPending, onSuccess, onError);
};

export const BATCH_JOB_STATUS_TRIGGER = actionCreator('BATCH_JOB_STATUS_TRIGGER');
export const triggerAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: BATCH_JOB_STATUS_TRIGGER.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: BATCH_JOB_STATUS_TRIGGER.SUCCESS,
      payload: data,
    });
    if (callback) callback();
    dispatch(getListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: BATCH_JOB_STATUS_TRIGGER.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(triggerBatchJobStatusService(params), onPending, onSuccess, onError);
};
