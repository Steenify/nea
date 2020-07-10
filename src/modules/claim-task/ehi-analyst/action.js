import { getListTasksClaim, claimSampleService } from 'services/sample-identification';
import { actionCreator, sortFunc, actionTryCatchCreator, filterFunc } from 'utils';

export const defaultFilterValue = {
  sortValue: {
    id: 'breedingDetectionDate',
    label: 'Breeding Detection Date',
    desc: false,
  },
  region: '',
  searchType: 'barcodeId',
  searchText: '',
  datePickerValue: null,
  filterValue: null,
};

export const SAMPLE_TASK_FILTER = 'SAMPLE_TASK_FILTER';
export const sampleTaskFilter = (data) => (dispatch, getState) => {
  const {
    claimTaskReducers: {
      ehiAnalyst: {
        data: { taskList },
      },
    },
  } = getState();
  const filterData = { ...defaultFilterValue, ...data };
  const { region, sortValue } = filterData;
  const regionList = taskList.filter((item) => region === '' || item.regionOfficeCode === region);
  const urgentList = regionList.filter((item) => item.isUrgentCase).sort((a, b) => sortFunc(a, b, sortValue));

  const lateList = regionList.filter((item) => !item.isUrgentCase && item.isPrioritized).sort((a, b) => sortFunc(a, b, sortValue));

  const normalList = regionList.filter((item) => !item.isUrgentCase && !item.isPrioritized).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: SAMPLE_TASK_FILTER,
    payload: [...urgentList, ...lateList, ...normalList].filter((item) => filterFunc(item, filterData)),
  });
};

export const SAMPLE_TASK_SEARCH = actionCreator('SAMPLE_TASK_SEARCH');
export const sampleTaskSearch = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SAMPLE_TASK_SEARCH.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SAMPLE_TASK_SEARCH.SUCCESS,
      payload: data.claimTaskVOs,
    });
    dispatch(sampleTaskFilter(defaultFilterValue));
  };
  const onError = (error) => {
    dispatch({
      type: SAMPLE_TASK_SEARCH.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getListTasksClaim(), onPending, onSuccess, onError);
};

export const CLAIM_SAMPLE = actionCreator('CLAIM_SAMPLE');
export const claimSampleAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: CLAIM_SAMPLE.PENDING,
    });
  };
  const onSuccess = () => {
    dispatch({
      type: CLAIM_SAMPLE.SUCCESS,
    });
  };
  const onError = (error) => {
    dispatch({
      type: CLAIM_SAMPLE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(claimSampleService(params), onPending, onSuccess, onError);
};

export const RESET_CLAIM_TASK_REDUCER = 'RESET_CLAIM_TASK_REDUCER';
export const resetClaimTaskReducer = () => (dispatch) => {
  dispatch({
    type: RESET_CLAIM_TASK_REDUCER,
  });
};
