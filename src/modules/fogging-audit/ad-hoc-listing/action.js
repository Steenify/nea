import { adHocFoggingAuditService } from 'services/fogging-audit';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

export const defaultFilterValue = {
  sortValue: {
    id: 'lastAuditDate',
    label: 'Last Audit Date',
    desc: false,
  },
  filterValue: null,
  datePickerValue: null,
  searchText: '',
  searchType: 'companyUen',
};

export const FOGGING_AUDIT_AD_HOC_FILTER = 'FOGGING_AUDIT_AD_HOC_FILTER';
export const listFilterAction = (data = defaultFilterValue) => (dispatch, getState) => {
  const {
    foggingAuditReducers: {
      adHocFoggingAudit: {
        data: { list },
      },
    },
  } = getState();
  const filteredList = list.filter((item) => filterFunc(item, data)).sort((a, b) => sortFunc(a, b, data.sortValue));

  dispatch({
    type: FOGGING_AUDIT_AD_HOC_FILTER,
    payload: filteredList,
  });
};

export const FOGGING_AUDIT_AD_HOC = actionCreator('FOGGING_AUDIT_AD_HOC');
export const adHocFoggingAuditSearchAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: FOGGING_AUDIT_AD_HOC.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: FOGGING_AUDIT_AD_HOC.SUCCESS,
      payload: data.adhocFoggingListing,
    });
    dispatch(listFilterAction());
  };
  const onError = (error) => {
    dispatch({
      type: FOGGING_AUDIT_AD_HOC.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(adHocFoggingAuditService(), onPending, onSuccess, onError);
};
