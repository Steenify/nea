import uuid from 'uuid/v4';

import { speciesCodeListingService, speciesCodeDeleteService, speciesCodeCreateService, speciesCodeUpdateService } from 'services/administration-configuration/species-code';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

import { MASTER_CODE } from 'constants/index';
export const defaultAddValue = () => ({
  id: uuid(),
  speciesCode: '',
  speciesName: '',
  isVector: '',
  diseases: [],
  enforceable: true,
  specimenTypeCode: '',
  stage: [],
  action: 'add',
});

export const SPECIES_CODE_MAINTENANCE_FILTER_LISTING = 'SPECIES_CODE_MAINTENANCE_FILTER_LISTING';
export const filterListingAction = () => (dispatch, getState) => {
  const {
    adminReducers: {
      speciesCodeMaintenance: {
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
    type: SPECIES_CODE_MAINTENANCE_FILTER_LISTING,
    payload: [...addedList, ...editList, ...oldList],
  });
};

export const SPECIES_CODE_MAINTENANCE_UPDATE_FILTER = 'SPECIES_CODE_MAINTENANCE_UPDATE_FILTER';
export const updateFilterAction = (data) => (dispatch) => {
  dispatch({
    type: SPECIES_CODE_MAINTENANCE_UPDATE_FILTER,
    payload: data,
  });
  dispatch(filterListingAction());
};

export const SPECIES_CODE_MAINTENANCE_LISTING = actionCreator('SPECIES_CODE_MAINTENANCE_LISTING');
export const getListingAction = () => async (dispatch, getState) => {
  const { global } = getState();
  const onPending = () => {
    dispatch({
      type: SPECIES_CODE_MAINTENANCE_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    const masterCodes = global.data.masterCodes || [];
    const list = (data.speciesCodeVOs || []).map((item) => {
      const specimenTypeCode = masterCodes[MASTER_CODE.SPECIMEN_CODE]?.find((code) => code.label === item.specimenTypeCode)?.value || item.specimenTypeCode;
      return { ...item, specimenTypeCode };
    });
    dispatch({
      type: SPECIES_CODE_MAINTENANCE_LISTING.SUCCESS,
      payload: list,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: SPECIES_CODE_MAINTENANCE_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(speciesCodeListingService(), onPending, onSuccess, onError);
};

export const SPECIES_CODE_MAINTENANCE_DELETE = actionCreator('SPECIES_CODE_MAINTENANCE_DELETE');
export const deleteAction = ({ id }) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SPECIES_CODE_MAINTENANCE_DELETE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SPECIES_CODE_MAINTENANCE_DELETE.SUCCESS,
      payload: id,
    });
    dispatch(filterListingAction());
  };
  const onError = (error) => {
    dispatch({
      type: SPECIES_CODE_MAINTENANCE_DELETE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(speciesCodeDeleteService({ id }), onPending, onSuccess, onError);
};

export const SPECIES_CODE_MAINTENANCE_CREATE = actionCreator('SPECIES_CODE_MAINTENANCE_CREATE');
export const createAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SPECIES_CODE_MAINTENANCE_CREATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    const newId = data.speciesCodeVo.id;
    dispatch({
      type: SPECIES_CODE_MAINTENANCE_CREATE.SUCCESS,
      payload: { oldId: params.id, newId },
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: SPECIES_CODE_MAINTENANCE_CREATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(speciesCodeCreateService({ ...params, id: undefined, action: undefined }), onPending, onSuccess, onError);
};

export const SPECIES_CODE_MAINTENANCE_UPDATE = actionCreator('SPECIES_CODE_MAINTENANCE_UPDATE');
export const updateAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: SPECIES_CODE_MAINTENANCE_UPDATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: SPECIES_CODE_MAINTENANCE_UPDATE.SUCCESS,
      payload: params.id,
    });
    dispatch(filterListingAction());
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: SPECIES_CODE_MAINTENANCE_UPDATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(speciesCodeUpdateService({ ...params, action: undefined }), onPending, onSuccess, onError);
};

// Local Actions

export const SPECIES_CODE_MAINTENANCE_EDIT = 'SPECIES_CODE_MAINTENANCE_EDIT';
export const editAction = (id) => (dispatch) => {
  dispatch({
    type: SPECIES_CODE_MAINTENANCE_EDIT,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const SPECIES_CODE_MAINTENANCE_CANCEL_EDITING = 'SPECIES_CODE_MAINTENANCE_CANCEL_EDITING';
export const cancelEditAction = () => (dispatch) => {
  dispatch({
    type: SPECIES_CODE_MAINTENANCE_CANCEL_EDITING,
  });
  dispatch(filterListingAction());
};

export const SPECIES_CODE_MAINTENANCE_ADD = 'SPECIES_CODE_MAINTENANCE_ADD';
export const addAction = () => (dispatch) => {
  dispatch({
    type: SPECIES_CODE_MAINTENANCE_ADD,
    payload: defaultAddValue(),
  });
  dispatch(filterListingAction());
};

export const SPECIES_CODE_MAINTENANCE_REMOVE_ADD = 'SPECIES_CODE_MAINTENANCE_REMOVE_ADD';
export const removeAddAction = (id) => (dispatch) => {
  dispatch({
    type: SPECIES_CODE_MAINTENANCE_REMOVE_ADD,
    payload: id,
  });
  dispatch(filterListingAction());
};

export const SPECIES_CODE_MAINTENANCE_SET_VALUE = 'SPECIES_CODE_MAINTENANCE_SET_VALUE';
export const setValueAction = (params) => (dispatch) => {
  dispatch({
    type: SPECIES_CODE_MAINTENANCE_SET_VALUE,
    payload: params,
  });
  dispatch(filterListingAction());
};

export const SPECIES_CODE_MAINTENANCE_RESET_REDUCER = 'SPECIES_CODE_MAINTENANCE_RESET_REDUCER';
export const resetReducerAction = () => (dispatch) => {
  dispatch({
    type: SPECIES_CODE_MAINTENANCE_RESET_REDUCER,
  });
};
