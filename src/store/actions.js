import { getMasterCodeListLOVService, MASTER_CODE } from 'services/masterCode';
import { getAllFunctionsForRoleService } from 'services';

import { inAppNotificationDownloadService, inAppNotificationListService, inAppNotificationViewService, inAppNotificationUpdateService, broadcastOnlineMessageService } from 'services/non-functional';
import { logoutService } from 'services/ana';
import { actionCreator, actionTryCatchCreator, byteArrayToBase64, autoGenerateDownloadLink } from 'utils';

import history from '../custom-history';

export { MASTER_CODE };

export const GLOBAL_ACTIONS = {
  TOGGLE_MENU: 'TOGGLE_MENU',
  CHANGE_FONT_SIZE: 'CHANGE_FONT_SIZE',
  UPDATE_USER_ROLE: 'UPDATE_USER_ROLE',
};

export const ACTION_TYPES = {
  ADD: 'ADD',
  EDIT: 'EDIT',
  NONE: 'NONE',
};

export const toggleMenu = () => (dispatch) => {
  dispatch({
    type: GLOBAL_ACTIONS.TOGGLE_MENU,
  });
};

export const changeFontsize = (payload) => (dispatch) => {
  dispatch({
    type: GLOBAL_ACTIONS.CHANGE_FONT_SIZE,
    payload,
  });
};

export const updateUserRole = (payload) => (dispatch) => {
  dispatch({
    type: GLOBAL_ACTIONS.UPDATE_USER_ROLE,
    payload,
  });
};

export const GLOBAL_ALL_RESET_REDUCER = 'GLOBAL_ALL_RESET_REDUCER';
export const resetGlobalReducerAction = () => (dispatch) => {
  dispatch({
    type: GLOBAL_ALL_RESET_REDUCER,
  });
};

export const GLOBAL_LOAD_MASTER_CODE = actionCreator('GLOBAL_LOAD_MASTER_CODE');
export const getMastercodeAction = (mastCodeList, mastCodeSortSeqList, allLov, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GLOBAL_LOAD_MASTER_CODE.PENDING,
    });
  };
  const onSuccess = (data) => {
    const codeList = data?.map?.((code) => code.mastCdVo) || [];
    const masterCode = {};
    codeList.forEach((code) => {
      masterCode[code.mastCode] = (code.mastCdDetList || []).map((item) => ({ label: item.codeDesc, value: item.code }));
    });
    dispatch({
      type: GLOBAL_LOAD_MASTER_CODE.SUCCESS,
      payload: masterCode,
    });
    if (callback) callback(masterCode);
  };
  const onError = (error) => {
    dispatch({
      type: GLOBAL_LOAD_MASTER_CODE.ERROR,
      payload: error,
    });
    history.push('/blocked');
  };
  await actionTryCatchCreator(getMasterCodeListLOVService(mastCodeList, mastCodeSortSeqList, allLov), onPending, onSuccess, onError);
};

export const GLOBAL_ALL_FUNCTIONS_FOR_ROLE = actionCreator('GLOBAL_ALL_FUNCTIONS_FOR_ROLE');
export const getAllFunctionsForRoleAction = (callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GLOBAL_ALL_FUNCTIONS_FOR_ROLE.PENDING,
    });
  };
  const onSuccess = (data) => {
    const functionNameList = data.functionNameList || [];
    const commonPoolList = data.commonPoolList || [];
    const workspaceList = data.workspaceList || [];
    const fullName = data.fullName || '';
    dispatch({
      type: GLOBAL_ALL_FUNCTIONS_FOR_ROLE.SUCCESS,
      payload: data,
    });
    const functionList = [...functionNameList, ...commonPoolList, ...workspaceList];
    if (callback) {
      callback(
        functionList.map((functionRole) => functionRole.functionName),
        fullName,
      );
    }
    if (!functionList.length) {
      history.push('/blocked');
    }
  };
  const onError = (error) => {
    dispatch({
      type: GLOBAL_ALL_FUNCTIONS_FOR_ROLE.ERROR,
      payload: error,
    });
    // if (callback) callback();
    history.push('/blocked');
  };
  await actionTryCatchCreator(getAllFunctionsForRoleService(), onPending, onSuccess, onError, true);
};

export const GLOBAL_IN_APP_NOTIFICATION_LIST = actionCreator('GLOBAL_IN_APP_NOTIFICATION_LIST');
export const listInAppNotificationAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GLOBAL_IN_APP_NOTIFICATION_LIST.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GLOBAL_IN_APP_NOTIFICATION_LIST.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: GLOBAL_IN_APP_NOTIFICATION_LIST.ERROR,
      payload: error,
    });
    if (callback) callback();
  };
  await actionTryCatchCreator(inAppNotificationListService(params), onPending, onSuccess, onError);
};

export const GLOBAL_IN_APP_NOTIFICATION_VIEW = actionCreator('GLOBAL_IN_APP_NOTIFICATION_VIEW');
export const viewInAppNotificationAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GLOBAL_IN_APP_NOTIFICATION_VIEW.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GLOBAL_IN_APP_NOTIFICATION_VIEW.SUCCESS,
      payload: data,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: GLOBAL_IN_APP_NOTIFICATION_VIEW.ERROR,
      payload: error,
    });
    if (callback) callback(error);
  };

  await actionTryCatchCreator(inAppNotificationViewService(params), onPending, onSuccess, onError);
};

export const GLOBAL_IN_APP_NOTIFICATION_UPDATE = actionCreator('GLOBAL_IN_APP_NOTIFICATION_UPDATE');
export const updateInAppNotificationAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GLOBAL_IN_APP_NOTIFICATION_UPDATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GLOBAL_IN_APP_NOTIFICATION_UPDATE.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: GLOBAL_IN_APP_NOTIFICATION_UPDATE.ERROR,
      payload: error,
    });
    if (callback) callback();
  };
  await actionTryCatchCreator(inAppNotificationUpdateService(params), onPending, onSuccess, onError);
};

export const GLOBAL_IN_APP_NOTIFICATION_DOWNLOAD = actionCreator('GLOBAL_IN_APP_NOTIFICATION_DOWNLOAD');
export const downloadInAppNotificationAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GLOBAL_IN_APP_NOTIFICATION_DOWNLOAD.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GLOBAL_IN_APP_NOTIFICATION_DOWNLOAD.SUCCESS,
      payload: data,
    });
    const base64 = byteArrayToBase64(data?.file || []);
    autoGenerateDownloadLink(`${data?.fileName}`, data.fileType, base64);
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: GLOBAL_IN_APP_NOTIFICATION_DOWNLOAD.ERROR,
      payload: error,
    });
    if (callback) callback();
  };
  await actionTryCatchCreator(inAppNotificationDownloadService(params), onPending, onSuccess, onError);
};

export const GLOBAL_BROADCAST_ONLINE_MESSAGE = actionCreator('GLOBAL_BROADCAST_ONLINE_MESSAGE');
export const getBroadcastOnlineMessageAction = (params, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GLOBAL_BROADCAST_ONLINE_MESSAGE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GLOBAL_BROADCAST_ONLINE_MESSAGE.SUCCESS,
      payload: data.messagesList || [],
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: GLOBAL_BROADCAST_ONLINE_MESSAGE.ERROR,
      payload: error,
    });
    if (callback) callback();
  };
  await actionTryCatchCreator(broadcastOnlineMessageService(params), onPending, onSuccess, onError);
};

export const GLOBAL_BROADCAST_ONLINE_MESSAGE_TOGGLE = 'GLOBAL_BROADCAST_ONLINE_MESSAGE_TOGGLE';
export const toggleBroadcastOnlineMessageAction = (_params, _callback) => (dispatch) => {
  dispatch({
    type: GLOBAL_BROADCAST_ONLINE_MESSAGE_TOGGLE,
  });
};

export const GLOBAL_LOG_OUT = actionCreator('GLOBAL_LOG_OUT');
export const logoutAction = (callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GLOBAL_LOG_OUT.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GLOBAL_LOG_OUT.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = (error) => {
    dispatch({
      type: GLOBAL_LOG_OUT.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(logoutService(), onPending, onSuccess, onError);
};
