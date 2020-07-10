import uuid from 'uuid/v4';

import {
  userApproverMappingListingService,
  userApproverMappingDeleteService,
  userApproverMappingUpdateService,
  userApproverMappingCreateService,
} from 'services/administration-configuration/user-approver-mapping';
import { searchUserService } from 'services/non-functional';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

export const defaultAddValue = () => ({
  id: uuid(),
  user: '',
  approver: '',
  action: 'add',
});

export const USER_APPROVER_MAPPING_FILTER_LISTING = 'USER_APPROVER_MAPPING_FILTER_LISTING';
export const filterListingAction = () => (dispatch, getState) => {
  const {
    adminReducers: {
      userApproverMapping: {
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
    type: USER_APPROVER_MAPPING_FILTER_LISTING,
    payload: [...addedList, ...editList, ...oldList],
  });
};

export const USER_APPROVER_MAPPING_UPDATE_FILTER = 'USER_APPROVER_MAPPING_UPDATE_FILTER';
export const updateFilterAction = (data) => (dispatch) => {
  dispatch({
    type: USER_APPROVER_MAPPING_UPDATE_FILTER,
    payload: data,
  });
  dispatch(filterListingAction());
};

export const USER_APPROVER_MAPPING_ROLE_LISTING = actionCreator('USER_APPROVER_MAPPING_ROLE_LISTING');
export const getUserRoleAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: USER_APPROVER_MAPPING_ROLE_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: USER_APPROVER_MAPPING_ROLE_LISTING.SUCCESS,
      payload: (data.userVoList || []).map((item) => ({ ...item, label: item.fullName, value: item.soeId })),
    });
  };
  const onError = (error) => {
    dispatch({
      type: USER_APPROVER_MAPPING_ROLE_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(searchUserService(), onPending, onSuccess, onError);
};

export const USER_APPROVER_MAPPING_LISTING = actionCreator('USER_APPROVER_MAPPING_LISTING');
export const getListingAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: USER_APPROVER_MAPPING_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: USER_APPROVER_MAPPING_LISTING.SUCCESS,
      payload: (data.userApproverList || []).map((item) => ({ ...item, id: uuid() })),
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: USER_APPROVER_MAPPING_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(userApproverMappingListingService(), onPending, onSuccess, onError);
};

export const USER_APPROVER_MAPPING_DELETE = actionCreator('USER_APPROVER_MAPPING_DELETE');
export const deleteAction = ({ id, userSoeId }) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: USER_APPROVER_MAPPING_DELETE.PENDING,
    });
  };
  const onSuccess = () => {
    dispatch({
      type: USER_APPROVER_MAPPING_DELETE.SUCCESS,
      payload: id,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: USER_APPROVER_MAPPING_DELETE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(userApproverMappingDeleteService({ userSoeId }), onPending, onSuccess, onError);
};

export const USER_APPROVER_MAPPING_CREATE = actionCreator('USER_APPROVER_MAPPING_CREATE');
export const createAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: USER_APPROVER_MAPPING_CREATE.PENDING,
    });
  };
  const onSuccess = () => {
    dispatch({
      type: USER_APPROVER_MAPPING_CREATE.SUCCESS,
      payload: { oldId: params.id, newId: params.id },
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: USER_APPROVER_MAPPING_CREATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(userApproverMappingCreateService({ ...params, id: undefined, action: undefined }), onPending, onSuccess, onError);
};

export const USER_APPROVER_MAPPING_UPDATE = actionCreator('USER_APPROVER_MAPPING_UPDATE');
export const updateAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: USER_APPROVER_MAPPING_UPDATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: USER_APPROVER_MAPPING_UPDATE.SUCCESS,
      payload: params.id,
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: USER_APPROVER_MAPPING_UPDATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(userApproverMappingUpdateService({ ...params, action: undefined }), onPending, onSuccess, onError);
};

// Local Actions

export const USER_APPROVER_MAPPING_EDIT = 'USER_APPROVER_MAPPING_EDIT';
export const editAction = (id) => (dispatch) => {
  dispatch({
    type: USER_APPROVER_MAPPING_EDIT,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const USER_APPROVER_MAPPING_CANCEL_EDITING = 'USER_APPROVER_MAPPING_CANCEL_EDITING';
export const cancelEditAction = () => (dispatch) => {
  dispatch({
    type: USER_APPROVER_MAPPING_CANCEL_EDITING,
  });
  dispatch(filterListingAction());
};

export const USER_APPROVER_MAPPING_ADD = 'USER_APPROVER_MAPPING_ADD';
export const addAction = () => (dispatch) => {
  dispatch({
    type: USER_APPROVER_MAPPING_ADD,
    payload: defaultAddValue(),
  });
  dispatch(filterListingAction());
};

export const USER_APPROVER_MAPPING_REMOVE_ADD = 'USER_APPROVER_MAPPING_REMOVE_ADD';
export const removeAddAction = (id) => (dispatch) => {
  dispatch({
    type: USER_APPROVER_MAPPING_REMOVE_ADD,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const USER_APPROVER_MAPPING_SET_VALUE = 'USER_APPROVER_MAPPING_SET_VALUE';
export const setValueAction = (params) => (dispatch) => {
  dispatch({
    type: USER_APPROVER_MAPPING_SET_VALUE,
    payload: params,
  });
  dispatch(filterListingAction());
};

export const USER_APPROVER_MAPPING_RESET_REDUCER = 'USER_APPROVER_MAPPING_RESET_REDUCER';
export const resetReducerAction = () => (dispatch) => {
  dispatch({
    type: USER_APPROVER_MAPPING_RESET_REDUCER,
  });
};
