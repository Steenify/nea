import { workingSpaceListingService, rejectAssessmentService, supportAssessmentService } from 'services/ehi-gravitrap-audit/common';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc, monthIntToString } from 'utils';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'taskId',
  datePickerValue: {},
  filterValue: null,
  sortValue: {
    id: 'taskId',
    label: 'Task ID',
    desc: false,
  },
  filterNext: null,
};

export const FILTER_ACTION = 'EHI_TO_WORKSPACE_FILTER';
export const filterAction = (filterData = defaultFilterValue) => (dispatch, getState) => {
  const {
    myWorkspaceReducers: {
      ehiTechnicalOfficer: {
        data: { list },
      },
    },
  } = getState();
  const filteredList = list
    .filter((item) => filterFunc(item, filterData))
    .filter((item) => (filterData?.filterNext ? filterData.filterNext(item) : true))
    .sort((a, b) => sortFunc(a, b, filterData.sortValue));

  dispatch({
    type: FILTER_ACTION,
    payload: filteredList,
  });
};

export const LISTING_ACTION = actionCreator('EHI_TO_WORKSPACE_LISTING');
export const listAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: LISTING_ACTION.PENDING,
    });
  };
  const onSuccess = (data) => {
    const list = data?.claimedTasksList || [];

    dispatch({
      type: LISTING_ACTION.SUCCESS,
      payload: list.map((item) => {
        const month = item?.month || '';
        const monthInt = Number(month) || 0;
        const mappedMonth = monthIntToString(monthInt - 1);
        return { ...item, mappedMonth };
      }),
    });
    dispatch(filterAction());
  };
  const onError = (error) => {
    dispatch({
      type: LISTING_ACTION.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(workingSpaceListingService(), onPending, onSuccess, onError);
};

export const REJECT = actionCreator('EHI_WORKSPACE_REJECT_ASSESSMENT');
export const rejectAction = (params = { taskIds: [], rejectionRemark: '' }, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: REJECT.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: REJECT.SUCCESS,
    });
    dispatch(listAction());
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: REJECT.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(rejectAssessmentService(params), onPending, onSuccess, onError);
};

export const SUPPORT = actionCreator('EHI_WORKSPACE_SUPPORT_ASSESSMENT');
export const supportAction = (taskIds = [], callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SUPPORT.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SUPPORT.SUCCESS,
    });
    dispatch(listAction());
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: SUPPORT.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(supportAssessmentService({ taskIds }), onPending, onSuccess, onError);
};
