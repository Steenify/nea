import { generateNoticeService, previewNoticeService } from 'services/vector-inspection';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const GENERATE_NOTICE = actionCreator('GENERATE_NOTICE_GENERATE_NOTICE');
export const generateNoticeAction = (data = {}, cb) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GENERATE_NOTICE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GENERATE_NOTICE.SUCCESS,
    });
    if (cb) cb(data);
  };
  const onError = (error) => {
    dispatch({
      type: GENERATE_NOTICE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(generateNoticeService(data), onPending, onSuccess, onError);
};

export const PREVIEW_NOTICE = actionCreator('GENERATE_NOTICE_PREVIEW_NOTICE');
export const previewNoticeAction = (data = {}, cb) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: PREVIEW_NOTICE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: PREVIEW_NOTICE.SUCCESS,
    });
    if (cb) cb(data?.noticeFile);
  };
  const onError = (error) => {
    dispatch({
      type: PREVIEW_NOTICE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(previewNoticeService(data), onPending, onSuccess, onError);
};
