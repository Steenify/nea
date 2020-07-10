import { getBulkFindingService, downloadBulkFindingService } from 'services/epi-investigation/case';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const LISTING = actionCreator('EPI_COB1_GET_BULK_FINDING');
export const getBulkFindingAction = params => async dispatch => {
  const onPending = () => {
    dispatch({
      type: LISTING.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: LISTING.SUCCESS,
      payload: data?.epiFindingVOs || [],
    });
  };
  const onError = error => {
    dispatch({
      type: LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getBulkFindingService(params), onPending, onSuccess, onError);
};

export const DOWNLOAD = actionCreator('EPI_COB1_DOWNLOAD_BULK_FINDING');
export const downloadBulkFindingAction = (params, callback = () => {}) => async dispatch => {
  const onPending = () => {
    dispatch({
      type: DOWNLOAD.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: DOWNLOAD.SUCCESS,
    });
    const file = data?.epiFindingVO?.epiFindingFile || [];
    const mineType = data?.epiFindingVO?.mineType || '';
    callback(file, mineType);
  };
  const onError = error => {
    dispatch({
      type: DOWNLOAD.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(downloadBulkFindingService(params), onPending, onSuccess, onError);
};
