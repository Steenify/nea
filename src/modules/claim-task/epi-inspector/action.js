import { caseClaimListService, caseClaimService } from 'services/epi-investigation/case';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

export const defaultFilterValue = {
  sortValue: {
    id: 'residentialAddress',
    label: 'Residential Address',
    desc: false,
  },
  filterValue: null,
  datePickerValue: null,
  searchText: '',
  searchType: 'clusterId',
};

export const EPI_INSPECTOR_CLAIM_TASK_FILTER = 'EPI_INSPECTOR_CLAIM_TASK_FILTER';
export const claimTaskFilterAction = (data = defaultFilterValue) => (dispatch, getState) => {
  const {
    claimTaskReducers: {
      epiInspector: {
        data: { list },
      },
    },
  } = getState();
  const filteredList = list.filter((item) => filterFunc(item, data)).sort((a, b) => sortFunc(a, b, data.sortValue));

  dispatch({
    type: EPI_INSPECTOR_CLAIM_TASK_FILTER,
    payload: filteredList,
  });
};

export const EPI_INSPECTOR_CLAIM_TASK = actionCreator('EPI_INSPECTOR_CLAIM_TASK');
export const claimTaskSearchAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: EPI_INSPECTOR_CLAIM_TASK.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: EPI_INSPECTOR_CLAIM_TASK.SUCCESS,
      payload: data.caseManagementVOs,
    });
    dispatch(claimTaskFilterAction());
  };
  const onError = (error) => {
    dispatch({
      type: EPI_INSPECTOR_CLAIM_TASK.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(caseClaimListService(), onPending, onSuccess, onError);
};

export const EPI_INSPECTOR_CASE_CLAIM = actionCreator('EPI_INSPECTOR_CASE_CLAIM');
export const caseClaimAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: EPI_INSPECTOR_CASE_CLAIM.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: EPI_INSPECTOR_CASE_CLAIM.SUCCESS,
      payload: data,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: EPI_INSPECTOR_CASE_CLAIM.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(caseClaimService(params), onPending, onSuccess, onError);
};
