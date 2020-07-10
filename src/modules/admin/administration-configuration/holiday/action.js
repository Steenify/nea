import moment from 'moment';
import uuid from 'uuid/v4';

import { holidayListingService, holidayDeleteService, holidayCreateService, holidayUpdateService } from 'services/administration-configuration/holiday';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc, dateStringFromDate } from 'utils';

export const defaultAddValue = () => ({
  id: uuid(),
  holidayYear: moment().get('years'),
  holidayDate: dateStringFromDate(moment()),
  holidayDescription: '',
  fixedHoliday: true,
  fullDay: true,
  amPm: undefined,
  action: 'add',
});

export const HOLIDAY_MAINTENANCE_FILTER_LISTING = 'HOLIDAY_MAINTENANCE_FILTER_LISTING';
export const filterListingAction = () => (dispatch, getState) => {
  const {
    adminReducers: {
      holidayMaintenance: {
        data: { editingList },
        ui: { filterValue },
      },
    },
  } = getState();
  const addedList = editingList.filter((item) => item.action === 'add');
  // .filter(item => filterFunc(item, data))
  // .sort((a, b) => sortFunc(a, b, data.sortValue));
  const editList = editingList.filter((item) => item.action === 'edit');
  // .filter(item => filterFunc(item, data))
  // .sort((a, b) => sortFunc(a, b, data.sortValue));
  const oldList = editingList
    .filter((item) => item.action !== 'add' && item.action !== 'edit')
    .filter((item) => filterFunc(item, filterValue))
    .sort((a, b) => sortFunc(a, b, filterValue.sortValue));

  dispatch({
    type: HOLIDAY_MAINTENANCE_FILTER_LISTING,
    payload: [...addedList, ...editList, ...oldList],
  });
};

export const HOLIDAY_MAINTENANCE_UPDATE_FILTER = 'HOLIDAY_MAINTENANCE_UPDATE_FILTER';
export const updateFilterAction = (data) => (dispatch) => {
  dispatch({
    type: HOLIDAY_MAINTENANCE_UPDATE_FILTER,
    payload: data,
  });
  dispatch(filterListingAction());
};

export const HOLIDAY_MAINTENANCE_LISTING = actionCreator('HOLIDAY_MAINTENANCE_LISTING');
export const getListingAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: HOLIDAY_MAINTENANCE_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: HOLIDAY_MAINTENANCE_LISTING.SUCCESS,
      payload: data.holidays,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: HOLIDAY_MAINTENANCE_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(holidayListingService(), onPending, onSuccess, onError);
};

export const HOLIDAY_MAINTENANCE_DELETE = actionCreator('HOLIDAY_MAINTENANCE_DELETE');
export const deleteAction = ({ id }) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: HOLIDAY_MAINTENANCE_DELETE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: HOLIDAY_MAINTENANCE_DELETE.SUCCESS,
      payload: id,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: HOLIDAY_MAINTENANCE_DELETE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(holidayDeleteService({ id }), onPending, onSuccess, onError);
};

export const HOLIDAY_MAINTENANCE_CREATE = actionCreator('HOLIDAY_MAINTENANCE_CREATE');
export const createAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: HOLIDAY_MAINTENANCE_CREATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    const newId = data.holidayVo.id;
    dispatch({
      type: HOLIDAY_MAINTENANCE_CREATE.SUCCESS,
      payload: { oldId: params.id, newId },
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: HOLIDAY_MAINTENANCE_CREATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(holidayCreateService({ ...params, id: undefined, action: undefined }), onPending, onSuccess, onError);
};

export const HOLIDAY_MAINTENANCE_UPDATE = actionCreator('HOLIDAY_MAINTENANCE_UPDATE');
export const updateAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: HOLIDAY_MAINTENANCE_UPDATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: HOLIDAY_MAINTENANCE_UPDATE.SUCCESS,
      payload: params.id,
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: HOLIDAY_MAINTENANCE_UPDATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(holidayUpdateService({ ...params, action: undefined }), onPending, onSuccess, onError);
};

// Local Actions

export const HOLIDAY_MAINTENANCE_EDIT = 'HOLIDAY_MAINTENANCE_EDIT';
export const editAction = (id) => (dispatch) => {
  dispatch({
    type: HOLIDAY_MAINTENANCE_EDIT,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const HOLIDAY_MAINTENANCE_CANCEL_EDITING = 'HOLIDAY_MAINTENANCE_CANCEL_EDITING';
export const cancelEditAction = () => (dispatch) => {
  dispatch({
    type: HOLIDAY_MAINTENANCE_CANCEL_EDITING,
  });
  dispatch(filterListingAction());
};

export const HOLIDAY_MAINTENANCE_ADD = 'HOLIDAY_MAINTENANCE_ADD';
export const addAction = () => (dispatch) => {
  dispatch({
    type: HOLIDAY_MAINTENANCE_ADD,
    payload: defaultAddValue(),
  });
  dispatch(filterListingAction());
};

export const HOLIDAY_MAINTENANCE_REMOVE_ADD = 'HOLIDAY_MAINTENANCE_REMOVE_ADD';
export const removeAddAction = (id) => (dispatch) => {
  dispatch({
    type: HOLIDAY_MAINTENANCE_REMOVE_ADD,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const HOLIDAY_MAINTENANCE_SET_VALUE = 'HOLIDAY_MAINTENANCE_SET_VALUE';
export const setValueAction = (params) => (dispatch) => {
  dispatch({
    type: HOLIDAY_MAINTENANCE_SET_VALUE,
    payload: params,
  });
  dispatch(filterListingAction());
};

export const HOLIDAY_MAINTENANCE_RESET_REDUCER = 'HOLIDAY_MAINTENANCE_RESET_REDUCER';
export const resetReducerAction = () => (dispatch) => {
  dispatch({
    type: HOLIDAY_MAINTENANCE_RESET_REDUCER,
  });
};
