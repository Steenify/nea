import {
  // masterCodeListingService,
  masterCodeDeleteService,
  masterCodeCreateService,
  masterCodeUpdateService,
} from 'services/administration-configuration/master-code';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

export const MASTERCODE_MAINTENANCE_DETAIL_FILTER_LISTING = 'MASTERCODE_MAINTENANCE_DETAIL_FILTER_LISTING';
export const filterListingAction = () => (dispatch, getState) => {
  const {
    adminReducers: {
      masterCodeMaintenanceDetail: {
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
    type: MASTERCODE_MAINTENANCE_DETAIL_FILTER_LISTING,
    payload: [...addedList, ...editList, ...oldList],
  });
};

export const MASTERCODE_MAINTENANCE_DETAIL_UPDATE_FILTER = 'MASTERCODE_MAINTENANCE_DETAIL_UPDATE_FILTER';
export const updateFilterAction = (data) => (dispatch) => {
  dispatch({
    type: MASTERCODE_MAINTENANCE_DETAIL_UPDATE_FILTER,
    payload: data,
  });
  dispatch(filterListingAction());
};

export const MASTERCODE_MAINTENANCE_DETAIL_LISTING = actionCreator('MASTERCODE_MAINTENANCE_DETAIL_LISTING');
export const getListingAction = (data) => async (dispatch) => {
  dispatch({
    type: MASTERCODE_MAINTENANCE_DETAIL_LISTING.SUCCESS,
    payload: data || [],
  });
  // const onPending = () => {
  //   dispatch({
  //     type: MASTERCODE_MAINTENANCE_DETAIL_LISTING.PENDING,
  //   });
  // };
  // const onSuccess = data => {
  //   dispatch({
  //     type: MASTERCODE_MAINTENANCE_DETAIL_LISTING.SUCCESS,
  //     payload: data.mastCdVoList,
  //   });
  //   dispatch(filterListingAction());
  // };
  // const onError = error => {
  //   dispatch({
  //     type: MASTERCODE_MAINTENANCE_DETAIL_LISTING.ERROR,
  //     payload: error,
  //   });
  // };
  // await actionTryCatchCreator(masterCodeListingService(), onPending, onSuccess, onError);
};

export const MASTERCODE_MAINTENANCE_DETAIL_DELETE = actionCreator('MASTERCODE_MAINTENANCE_DETAIL_DELETE');
export const deleteAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_DETAIL_DELETE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_DETAIL_DELETE.SUCCESS,
      payload: params.codeId,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_DETAIL_DELETE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(masterCodeDeleteService(params), onPending, onSuccess, onError);
};

export const MASTERCODE_MAINTENANCE_DETAIL_CREATE = actionCreator('MASTERCODE_MAINTENANCE_DETAIL_CREATE');
export const createAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_DETAIL_CREATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    const newId = data.mastCdVoList[0].codeId;
    dispatch({
      type: MASTERCODE_MAINTENANCE_DETAIL_CREATE.SUCCESS,
      payload: { oldId: params.codeId, newId },
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_DETAIL_CREATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(masterCodeCreateService({ ...params, codeId: undefined, action: undefined }), onPending, onSuccess, onError);
};

export const MASTERCODE_MAINTENANCE_DETAIL_UPDATE = actionCreator('MASTERCODE_MAINTENANCE_DETAIL_UPDATE');
export const updateAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_DETAIL_UPDATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_DETAIL_UPDATE.SUCCESS,
      payload: params.codeId,
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: MASTERCODE_MAINTENANCE_DETAIL_UPDATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(masterCodeUpdateService({ ...params, action: undefined }), onPending, onSuccess, onError);
};

// Local Actions

export const MASTERCODE_MAINTENANCE_DETAIL_EDIT = 'MASTERCODE_MAINTENANCE_DETAIL_EDIT';
export const editAction = (codeId) => (dispatch) => {
  dispatch({
    type: MASTERCODE_MAINTENANCE_DETAIL_EDIT,
    payload: codeId,
  });
  dispatch(filterListingAction());
};

export const MASTERCODE_MAINTENANCE_DETAIL_CANCEL_EDITING = 'MASTERCODE_MAINTENANCE_DETAIL_CANCEL_EDITING';
export const cancelEditAction = () => (dispatch) => {
  dispatch({
    type: MASTERCODE_MAINTENANCE_DETAIL_CANCEL_EDITING,
  });
  dispatch(filterListingAction());
};

export const MASTERCODE_MAINTENANCE_DETAIL_ADD = 'MASTERCODE_MAINTENANCE_DETAIL_ADD';
export const addAction = (data) => (dispatch) => {
  dispatch({
    type: MASTERCODE_MAINTENANCE_DETAIL_ADD,
    payload: data,
  });
  dispatch(filterListingAction());
};

export const MASTERCODE_MAINTENANCE_DETAIL_REMOVE_ADD = 'MASTERCODE_MAINTENANCE_DETAIL_REMOVE_ADD';
export const removeAddAction = (codeId) => (dispatch) => {
  dispatch({
    type: MASTERCODE_MAINTENANCE_DETAIL_REMOVE_ADD,
    payload: codeId,
  });
  dispatch(filterListingAction());
};

export const MASTERCODE_MAINTENANCE_DETAIL_SET_VALUE = 'MASTERCODE_MAINTENANCE_DETAIL_SET_VALUE';
export const setValueAction = (params) => (dispatch) => {
  dispatch({
    type: MASTERCODE_MAINTENANCE_DETAIL_SET_VALUE,
    payload: params,
  });
  dispatch(filterListingAction());
};

export const MASTERCODE_MAINTENANCE_DETAIL_RESET_REDUCER = 'MASTERCODE_MAINTENANCE_DETAIL_RESET_REDUCER';
export const resetReducerAction = () => (dispatch) => {
  dispatch({
    type: MASTERCODE_MAINTENANCE_DETAIL_RESET_REDUCER,
  });
};
