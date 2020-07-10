import { getBlockLandedDetailService, getLatestLandedDetailService } from 'services/vector-inspection';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const GET_BLOCK_SUMMARY_LANDED_DETAIL = actionCreator('GET_BLOCK_SUMMARY_LANDED_DETAIL');
export const getBlockSummaryDetailAction = (data = { inspectionDateFrom: 'string', inspectionDateTo: 'string', postalCode: 'string', blockHouseNo: 'string' }, fromLatest = false) => async (
  dispatch,
) => {
  const onPending = () => {
    dispatch({
      type: GET_BLOCK_SUMMARY_LANDED_DETAIL.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GET_BLOCK_SUMMARY_LANDED_DETAIL.SUCCESS,
      payload: data,
    });
  };
  const onError = (error) => {
    dispatch({
      type: GET_BLOCK_SUMMARY_LANDED_DETAIL.ERROR,
      payload: error,
    });
  };
  if (fromLatest) {
    await actionTryCatchCreator(getLatestLandedDetailService(data), onPending, onSuccess, onError);
  } else {
    await actionTryCatchCreator(getBlockLandedDetailService(data), onPending, onSuccess, onError);
  }
};

export const DOWNLOAD_NOTICE = actionCreator('LANDED_DETAIL_DOWNLOAD_NOTICE');
