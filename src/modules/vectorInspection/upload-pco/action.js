import { uploadTownCouncilFineRegimePCOService } from 'services/inspection-management/town-council-fine-regime';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const PCO_UPLOAD = actionCreator('TC_FINE_REGIME_PCO_UPLOAD');
export const pcoUploadAction = (data = {}, callback, errorCallback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: PCO_UPLOAD.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: PCO_UPLOAD.SUCCESS,
      payload: data,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: PCO_UPLOAD.ERROR,
      payload: error,
    });
    if (errorCallback) errorCallback(error);
  };
  await actionTryCatchCreator(uploadTownCouncilFineRegimePCOService(data), onPending, onSuccess, onError);
};
