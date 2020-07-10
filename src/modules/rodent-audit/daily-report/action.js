import { actionCreator, filterFunc, sortFunc, actionTryCatchCreator } from 'utils';
import { dailyReportListingService, uploadDailyReportService } from 'services/rodent-audit';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'ro',
  datePickerValue: null,
  filterValue: null,
  sortValue: {
    id: 'surveyDate',
    label: 'Date of Survey',
    desc: false,
  },
};

export const RODENT_AUDIT_DAILY_REPORT_FILTER = 'RODENT_AUDIT_DAILY_REPORT_FILTER';
export const filterListAction = (filterData = defaultFilterValue) => (dispatch, getState) => {
  const {
    rodentAuditReducers: {
      dailyReport: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: RODENT_AUDIT_DAILY_REPORT_FILTER,
    payload: filteredList,
  });
};

export const DAILY_REPORT_LISTING = actionCreator('DAILY_REPORT_LISTING');
export const dailyReportListingAction = () => async (dispatch) => {
  const { PENDING, SUCCESS, ERROR } = DAILY_REPORT_LISTING;

  const onPending = () => {
    dispatch({ type: PENDING });
  };
  const onSuccess = (res) => {
    dispatch({ type: SUCCESS, payload: res?.dailyReportListing || [] });

    dispatch(filterListAction());
  };
  const onError = (e) => {
    dispatch({ type: ERROR, payload: e });
  };
  await actionTryCatchCreator(dailyReportListingService(), onPending, onSuccess, onError);
};

export const UPLOAD_DAILY_REPORT = actionCreator('UPLOAD_DAILY_REPORT');
export const uploadDailyReportAction = (data, callback) => async (dispatch) => {
  const { PENDING, SUCCESS, ERROR } = UPLOAD_DAILY_REPORT;

  const onPending = () => {
    dispatch({ type: PENDING });
  };
  const onSuccess = () => {
    dispatch({ type: SUCCESS });

    if (callback) callback(null);
  };
  const onError = (e) => {
    dispatch({ type: ERROR, payload: e });

    if (callback) callback(e);
  };
  await actionTryCatchCreator(uploadDailyReportService(data), onPending, onSuccess, onError);
};
