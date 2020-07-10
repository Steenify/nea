import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';
import { feedbackReportListing, uploadRodentFeedbackService } from 'services/rodent-audit';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'companyName',
  datePickerValue: null,
  filterValue: null,
  sortValue: {
    id: 'dateSubmitted',
    label: 'Date Submitted',
    desc: false,
  },
};

export const RODENT_AUDIT_FEEDBACK_INVESTIGATION_FILTER = 'RODENT_AUDIT_FEEDBACK_INVESTIGATION_FILTER';
export const filterListAction = (filterData = defaultFilterValue) => (dispatch, getState) => {
  const {
    rodentAuditReducers: {
      feedbackInvestigationReport: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: RODENT_AUDIT_FEEDBACK_INVESTIGATION_FILTER,
    payload: filteredList,
  });
};

export const FEEDBACK_REPORT_LISTING = actionCreator('FEEDBACK_REPORT_LISTING');
export const feedbackReportListingAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({ type: FEEDBACK_REPORT_LISTING.PENDING });
  };

  const onSuccess = (res) => {
    dispatch({ type: FEEDBACK_REPORT_LISTING.SUCCESS, payload: res?.feedbackReportListing || [] });

    dispatch(filterListAction());
  };

  const onError = (e) => {
    dispatch({ type: FEEDBACK_REPORT_LISTING.ERROR, payload: e });
  };
  await actionTryCatchCreator(feedbackReportListing(), onPending, onSuccess, onError);
};

export const UPLOAD_RODENT_FEEDBACK = actionCreator('UPLOAD_RODENT_FEEDBACK');
export const uploadRodentFeedbackAction = (data, callback) => async (dispatch) => {
  const { PENDING, SUCCESS, ERROR } = UPLOAD_RODENT_FEEDBACK;

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
  await actionTryCatchCreator(uploadRodentFeedbackService(data), onPending, onSuccess, onError);
};
