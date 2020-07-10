import { listingService, saveService, deleteByIdService, deleteAllService, lapseListingService, uploadAdHocLapseService } from 'services/ehi-gravitrap-audit/upload-adhoc-lapse';
import { actionCreator, actionTryCatchCreator } from 'utils';
import { GRAVITRAP_TASK_TYPE } from 'constants/index';

export const LISTING = actionCreator('EHI_GRAVITRAP_AUDIT_AD_HOC_LAPSE_LISTING');
export const listingAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({ type: LISTING.PENDING });
  };
  const onSuccess = (data) => {
    const list = data?.ehiLapseRequestVOList || [];
    const payload = list.map((item) => ({
      ...item,
      ehiLapseFileList: item?.ehiLapseFileVOList || [],
    }));
    dispatch({
      type: LISTING.SUCCESS,
      payload,
    });
  };

  const onError = (error) => {
    dispatch({
      type: LISTING.ERROR,
      payload: error,
    });
  };

  await actionTryCatchCreator(listingService(), onPending, onSuccess, onError);
};

export const SAVE = actionCreator('EHI_GRAVITRAP_AUDIT_AD_HOC_LAPSE_SAVE');
export const saveAction = (request, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({ type: SAVE.PENDING });
  };
  const onSuccess = () => {
    dispatch({
      type: SAVE.SUCCESS,
    });

    if (callback) callback();
  };

  const onError = (error) => {
    dispatch({
      type: SAVE.ERROR,
      payload: error,
    });
  };

  await actionTryCatchCreator(saveService(request), onPending, onSuccess, onError);
};

export const DELETE_BY_ID = actionCreator('EHI_GRAVITRAP_AUDIT_AD_HOC_LAPSE_DELETE_BY_ID');
export const deleteByIdAction = (lapseId, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({ type: DELETE_BY_ID.PENDING });
  };
  const onSuccess = (data) => {
    dispatch({ type: DELETE_BY_ID.SUCCESS });
    if (callback) callback(data);
  };

  const onError = (error) => {
    dispatch({
      type: DELETE_BY_ID.ERROR,
      payload: error,
    });
  };

  await actionTryCatchCreator(deleteByIdService({ lapseId }), onPending, onSuccess, onError);
};

export const DELETE_ALL = actionCreator('EHI_GRAVITRAP_AUDIT_AD_HOC_LAPSE_DELETE_ALL');
export const deleteAllAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({ type: DELETE_ALL.PENDING });
  };
  const onSuccess = () => {
    dispatch({
      type: DELETE_ALL.SUCCESS,
      payload: [],
    });
  };

  const onError = (error) => {
    dispatch({
      type: DELETE_ALL.ERROR,
      payload: error,
    });
  };

  await actionTryCatchCreator(deleteAllService(), onPending, onSuccess, onError);
};

export const UPLOAD_LAPSE = actionCreator('EHI_GRAVITRAP_AUDIT_AD_HOC_LAPSE_UPLOAD');
export const uploadLapsesAction = (uploadVOs = [], callback, errorCallback) => async (dispatch) => {
  const onPending = () => {
    dispatch({ type: UPLOAD_LAPSE.PENDING });
  };
  const onSuccess = (data) => {
    dispatch({
      type: UPLOAD_LAPSE.SUCCESS,
      payload: [],
    });
    if (callback) callback(data);
  };

  const onError = (error) => {
    dispatch({
      type: UPLOAD_LAPSE.ERROR,
      payload: error,
    });
    if (errorCallback) errorCallback(error);
  };

  await actionTryCatchCreator(uploadAdHocLapseService({ uploadVOs }), onPending, onSuccess, onError);
};

export const LAPSE_LISTING = actionCreator('EHI_GRAVITRAP_AUDIT_AD_HOC_LAPSE_LOV_LISTING');
export const lapseListingAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({ type: LAPSE_LISTING.PENDING });
  };
  const onSuccess = (data) => {
    const list = data?.ehiLapseRequestVOList || [];
    const payload = list?.map(({ lapseCode, lapseDescription }) => ({ value: lapseCode, label: lapseDescription })) || [];
    dispatch({
      type: LAPSE_LISTING.SUCCESS,
      payload,
    });
  };

  const onError = (error) => {
    dispatch({
      type: LAPSE_LISTING.ERROR,
      payload: error,
    });
  };

  await actionTryCatchCreator(lapseListingService(GRAVITRAP_TASK_TYPE.AD_HOC), onPending, onSuccess, onError);
};
