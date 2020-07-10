import { getAuditTaskService } from 'services/rodent-audit';
import { actionCreator, sortFunc, filterFunc, actionTryCatchCreator } from 'utils';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'taskID',
  datePickerValue: null,
  filterValue: null,
  sortValue: {
    id: 'taskID',
    label: 'Task ID',
    desc: false,
  },
};

export const FILTER_AUDIT_TASK = 'FILTER_AUDIT_TASK';
export const filterAuditTaskAction = filterData => (dispatch, getState) => {
  const {
    rodentAuditReducers: {
      queryAuditTask: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter(item => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: FILTER_AUDIT_TASK,
    payload: filteredList,
  });
};

export const GET_AUDIT_TASK_LIST = actionCreator('GET_AUDIT_TASK_LIST');
export const getAuditTaskListAction = () => async dispatch => {
  const onPending = () => {
    dispatch({
      type: GET_AUDIT_TASK_LIST.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: GET_AUDIT_TASK_LIST.SUCCESS,
      payload: data.dailyReportList || [],
    });
    dispatch(filterAuditTaskAction(defaultFilterValue));
  };
  const onError = error => {
    dispatch({
      type: GET_AUDIT_TASK_LIST.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getAuditTaskService(), onPending, onSuccess, onError);
};
