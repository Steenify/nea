import { adHocDetailService, submitAdhocFoggingAuditService } from 'services/fogging-audit';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

export const upcomingDefaultFilterValue = {
  sortValue: {
    id: 'foggingDate',
    label: 'Fogging Date',
    desc: false,
  },
  filterValue: null,
  datePickerValue: null,
  searchText: '',
  searchType: 'address',
};

export const pastDefaultFilterValue = {
  sortValue: {
    id: 'foggingDate',
    label: 'Fogging Date',
    desc: true,
  },
  filterValue: null,
  datePickerValue: null,
  searchText: '',
  searchType: 'address',
};

export const FOGGING_AUDIT_AD_HOC_DETAIL_UPCOMING_FILTER = 'FOGGING_AUDIT_AD_HOC_DETAIL_UPCOMING_FILTER';
export const upcomingListFilterAction = (data = upcomingDefaultFilterValue) => (dispatch, getState) => {
  const {
    foggingAuditReducers: {
      adHocFoggingAuditDetail: {
        data: { upcomingList },
      },
    },
  } = getState();
  const filteredList = upcomingList.filter((item) => filterFunc(item, data)).sort((a, b) => sortFunc(a, b, data.sortValue));

  dispatch({
    type: FOGGING_AUDIT_AD_HOC_DETAIL_UPCOMING_FILTER,
    payload: filteredList,
  });
};

export const FOGGING_AUDIT_AD_HOC_DETAIL_PAST_FILTER = 'FOGGING_AUDIT_AD_HOC_DETAIL_PAST_FILTER';
export const pastListFilterAction = (data = pastDefaultFilterValue) => (dispatch, getState) => {
  const {
    foggingAuditReducers: {
      adHocFoggingAuditDetail: {
        data: { pastList },
      },
    },
  } = getState();
  const filteredList = pastList.filter((item) => filterFunc(item, data)).sort((a, b) => sortFunc(a, b, data.sortValue));

  dispatch({
    type: FOGGING_AUDIT_AD_HOC_DETAIL_PAST_FILTER,
    payload: filteredList,
  });
};

export const FOGGING_AUDIT_AD_HOC_DETAIL = actionCreator('FOGGING_AUDIT_AD_HOC_DETAIL');
export const adHocFoggingAuditSearchAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: FOGGING_AUDIT_AD_HOC_DETAIL.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: FOGGING_AUDIT_AD_HOC_DETAIL.SUCCESS,
      payload: data,
    });
    dispatch(upcomingListFilterAction());
    dispatch(pastListFilterAction());
  };
  const onError = (error) => {
    dispatch({
      type: FOGGING_AUDIT_AD_HOC_DETAIL.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(adHocDetailService(params), onPending, onSuccess, onError);
};

export const FOGGING_AUDIT_AD_HOC_DETAIL_UPCOMING_SUBMIT = actionCreator('FOGGING_AUDIT_AD_HOC_DETAIL_UPCOMING_SUBMIT');
export const submitAdhocFoggingAuditAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: FOGGING_AUDIT_AD_HOC_DETAIL_UPCOMING_SUBMIT.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: FOGGING_AUDIT_AD_HOC_DETAIL_UPCOMING_SUBMIT.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: FOGGING_AUDIT_AD_HOC_DETAIL_UPCOMING_SUBMIT.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(submitAdhocFoggingAuditService(params), onPending, onSuccess, onError);
};
