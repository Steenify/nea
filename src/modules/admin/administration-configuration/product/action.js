import uuid from 'uuid/v4';

import { productListingService, productDeleteService, productUpdateService, productCreateService } from 'services/administration-configuration/product';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

export const defaultAddValue = () => ({
  id: uuid(),
  productName: '',
  productDesc: '',
  neaRegistrationNo: '',
  activeStatus: false,
  action: 'add',
});

export const PRODUCT_MAINTENANCE_FILTER_LISTING = 'PRODUCT_MAINTENANCE_FILTER_LISTING';
export const filterListingAction = () => (dispatch, getState) => {
  const {
    adminReducers: {
      productMaintenance: {
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
    type: PRODUCT_MAINTENANCE_FILTER_LISTING,
    payload: [...addedList, ...editList, ...oldList],
  });
};

export const PRODUCT_MAINTENANCE_UPDATE_FILTER = 'PRODUCT_MAINTENANCE_UPDATE_FILTER';
export const updateFilterAction = (data) => (dispatch) => {
  dispatch({
    type: PRODUCT_MAINTENANCE_UPDATE_FILTER,
    payload: data,
  });
  dispatch(filterListingAction());
};

export const PRODUCT_MAINTENANCE_LISTING = actionCreator('PRODUCT_MAINTENANCE_LISTING');
export const getListingAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: PRODUCT_MAINTENANCE_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: PRODUCT_MAINTENANCE_LISTING.SUCCESS,
      payload: data.productInfoVoList,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: PRODUCT_MAINTENANCE_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(productListingService(), onPending, onSuccess, onError);
};

export const PRODUCT_MAINTENANCE_DELETE = actionCreator('PRODUCT_MAINTENANCE_DELETE');
export const deleteAction = ({ id }) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: PRODUCT_MAINTENANCE_DELETE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: PRODUCT_MAINTENANCE_DELETE.SUCCESS,
      payload: id,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: PRODUCT_MAINTENANCE_DELETE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(productDeleteService({ id }), onPending, onSuccess, onError);
};

export const PRODUCT_MAINTENANCE_CREATE = actionCreator('PRODUCT_MAINTENANCE_CREATE');
export const createAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: PRODUCT_MAINTENANCE_CREATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    const newId = data.productInfoVo.id;
    dispatch({
      type: PRODUCT_MAINTENANCE_CREATE.SUCCESS,
      payload: { oldId: params.id, newId },
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: PRODUCT_MAINTENANCE_CREATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(productCreateService({ ...params, id: undefined, action: undefined }), onPending, onSuccess, onError);
};

export const PRODUCT_MAINTENANCE_UPDATE = actionCreator('PRODUCT_MAINTENANCE_UPDATE');
export const updateAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: PRODUCT_MAINTENANCE_UPDATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: PRODUCT_MAINTENANCE_UPDATE.SUCCESS,
      payload: params.id,
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: PRODUCT_MAINTENANCE_UPDATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(productUpdateService({ ...params, action: undefined }), onPending, onSuccess, onError);
};

// Local Actions

export const PRODUCT_MAINTENANCE_EDIT = 'PRODUCT_MAINTENANCE_EDIT';
export const editAction = (id) => (dispatch) => {
  dispatch({
    type: PRODUCT_MAINTENANCE_EDIT,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const PRODUCT_MAINTENANCE_CANCEL_EDITING = 'PRODUCT_MAINTENANCE_CANCEL_EDITING';
export const cancelEditAction = () => (dispatch) => {
  dispatch({
    type: PRODUCT_MAINTENANCE_CANCEL_EDITING,
  });
  dispatch(filterListingAction());
};

export const PRODUCT_MAINTENANCE_ADD = 'PRODUCT_MAINTENANCE_ADD';
export const addAction = () => (dispatch) => {
  dispatch({
    type: PRODUCT_MAINTENANCE_ADD,
    payload: defaultAddValue(),
  });
  dispatch(filterListingAction());
};

export const PRODUCT_MAINTENANCE_REMOVE_ADD = 'PRODUCT_MAINTENANCE_REMOVE_ADD';
export const removeAddAction = (id) => (dispatch) => {
  dispatch({
    type: PRODUCT_MAINTENANCE_REMOVE_ADD,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const PRODUCT_MAINTENANCE_SET_VALUE = 'PRODUCT_MAINTENANCE_SET_VALUE';
export const setValueAction = (params) => (dispatch) => {
  dispatch({
    type: PRODUCT_MAINTENANCE_SET_VALUE,
    payload: params,
  });
  dispatch(filterListingAction());
};

export const PRODUCT_MAINTENANCE_RESET_REDUCER = 'PRODUCT_MAINTENANCE_RESET_REDUCER';
export const resetReducerAction = () => (dispatch) => {
  dispatch({
    type: PRODUCT_MAINTENANCE_RESET_REDUCER,
  });
};
