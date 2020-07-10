import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';
import { manpowerListInfoService } from 'services/rodent-audit';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'technicianName',
  datePickerValue: null,
  filterValue: null,
  sortValue: {
    id: 'technicianName',
    label: 'Name of Technician/Worker Name',
    desc: false,
  },
};

export const RODENT_AUDIT_FILTER = 'RODENT_AUDIT_FILTER';
export const filterListAction = (filterData = defaultFilterValue) => (dispatch, getState) => {
  const {
    rodentAuditReducers: {
      manpowerListDetail: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: RODENT_AUDIT_FILTER,
    payload: filteredList,
  });
};

export const MANPOWER_LIST_INFO = actionCreator('MANPOWER_LIST_INFO');
export const manpowerListInfoAction = (data) => async (dispatch) => {
  const { PENDING, SUCCESS, ERROR } = MANPOWER_LIST_INFO;

  const onPending = () => {
    dispatch({ type: PENDING });
  };

  const onSuccess = (res) => {
    dispatch({ type: SUCCESS, payload: res.manpowerListInfo || [] });

    dispatch(filterListAction());
  };

  const onError = (_e) => {
    dispatch({ type: ERROR });
  };

  await actionTryCatchCreator(manpowerListInfoService(data), onPending, onSuccess, onError);
};
