import { viewBatchJobStatusDetailListingService } from 'services/batch-job-management/batch-job-status';
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

export const BATCH_JOB_STATUS_FILTER_DETAIL_LISTING = 'BATCH_JOB_STATUS_FILTER_DETAIL_LISTING';
export const filterListingAction = (data = defaultFilterValue) => (dispatch, getState) => {
  const {
    adminReducers: {
      batchJobStatusDetailListing: {
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
    type: BATCH_JOB_STATUS_FILTER_DETAIL_LISTING,
    payload: [...addedList, ...oldList],
  });
};

export const BATCH_JOB_STATUS_DETAIL_LISTING = actionCreator('BATCH_JOB_STATUS_DETAIL_LISTING');
export const getListingAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: BATCH_JOB_STATUS_DETAIL_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: BATCH_JOB_STATUS_DETAIL_LISTING.SUCCESS,
      payload: data.batchJobStatusList || [],
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: BATCH_JOB_STATUS_DETAIL_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(viewBatchJobStatusDetailListingService(params), onPending, onSuccess, onError);
};
