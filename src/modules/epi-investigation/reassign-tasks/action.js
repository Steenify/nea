import { caseReassignListService, caseReassignService } from 'services/epi-investigation/case';
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

export const ASSIGN_TASK_TO_GROUP = 'ASSIGN_TASK_TO_GROUP';
export const assignTaskToGroupAction = (caseId = '', assignedGroupCode = '', assignedGroup) => (dispatch) => {
  dispatch({
    type: ASSIGN_TASK_TO_GROUP,
    payload: { caseId, assignedGroupCode, assignedGroup },
  });
};

export const REASSIGN_TASK_FILTER = 'EPI_COB1_REASSIGN_TASK_FILTER';
export const taskFilterAction = (data = defaultFilterValue) => (dispatch, getState) => {
  const {
    epiInvestigationReducers: {
      reassignTask: {
        data: { list },
      },
    },
  } = getState();
  const filteredList = list.filter((item) => filterFunc(item, data)).sort((a, b) => sortFunc(a, b, data.sortValue));

  dispatch({
    type: REASSIGN_TASK_FILTER,
    payload: filteredList,
  });
};

export const REASSIGN_LISTING = actionCreator('EPI_COB1_REASSIGN_LISTING');
export const caseReassignListAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: REASSIGN_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: REASSIGN_LISTING.SUCCESS,
      payload: data.caseManagementVOs,
    });
    dispatch(taskFilterAction());
  };
  const onError = (error) => {
    dispatch({
      type: REASSIGN_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(caseReassignListService(), onPending, onSuccess, onError);
};

export const EPI_COB1_CASE_REASSIGN = actionCreator('EPI_COB1_CASE_REASSIGN');
export const caseReassignAction = (data, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: EPI_COB1_CASE_REASSIGN.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: EPI_COB1_CASE_REASSIGN.SUCCESS,
      payload: data,
    });
    callback();
  };
  const onError = (error) => {
    dispatch({
      type: EPI_COB1_CASE_REASSIGN.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(caseReassignService(data), onPending, onSuccess, onError);
};
