import { getQueriesStatus } from 'services/sample-identification';
import { actionCreator, sortFunc, filterFunc, actionTryCatchCreator } from 'utils';
import moment from 'moment';
import { DateRangePickerSelectMode } from 'components/common/dateRangPickerSelect';

export const defaultFilterValue = {
  sortValue: {
    id: 'breedingDetectionDate',
    label: 'Breeding Detection Date',
    desc: false,
  },
  filterValue: null,
  datePickerValue: {
    selectedValue: 'breedingDate',
    startDate: moment().subtract(30, 'days').startOf('day'),
    endDate: moment().endOf('day'),
    mode: DateRangePickerSelectMode.custom,
  },
  searchText: '',
  searchType: 'sampleId',
};

export const SAMPLE_QUERY_STATUS_FILTER = 'SAMPLE_QUERY_STATUS_FILTER';
export const sampleQueryStatusFilter = (filterData) => (dispatch, getState) => {
  const {
    sampleIdentificationReducers: {
      querySampleStatus: {
        data: { taskList },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = taskList.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: SAMPLE_QUERY_STATUS_FILTER,
    payload: filteredList,
  });
};

export const SAMPLE_QUERY_STATUS_SEARCH = actionCreator('SAMPLE_QUERY_STATUS_SEARCH');
export const sampleQueryStatusSearch = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SAMPLE_QUERY_STATUS_SEARCH.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SAMPLE_QUERY_STATUS_SEARCH.SUCCESS,
      payload: data.sampleIdList,
    });
    dispatch(sampleQueryStatusFilter(defaultFilterValue));
  };
  const onError = (error) => {
    dispatch({
      type: SAMPLE_QUERY_STATUS_SEARCH.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getQueriesStatus(params), onPending, onSuccess, onError);
};
