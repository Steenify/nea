import { getRodentInspectionListingService } from 'services/inspection-management/rodent';
import { actionCreator, sortFunc, filterFunc, actionTryCatchCreator } from 'utils';
import moment from 'moment';
import { DateRangePickerSelectMode } from 'components/common/dateRangPickerSelect';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'rccId',
  datePickerValue: {
    startDate: moment().subtract(30, 'days').startOf('day'),
    endDate: moment().endOf('day'),
    mode: DateRangePickerSelectMode.custom,
  },
  filterValue: null,
  sortValue: {
    id: 'inspectionDate',
    label: 'Inspection Date',
    desc: false,
  },
};

export const FILTER_QUERY_RODENT_INSPECTION = 'FILTER_QUERY_RODENT_INSPECTION';
export const filterQueryRodentInspectionAction = (filterData) => (dispatch, getState) => {
  const {
    vectorInspectionReducers: {
      queryRodentInspection: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: FILTER_QUERY_RODENT_INSPECTION,
    payload: filteredList,
  });
};

export const GET_QUERY_RODENT_INSPECTION = actionCreator('GET_QUERY_RODENT_INSPECTION');
export const getRodentInspectionListAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GET_QUERY_RODENT_INSPECTION.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GET_QUERY_RODENT_INSPECTION.SUCCESS,
      payload: data.queryRodentList,
    });
    dispatch(filterQueryRodentInspectionAction(defaultFilterValue));
  };
  const onError = (error) => {
    dispatch({
      type: GET_QUERY_RODENT_INSPECTION.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getRodentInspectionListingService(params), onPending, onSuccess, onError);
};
