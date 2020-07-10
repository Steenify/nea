import { getBlockChartData, getLatestBlockChartData, getApprovedNoticeService } from 'services/vector-inspection';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const GET_BLOCK_CHART = actionCreator('GET_BLOCK_CHART');
export const getBlockChartAction = (data = {}, fromLatest = false) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GET_BLOCK_CHART.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GET_BLOCK_CHART.SUCCESS,
      payload: data.blockChart,
    });
  };
  const onError = (error) => {
    dispatch({
      type: GET_BLOCK_CHART.ERROR,
      payload: error,
    });
  };
  if (fromLatest) {
    await actionTryCatchCreator(getLatestBlockChartData(data), onPending, onSuccess, onError);
  } else {
    await actionTryCatchCreator(getBlockChartData(data), onPending, onSuccess, onError);
  }
};

export const VIEW_APPROVED_NOTICE = actionCreator('BLOCK_CHART_VIEW_APPROVED_NOTICE');
export const getApprovedNoticeAction = (data = {}, onSuccessHandler) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: VIEW_APPROVED_NOTICE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: VIEW_APPROVED_NOTICE.SUCCESS,
    });
    const notices = data?.notices || [];
    if (onSuccessHandler) onSuccessHandler(notices);
  };
  const onError = (error) => {
    dispatch({
      type: VIEW_APPROVED_NOTICE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getApprovedNoticeService(data), onPending, onSuccess, onError);
};
