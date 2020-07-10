import { getOnsiteAuditDetailService, submitOnsiteAuditScheduleMatchingService } from 'services/fogging-audit';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

export const defaultFilterValue = {
  sortValue: {
    id: 'foggingDate',
    label: 'Fogging Date',
    desc: false,
  },
  filterValue: null,
  datePickerValue: null,
  searchText: '',
  searchType: 'inspectionId',
};

export const FOGGING_AUDIT_ON_SITE_AUDIT_DETAIL = actionCreator('FOGGING_AUDIT_ON_SITE_AUDIT_DETAIL');
export const getDetailAction = (params, callback) => async dispatch => {
  const onPending = () => {
    dispatch({ type: FOGGING_AUDIT_ON_SITE_AUDIT_DETAIL.PENDING });
  };
  const onSuccess = data => {
    dispatch({
      type: FOGGING_AUDIT_ON_SITE_AUDIT_DETAIL.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = error => {
    dispatch({ type: FOGGING_AUDIT_ON_SITE_AUDIT_DETAIL.ERROR, payload: error });
  };

  await actionTryCatchCreator(getOnsiteAuditDetailService(params), onPending, onSuccess, onError);
};

export const FOGGING_AUDIT_ON_SITE_AUDIT_SUMIT_MATCHING_SCHEDULE = actionCreator(
  'FOGGING_AUDIT_ON_SITE_AUDIT_SUMIT_MATCHING_SCHEDULE',
);
export const submitOnsiteAuditScheduleMatchingAction = (params, callback) => async dispatch => {
  const onPending = () => {
    dispatch({ type: FOGGING_AUDIT_ON_SITE_AUDIT_SUMIT_MATCHING_SCHEDULE.PENDING });
  };
  const onSuccess = data => {
    dispatch({
      type: FOGGING_AUDIT_ON_SITE_AUDIT_SUMIT_MATCHING_SCHEDULE.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = error => {
    dispatch({ type: FOGGING_AUDIT_ON_SITE_AUDIT_SUMIT_MATCHING_SCHEDULE.ERROR, payload: error });
  };

  await actionTryCatchCreator(submitOnsiteAuditScheduleMatchingService(params), onPending, onSuccess, onError);
};

export const FOGGING_AUDIT_ON_SITE_AUDIT_DETAIL_FILTER = 'FOGGING_AUDIT_ON_SITE_AUDIT_DETAIL_FILTER';
export const filterListAction = (data = defaultFilterValue) => (dispatch, getState) => {
  const {
    foggingAuditReducers: {
      onSiteAuditResultsDetail: {
        data: { list, matchingAuditTask },
      },
    },
  } = getState();
  const filterData = { ...defaultFilterValue, ...data };
  const { sortValue } = filterData;
  const filteredList = list.filter(item => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: FOGGING_AUDIT_ON_SITE_AUDIT_DETAIL_FILTER,
    payload: [matchingAuditTask, ...filteredList],
  });
};

// export const FOGGING_AUDIT_ON_SITE_AUDIT_LISTING = actionCreator('FOGGING_AUDIT_ON_SITE_AUDIT_LISTING');
// export const getListAction = params => async dispatch => {
//   const onPending = () => {
//     dispatch({ type: FOGGING_AUDIT_ON_SITE_AUDIT_LISTING.PENDING });
//   };
//   const onSuccess = data => {
//     dispatch({
//       type: FOGGING_AUDIT_ON_SITE_AUDIT_LISTING.SUCCESS,
//       payload: data.activities || [],
//     });

//     dispatch(filterListAction());
//   };
//   const onError = error => {
//     dispatch({ type: FOGGING_AUDIT_ON_SITE_AUDIT_LISTING.ERROR, payload: error });
//   };

//   await actionTryCatchCreator(getOnsiteAuditListingService(params), onPending, onSuccess, onError);
// };
