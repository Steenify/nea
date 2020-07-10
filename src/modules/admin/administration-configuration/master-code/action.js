import moment from 'moment';
import uuid from 'uuid/v4';

import {
  masterCodeListingService,
  masterCodeDeleteService,
  masterCodeCreateService,
  masterCodeUpdateService,
} from 'services/administration-configuration/master-code';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc, dateStringFromDate } from 'utils';

export const defaultAddValue = () => ({
  id: uuid(),
  holidayYear: moment().get('years'),
  holidayDate: dateStringFromDate(moment()),
  holidayDescription: '',
  action: 'add',
});

export const MASTERCODE_MAINTENANCE_FILTER_LISTING = 'MASTERCODE_MAINTENANCE_FILTER_LISTING';
export const filterListingAction = () => (dispatch, getState) => {
  const {
    adminReducers: {
      masterCodeMaintenance: {
        data: { editingList },
        ui: { filterValue },
      },
    },
  } = getState();
  const addedList = editingList.filter(item => item.action === 'add');
  // .filter(item => filterFunc(item, data))
  // .sort((a, b) => sortFunc(a, b, data.sortValue));
  const editList = editingList.filter(item => item.action === 'edit');
  // .filter(item => filterFunc(item, data))
  // .sort((a, b) => sortFunc(a, b, data.sortValue));
  const oldList = editingList
    .filter(item => item.action !== 'add' && item.action !== 'edit')
    .filter(item => filterFunc(item, filterValue))
    .sort((a, b) => sortFunc(a, b, filterValue.sortValue));

  dispatch({
    type: MASTERCODE_MAINTENANCE_FILTER_LISTING,
    payload: [...addedList, ...editList, ...oldList],
  });
};

export const MASTERCODE_MAINTENANCE_UPDATE_FILTER = 'MASTERCODE_MAINTENANCE_UPDATE_FILTER';
export const updateFilterAction = data => dispatch => {
  dispatch({
    type: MASTERCODE_MAINTENANCE_UPDATE_FILTER,
    payload: data,
  });
  dispatch(filterListingAction());
};

export const MASTERCODE_MAINTENANCE_LISTING = actionCreator('MASTERCODE_MAINTENANCE_LISTING');
export const getListingAction = () => async dispatch => {
  const onPending = () => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_LISTING.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_LISTING.SUCCESS,
      payload: data.mastCdVoList,
    });
    dispatch(filterListingAction());
  };
  const onError = error => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(masterCodeListingService(), onPending, onSuccess, onError);
};

export const MASTERCODE_MAINTENANCE_DELETE = actionCreator('MASTERCODE_MAINTENANCE_DELETE');
export const deleteAction = ({ id }) => async dispatch => {
  const onPending = () => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_DELETE.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_DELETE.SUCCESS,
      payload: id,
    });
    dispatch(filterListingAction());
  };
  const onError = error => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_DELETE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(masterCodeDeleteService({ id }), onPending, onSuccess, onError);
};

export const MASTERCODE_MAINTENANCE_CREATE = actionCreator('MASTERCODE_MAINTENANCE_CREATE');
export const createAction = (params, callback) => async dispatch => {
  const onPending = () => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_CREATE.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_CREATE.SUCCESS,
      payload: params.id,
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = error => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_CREATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(
    masterCodeCreateService({ ...params, id: undefined, action: undefined }),
    onPending,
    onSuccess,
    onError,
  );
};

export const MASTERCODE_MAINTENANCE_UPDATE = actionCreator('MASTERCODE_MAINTENANCE_UPDATE');
export const updateAction = (params, callback) => async dispatch => {
  const onPending = () => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_UPDATE.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_UPDATE.SUCCESS,
      payload: params.id,
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = error => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_UPDATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(masterCodeUpdateService({ ...params, action: undefined }), onPending, onSuccess, onError);
};

// Local Actions

export const MASTERCODE_MAINTENANCE_EDIT = 'MASTERCODE_MAINTENANCE_EDIT';
export const editAction = id => dispatch => {
  dispatch({
    type: MASTERCODE_MAINTENANCE_EDIT,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const MASTERCODE_MAINTENANCE_CANCEL_EDITING = 'MASTERCODE_MAINTENANCE_CANCEL_EDITING';
export const cancelEditAction = () => dispatch => {
  dispatch({
    type: MASTERCODE_MAINTENANCE_CANCEL_EDITING,
  });
  dispatch(filterListingAction());
};

export const MASTERCODE_MAINTENANCE_ADD = 'MASTERCODE_MAINTENANCE_ADD';
export const addAction = () => dispatch => {
  dispatch({
    type: MASTERCODE_MAINTENANCE_ADD,
    payload: defaultAddValue(),
  });
  dispatch(filterListingAction());
};

export const MASTERCODE_MAINTENANCE_REMOVE_ADD = 'MASTERCODE_MAINTENANCE_REMOVE_ADD';
export const removeAddAction = id => dispatch => {
  dispatch({
    type: MASTERCODE_MAINTENANCE_REMOVE_ADD,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const MASTERCODE_MAINTENANCE_SET_VALUE = 'MASTERCODE_MAINTENANCE_SET_VALUE';
export const setValueAction = params => dispatch => {
  dispatch({
    type: MASTERCODE_MAINTENANCE_SET_VALUE,
    payload: params,
  });
  dispatch(filterListingAction());
};

export const MASTERCODE_MAINTENANCE_RESET_REDUCER = 'MASTERCODE_MAINTENANCE_RESET_REDUCER';
export const resetReducerAction = () => dispatch => {
  dispatch({
    type: MASTERCODE_MAINTENANCE_RESET_REDUCER,
  });
};
