import { actionTryCatchCreator, actionCreator, filterFunc, sortFunc } from 'utils';
import { queryOperationalSchedulesInfoService } from 'services/rodent-audit';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'companyName',
  datePickerValue: null,
  filterValue: null,
  sortValue: {
    id: 'week',
    label: 'Week',
    desc: false,
  },
};

export const RODENT_AUDIT_OPERATIONAL_SCHEDULES_INFO_FILTER = 'RODENT_AUDIT_OPERATIONAL_SCHEDULES_INFO_FILTER';
export const filterListAction = (filterData = defaultFilterValue) => (dispatch, getState) => {
  const {
    rodentAuditReducers: {
      operationalScheduleInfo: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: RODENT_AUDIT_OPERATIONAL_SCHEDULES_INFO_FILTER,
    payload: filteredList,
  });
};

export const QUERY_OPERATIONAL_SCHEDULES_INFO = actionCreator('QUERY_OPERATIONAL_SCHEDULES_INFO');
export const queryOperationalSchedulesInfoAction = (data = {}) => async (dispatch) => {
  const { PENDING, SUCCESS, ERROR } = QUERY_OPERATIONAL_SCHEDULES_INFO;

  const onPending = () => {
    dispatch({ type: PENDING });
  };
  const onSuccess = (res) => {
    dispatch({ type: SUCCESS, payload: res?.operationalScheduleInfo || [] });

    dispatch(filterListAction());
  };
  const onError = (e) => {
    dispatch({ type: ERROR, payload: e });
  };

  await actionTryCatchCreator(queryOperationalSchedulesInfoService(data), onPending, onSuccess, onError);
};
