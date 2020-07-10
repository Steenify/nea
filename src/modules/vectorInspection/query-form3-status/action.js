import { form3QueryListingService } from 'services/inspection-management/form3';
import { actionCreator, sortFunc, filterFunc, actionTryCatchCreator } from 'utils';
import moment from 'moment';

export const defaultFilterValue = {
  sortValue: {
    id: 'address',
    label: 'Address',
    desc: true,
  },
  datePickerValue: {
    startDate: moment()
      .subtract(30, 'days')
      .startOf('day'),
    endDate: moment().endOf('day'),
  },
  searchText: '',
  searchType: 'form3Id',
};

export const FORM3_QUERY_LISTING_FILTER = 'FORM3_QUERY_LISTING_FILTER';
export const queryForm3StatusFilterAction = (filterData = defaultFilterValue) => (dispatch, getState) => {
  const {
    vectorInspectionReducers: {
      queryForm3Status: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: FORM3_QUERY_LISTING_FILTER,
    payload: filteredList,
  });
};

export const FORM3_QUERY_LISTING = actionCreator('FORM3_QUERY_LISTING');
export const getQueryForm3StatusAction = (data) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: FORM3_QUERY_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: FORM3_QUERY_LISTING.SUCCESS,
      payload: data.queryForm3VOs,
    });
    dispatch(queryForm3StatusFilterAction());
  };
  const onError = (error) => {
    dispatch({
      type: FORM3_QUERY_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(form3QueryListingService(data), onPending, onSuccess, onError);
};
