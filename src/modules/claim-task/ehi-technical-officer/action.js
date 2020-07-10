import { commonPoolListingService, claimTaskService } from 'services/ehi-gravitrap-audit/common';
import { actionCreator, filterFunc, sortFunc, actionTryCatchCreator } from 'utils';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'taskId',
  datePickerValue: {},
  filterValue: null,
  sortValue: {
    id: 'week',
    label: 'Eweek',
    desc: false,
    sortType: 'number',
  },
};

export const COMMON_POOL_GROUP_CLAIM = actionCreator('EHI_COMMON_POOL_GROUP_CLAIM');
export const claimTaskAction = (taskIds = [], callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: COMMON_POOL_GROUP_CLAIM.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: COMMON_POOL_GROUP_CLAIM.SUCCESS,
      payload: data,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: COMMON_POOL_GROUP_CLAIM.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(claimTaskService({ taskIds }), onPending, onSuccess, onError);
};

export const COMMON_POOL_SEARCH = actionCreator('EHI_COMMON_POOL_SEARCH');
export const commonPoolListingAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: COMMON_POOL_SEARCH.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: COMMON_POOL_SEARCH.SUCCESS,
      payload: data?.gtFindVOList || [],
    });
  };
  const onError = (error) => {
    dispatch({
      type: COMMON_POOL_SEARCH.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(commonPoolListingService(), onPending, onSuccess, onError);
};

export const COMMON_POOL_FILTER = 'COMMON_POOL_FILTER';
export const commonPoolFilter = (filterData = defaultFilterValue) => (dispatch, getState) => {
  const {
    claimTaskReducers: {
      ehiTechnicalOfficer: {
        data: { taskList },
      },
    },
  } = getState();
  const { sortValue } = filterData;

  const filteredList = taskList.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));
  dispatch({
    type: COMMON_POOL_FILTER,
    payload: filteredList,
  });
};
