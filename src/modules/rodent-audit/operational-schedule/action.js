import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';
import { uploadRodentOperationalSchedulesService, opsTaskScheduleListingService } from 'services/rodent-audit';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'companyName',
  datePickerValue: null,
  filterValue: null,
  sortValue: {
    id: 'periodFrom',
    label: 'Ops Period From',
    desc: false,
  },
};

export const RODENT_AUDIT_OPERATIONAL_SCHEDULE_FILTER = 'RODENT_AUDIT_OPERATIONAL_SCHEDULE_FILTER';
export const filterListAction = (filterData = defaultFilterValue) => (dispatch, getState) => {
  const {
    rodentAuditReducers: {
      operationalSchedule: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: RODENT_AUDIT_OPERATIONAL_SCHEDULE_FILTER,
    payload: filteredList,
  });
};

export const OPS_SCHEDULE_LISTING = actionCreator('OPS_SCHEDULE_LISTING');
export const opsTaskScheduleListingAction = () => async (dispatch) => {
  const { PENDING, SUCCESS, ERROR } = OPS_SCHEDULE_LISTING;

  const onPending = () => {
    dispatch({ type: PENDING });
  };
  const onSuccess = (res) => {
    dispatch({ type: SUCCESS, payload: res?.opsScheduleList || [] });

    dispatch(filterListAction());
  };
  const onError = (e) => {
    dispatch({ type: ERROR, payload: e });
  };
  await actionTryCatchCreator(opsTaskScheduleListingService(), onPending, onSuccess, onError);
};

export const UPLOAD_RODENT_OPERATIONAL_SCHEDULES = actionCreator('UPLOAD_RODENT_OPERATIONAL_SCHEDULES');
export const uploadRodentOperationalSchedulesAction = (data, callback) => async (dispatch) => {
  const { PENDING, SUCCESS, ERROR } = UPLOAD_RODENT_OPERATIONAL_SCHEDULES;

  const onPending = () => {
    dispatch({ type: PENDING });
  };
  const onSuccess = (_res) => {
    dispatch({ type: SUCCESS });

    if (callback) callback(null);
  };
  const onError = (e) => {
    dispatch({ type: ERROR, payload: e });

    if (callback) callback(e);
  };
  await actionTryCatchCreator(uploadRodentOperationalSchedulesService(data), onPending, onSuccess, onError);
};
