import { getLateSubmissionService, submitForShowcauseService } from 'services/rodent-audit';
import { actionCreator, sortFunc, filterFunc, actionTryCatchCreator } from 'utils';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'fileName',
  datePickerValue: null,
  filterValue: null,
  sortValue: {
    id: 'updatedDate',
    label: 'Submitted Date',
    desc: false,
  },
};

export const RODENT_AUDIT_LATE_SUBMISSION_FILTER = 'RODENT_AUDIT_LATE_SUBMISSION_FILTER';
export const filterListAction = (filterData = defaultFilterValue) => (dispatch, getState) => {
  const {
    rodentAuditReducers: {
      queryLateSubmission: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: RODENT_AUDIT_LATE_SUBMISSION_FILTER,
    payload: filteredList,
  });
};

export const RODENT_AUDIT_LATE_SUBMISSION_LISTING = actionCreator('RODENT_AUDIT_LATE_SUBMISSION_LISTING');
export const getListAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: RODENT_AUDIT_LATE_SUBMISSION_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: RODENT_AUDIT_LATE_SUBMISSION_LISTING.SUCCESS,
      payload: data.lateSubmissionList || [],
    });
    dispatch(filterListAction());
  };
  const onError = (error) => {
    dispatch({
      type: RODENT_AUDIT_LATE_SUBMISSION_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getLateSubmissionService(), onPending, onSuccess, onError);
};

export const RODENT_AUDIT_LATE_SUBMISSION_SUBMIT_FOR_SHOWCAUSE = actionCreator('RODENT_AUDIT_LATE_SUBMISSION_SUBMIT_FOR_SHOWCAUSE');
export const submitListAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: RODENT_AUDIT_LATE_SUBMISSION_SUBMIT_FOR_SHOWCAUSE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: RODENT_AUDIT_LATE_SUBMISSION_SUBMIT_FOR_SHOWCAUSE.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: RODENT_AUDIT_LATE_SUBMISSION_SUBMIT_FOR_SHOWCAUSE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(submitForShowcauseService(params), onPending, onSuccess, onError);
};
