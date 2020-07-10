/* eslint-disable operator-linebreak */
import moment from 'moment';
import { querySampleInspectionListingService } from 'services/sample-identification';
import { actionCreator, sortFunc, filterFunc, actionTryCatchCreator } from 'utils';
import { DateRangePickerSelectMode } from 'components/common/dateRangPickerSelect';

export const defaultFilterValue = {
  sortValue: {
    id: 'breedingDetectionDate',
    label: 'Breeding Detection Date',
    desc: false,
  },
  filterValue: null,
  datePickerValue: {
    selectedValue: 'breedingDetectionDate',
    startDate: moment().subtract(30, 'days').startOf('day'),
    endDate: moment().endOf('day'),
    mode: DateRangePickerSelectMode.custom,
  },
  searchText: '',
  searchType: 'address',
};

export const FORM_QUERY_STATUS_FILTER = 'FORM_QUERY_STATUS_FILTER';
export const formQueryStatusFilter = (filterData) => (dispatch, getState) => {
  const {
    sampleIdentificationReducers: {
      queryInspectionFormStatus: {
        data: { taskList },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = taskList.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: FORM_QUERY_STATUS_FILTER,
    payload: filteredList,
  });
};

export const FORM_QUERY_STATUS_SEARCH = actionCreator('FORM_QUERY_STATUS_SEARCH');
export const formQueryStatusSearch = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: FORM_QUERY_STATUS_SEARCH.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: FORM_QUERY_STATUS_SEARCH.SUCCESS,
      payload: data.inspections,
    });
    dispatch(formQueryStatusFilter(defaultFilterValue));
  };
  const onError = (error) => {
    dispatch({
      type: FORM_QUERY_STATUS_SEARCH.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(querySampleInspectionListingService(params), onPending, onSuccess, onError);
};
