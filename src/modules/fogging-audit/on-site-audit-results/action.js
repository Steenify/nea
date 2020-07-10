import { getOnsiteAuditListingService } from 'services/fogging-audit';
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

export const FOGGING_AUDIT_ON_SITE_AUDIT_LISTING_FILTER = 'FOGGING_AUDIT_ON_SITE_AUDIT_LISTING_FILTER';
export const filterListAction = (data = defaultFilterValue) => (dispatch, getState) => {
  const {
    foggingAuditReducers: {
      onSiteAuditResults: {
        data: { list },
      },
    },
  } = getState();
  const filterData = { ...defaultFilterValue, ...data };
  const { sortValue } = filterData;
  const filteredList = list.filter(item => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: FOGGING_AUDIT_ON_SITE_AUDIT_LISTING_FILTER,
    payload: filteredList,
  });
};

export const FOGGING_AUDIT_ON_SITE_AUDIT_LISTING = actionCreator('FOGGING_AUDIT_ON_SITE_AUDIT_LISTING');
export const getListAction = params => async dispatch => {
  const onPending = () => {
    dispatch({ type: FOGGING_AUDIT_ON_SITE_AUDIT_LISTING.PENDING });
  };
  const onSuccess = data => {
    dispatch({
      type: FOGGING_AUDIT_ON_SITE_AUDIT_LISTING.SUCCESS,
      payload: data.activities || [],
    });

    dispatch(filterListAction());
  };
  const onError = error => {
    dispatch({ type: FOGGING_AUDIT_ON_SITE_AUDIT_LISTING.ERROR, payload: error });
  };

  await actionTryCatchCreator(getOnsiteAuditListingService(params), onPending, onSuccess, onError);
};
