import moment from 'moment';
import uuid from 'uuid/v4';

import { divisionListingService, divisionDeleteService, divisionCreateService, divisionUpdateService } from 'services/administration-configuration/division';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc, dateStringFromDate } from 'utils';

import { searchUserService } from 'services/non-functional';

import { MASTER_CODE } from 'constants/index';

export const defaultAddValue = () => ({
  divId: uuid(),
  divCode: '',
  divDescription: '',
  divRo: '',
  divDistrict: '',
  divTc: '',
  divGrc: '',
  tlName: '',
  effDate: dateStringFromDate(moment()),
  effTime: '00:00:00',
  expDate: dateStringFromDate(moment()),
  expTime: '23:59:59',
  action: 'add',
});

export const DIVISION_MAINTENANCE_ROLE_LISTING = actionCreator('DIVISION_MAINTENANCE_ROLE_LISTING');
export const getUserRoleAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: DIVISION_MAINTENANCE_ROLE_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: DIVISION_MAINTENANCE_ROLE_LISTING.SUCCESS,
      payload: (data.userVoList || []).map((item) => ({ ...item, label: item.fullName, value: item.soeId })),
    });
  };
  const onError = (error) => {
    dispatch({
      type: DIVISION_MAINTENANCE_ROLE_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(searchUserService(), onPending, onSuccess, onError);
};

export const DIVISION_MAINTENANCE_FILTER_LISTING = 'DIVISION_MAINTENANCE_FILTER_LISTING';
export const filterListingAction = () => (dispatch, getState) => {
  const {
    adminReducers: {
      divisionMaintenance: {
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
    type: DIVISION_MAINTENANCE_FILTER_LISTING,
    payload: [...addedList, ...editList, ...oldList],
  });
};

export const DIVISION_MAINTENANCE_UPDATE_FILTER = 'DIVISION_MAINTENANCE_UPDATE_FILTER';
export const updateFilterAction = (data) => (dispatch) => {
  dispatch({
    type: DIVISION_MAINTENANCE_UPDATE_FILTER,
    payload: data,
  });
  dispatch(filterListingAction());
};

export const DIVISION_MAINTENANCE_LISTING = actionCreator('DIVISION_MAINTENANCE_LISTING');
export const getListingAction = () => async (dispatch, getState) => {
  const { global } = getState();
  const onPending = () => {
    dispatch({
      type: DIVISION_MAINTENANCE_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    const masterCodes = global.data.masterCodes || [];

    const list = (data.divisionCdVoList || []).map((item) => {
      // const [effDate, effTime] = dateAndTimeFromDB(item.effDate);
      // const [expDate, expTime] = dateAndTimeFromDB(item.expDate);
      // return { ...item, effDate, effTime, expDate, expTime };
      const divRo = masterCodes[MASTER_CODE.RO_CODE]?.find((code) => code.label === item.divRo)?.value || item.divRo;
      const divDistrict = masterCodes[MASTER_CODE.CDC_CODE]?.find((code) => code.label === item?.divDistrict)?.value || item.divDistrict;
      const divTc = masterCodes[MASTER_CODE.TC_CODE]?.find((code) => code.label === item.divTc)?.value || item.divTc;
      const divGrc = masterCodes[MASTER_CODE.GRC_CODE]?.find((code) => code.label === item.divGrc)?.value || item.divGrc;
      return { ...item, divRo, divDistrict, divTc, divGrc };
    });
    dispatch({
      type: DIVISION_MAINTENANCE_LISTING.SUCCESS,
      payload: list,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: DIVISION_MAINTENANCE_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(divisionListingService(), onPending, onSuccess, onError);
};

export const DIVISION_MAINTENANCE_DELETE = actionCreator('DIVISION_MAINTENANCE_DELETE');
export const deleteAction = ({ divId }) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: DIVISION_MAINTENANCE_DELETE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: DIVISION_MAINTENANCE_DELETE.SUCCESS,
      payload: divId,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: DIVISION_MAINTENANCE_DELETE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(divisionDeleteService({ divId }), onPending, onSuccess, onError);
};

export const DIVISION_MAINTENANCE_CREATE = actionCreator('DIVISION_MAINTENANCE_CREATE');
export const createAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: DIVISION_MAINTENANCE_CREATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    const newId = data.divisionCdVo.divId;
    dispatch({
      type: DIVISION_MAINTENANCE_CREATE.SUCCESS,
      payload: { oldId: params.divId, newId },
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: DIVISION_MAINTENANCE_CREATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(divisionCreateService({ ...params, divId: undefined, action: undefined }), onPending, onSuccess, onError);
};

export const DIVISION_MAINTENANCE_UPDATE = actionCreator('DIVISION_MAINTENANCE_UPDATE');
export const updateAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: DIVISION_MAINTENANCE_UPDATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: DIVISION_MAINTENANCE_UPDATE.SUCCESS,
      payload: params.divId,
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: DIVISION_MAINTENANCE_UPDATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(divisionUpdateService({ ...params, action: undefined }), onPending, onSuccess, onError);
};

// Local Actions

export const DIVISION_MAINTENANCE_EDIT = 'DIVISION_MAINTENANCE_EDIT';
export const editAction = (divId) => (dispatch) => {
  dispatch({
    type: DIVISION_MAINTENANCE_EDIT,
    payload: divId,
  });
  dispatch(filterListingAction());
};

export const DIVISION_MAINTENANCE_CANCEL_EDITING = 'DIVISION_MAINTENANCE_CANCEL_EDITING';
export const cancelEditAction = () => (dispatch) => {
  dispatch({
    type: DIVISION_MAINTENANCE_CANCEL_EDITING,
  });
  dispatch(filterListingAction());
};

export const DIVISION_MAINTENANCE_ADD = 'DIVISION_MAINTENANCE_ADD';
export const addAction = () => (dispatch) => {
  dispatch({
    type: DIVISION_MAINTENANCE_ADD,
    payload: defaultAddValue(),
  });
  dispatch(filterListingAction());
};

export const DIVISION_MAINTENANCE_REMOVE_ADD = 'DIVISION_MAINTENANCE_REMOVE_ADD';
export const removeAddAction = (divId) => (dispatch) => {
  dispatch({
    type: DIVISION_MAINTENANCE_REMOVE_ADD,
    payload: divId,
  });
  dispatch(filterListingAction());
};

export const DIVISION_MAINTENANCE_SET_VALUE = 'DIVISION_MAINTENANCE_SET_VALUE';
export const setValueAction = (params) => (dispatch) => {
  dispatch({
    type: DIVISION_MAINTENANCE_SET_VALUE,
    payload: params,
  });
  dispatch(filterListingAction());
};

export const DIVISION_MAINTENANCE_RESET_REDUCER = 'DIVISION_MAINTENANCE_RESET_REDUCER';
export const resetReducerAction = () => (dispatch) => {
  dispatch({
    type: DIVISION_MAINTENANCE_RESET_REDUCER,
  });
};
