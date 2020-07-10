import { getBlockDetailService, getLatestBlockDetailService } from 'services/vector-inspection';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const GET_BLOCK_SUMMARY_DETAIL = actionCreator('GET_BLOCK_SUMMARY_DETAIL');
export const getBlockSummaryDetailAction = (
  data = {
    inspectionDateFrom: 'string',
    inspectionDateTo: 'string',
    postalCode: 'string',
    blockHouseNo: 'string',
    floorNo: 'string',
    unitNo: 'string',
  },
  fromLatest = false,
) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GET_BLOCK_SUMMARY_DETAIL.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GET_BLOCK_SUMMARY_DETAIL.SUCCESS,
      payload: data,
    });
  };
  const onError = (error) => {
    dispatch({
      type: GET_BLOCK_SUMMARY_DETAIL.ERROR,
      payload: error,
    });
  };
  if (fromLatest) {
    await actionTryCatchCreator(getLatestBlockDetailService(data), onPending, onSuccess, onError);
  } else {
    await actionTryCatchCreator(getBlockDetailService(data), onPending, onSuccess, onError);
  }
};

export const DOWNLOAD_NOTICE = actionCreator('BLOCK_SUMMARY_DETAIL_DOWNLOAD_NOTICE');
