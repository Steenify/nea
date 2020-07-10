import { getFoggingAuditScheduleListService, uploadFoggingScheduleService } from 'services/fogging-audit';
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
  searchType: 'companyUen',
};

export const FILTER_FOGGING_SCHEDULE_LIST = 'FILTER_FOGGING_SCHEDULE_LIST';
export const filterListAction = (data = defaultFilterValue) => (dispatch, getState) => {
  const {
    foggingAuditReducers: {
      foggingSchedule: {
        data: { list },
      },
    },
  } = getState();
  const filteredList = list.filter(item => filterFunc(item, data)).sort((a, b) => sortFunc(a, b, data.sortValue));

  dispatch({
    type: FILTER_FOGGING_SCHEDULE_LIST,
    payload: filteredList,
  });
};

export const GET_FOGGING_SCHEDULE_LIST = actionCreator('GET_FOGGING_SCHEDULE_LIST');
export const getListAction = () => async dispatch => {
  const onPending = () => {
    dispatch({ type: GET_FOGGING_SCHEDULE_LIST.PENDING });
  };

  const onSuccess = data => {
    dispatch({ type: GET_FOGGING_SCHEDULE_LIST.SUCCESS, payload: data?.schedules || [] });
    dispatch(filterListAction());
  };

  const onError = error => {
    dispatch({ type: GET_FOGGING_SCHEDULE_LIST.ERROR, payload: error });
  };

  await actionTryCatchCreator(getFoggingAuditScheduleListService(), onPending, onSuccess, onError);
};

export const UPLOAD_FOGGING_SCHEDULE = actionCreator('UPLOAD_FOGGING_SCHEDULE');
export const uploadFoggingScheduleAction = (params, callback) => async dispatch => {
  const onPending = () => {
    dispatch({ type: UPLOAD_FOGGING_SCHEDULE.PENDING });
  };

  const onSuccess = data => {
    dispatch({ type: UPLOAD_FOGGING_SCHEDULE.SUCCESS, payload: data });
    if (callback) callback();
  };

  const onError = error => {
    dispatch({ type: UPLOAD_FOGGING_SCHEDULE.ERROR, payload: error });
  };

  await actionTryCatchCreator(uploadFoggingScheduleService(params), onPending, onSuccess, onError);
};
