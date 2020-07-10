import { caseClaimListService, caseClaimService } from 'services/epi-investigation/case';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc, EPI_COB1_FILTER_FUNC } from 'utils';

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
  tabItem: { index: '0', func: EPI_COB1_FILTER_FUNC.OUTSIDE_CLUSTER },
};

export const EPI_COB1_CLAIM_TASK_FILTER = 'EPI_COB1_CLAIM_TASK_FILTER';
export const claimTaskFilterAction = (data = defaultFilterValue) => (dispatch, getState) => {
  const {
    claimTaskReducers: {
      epiCOB1: {
        data: { list },
      },
    },
  } = getState();
  const filteredList = list
    .filter(data.tabItem.func)
    .filter((item) => filterFunc(item, data))
    .sort((a, b) => sortFunc(a, b, data.sortValue));

  dispatch({
    type: EPI_COB1_CLAIM_TASK_FILTER,
    payload: filteredList,
  });
};

export const EPI_COB1_CLAIM_TASK = actionCreator('EPI_COB1_CLAIM_TASK');
export const claimTaskSearchAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: EPI_COB1_CLAIM_TASK.PENDING,
    });
  };
  const onSuccess = (data) => {
    const list = data?.caseManagementVOs || [];
    const tabCount = [
      EPI_COB1_FILTER_FUNC.OUTSIDE_CLUSTER,
      EPI_COB1_FILTER_FUNC.WITHOUT_ADDRESS,
      EPI_COB1_FILTER_FUNC.WITHOUT_CONTACT,
      EPI_COB1_FILTER_FUNC.WITHOUT_ADDRESS_AND_CONTACT,
      EPI_COB1_FILTER_FUNC.IN_CLUSTER,
      EPI_COB1_FILTER_FUNC.IMPORTED,
    ].map((item) => list.filter(item).length);
    dispatch({
      type: EPI_COB1_CLAIM_TASK.SUCCESS,
      payload: { list, tabCount },
    });
    dispatch(claimTaskFilterAction());
  };
  const onError = (error) => {
    dispatch({
      type: EPI_COB1_CLAIM_TASK.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(caseClaimListService(), onPending, onSuccess, onError);
};

export const EPI_COB1_CASE_CLAIM = actionCreator('EPI_COB1_CASE_CLAIM');
export const caseClaimAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: EPI_COB1_CASE_CLAIM.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: EPI_COB1_CASE_CLAIM.SUCCESS,
      payload: data,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: EPI_COB1_CASE_CLAIM.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(caseClaimService(params), onPending, onSuccess, onError);
};
