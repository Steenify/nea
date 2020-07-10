import { nonAssignedFunctionsService, assignedFunctionsService, roleListingService, submitRoleFunctionService } from 'services/authentication-authorisation/role-function-mapping';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const defaultAddValue = () => ({
  roleName: '',
  roleDescription: '',
  remarks: '',
  functionList: [],
});

export const ROLE_FUNCTION_MAPPING_CREATE = actionCreator('ROLE_FUNCTION_MAPPING_CREATE');
export const createAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: ROLE_FUNCTION_MAPPING_CREATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: ROLE_FUNCTION_MAPPING_CREATE.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: ROLE_FUNCTION_MAPPING_CREATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(roleListingService(params), onPending, onSuccess, onError);
};

export const ROLE_FUNCTION_MAPPING_UPDATE = actionCreator('ROLE_FUNCTION_MAPPING_UPDATE');
export const updateAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: ROLE_FUNCTION_MAPPING_UPDATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: ROLE_FUNCTION_MAPPING_UPDATE.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: ROLE_FUNCTION_MAPPING_UPDATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(submitRoleFunctionService(params), onPending, onSuccess, onError);
};

export const ROLE_FUNCTION_MAPPING_NON_ASSIGNED_FUNCTIONS = actionCreator('ROLE_FUNCTION_MAPPING_NON_ASSIGNED_FUNCTIONS');
export const getNonAssignedFunctionsAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: ROLE_FUNCTION_MAPPING_NON_ASSIGNED_FUNCTIONS.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: ROLE_FUNCTION_MAPPING_NON_ASSIGNED_FUNCTIONS.SUCCESS,
      payload: data.functionNameList || [],
    });
    if (callback)
      callback(
        (data.functionNameList || []).map((item) => ({
          label: item.functionName,
          value: item.functionName,
        })),
      );
  };
  const onError = (error) => {
    dispatch({
      type: ROLE_FUNCTION_MAPPING_NON_ASSIGNED_FUNCTIONS.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(nonAssignedFunctionsService(params), onPending, onSuccess, onError);
};

export const ROLE_FUNCTION_MAPPING_ASSIGNED_FUNCTIONS = actionCreator('ROLE_FUNCTION_MAPPING_ASSIGNED_FUNCTIONS');
export const getAssignedFunctionsAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: ROLE_FUNCTION_MAPPING_ASSIGNED_FUNCTIONS.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: ROLE_FUNCTION_MAPPING_ASSIGNED_FUNCTIONS.SUCCESS,
      payload: data.functionNameList || [],
    });
    if (callback)
      callback(
        (data.functionNameList || []).map((item) => ({
          label: item.functionName,
          value: item.functionName,
        })),
      );
  };
  const onError = (error) => {
    dispatch({
      type: ROLE_FUNCTION_MAPPING_ASSIGNED_FUNCTIONS.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(assignedFunctionsService(params), onPending, onSuccess, onError);
};
