import { generateNoticeService } from 'services/vector-inspection';
import { actionCreator, actionTryCatchCreator } from 'utils';
import { downloadNoticeAction } from '../action';

export const DOWNLOAD = actionCreator('PRINT_CALL_DOWNLOAD_NOTICE_OF_ENTRY');
export const PRINT_CALL_LETTER_GENERATE = actionCreator('PRINT_CALL_LETTER_GENERATE');
export const generateCLAction = (data = {}, onSuccessHandler = () => {}) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: PRINT_CALL_LETTER_GENERATE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: PRINT_CALL_LETTER_GENERATE.SUCCESS,
    });
    const noticeFileIds = data?.noticeFileIds || [];
    if (noticeFileIds.length > 0) {
      dispatch(downloadNoticeAction(noticeFileIds, DOWNLOAD, onSuccessHandler));
    }
  };
  const onError = (error) => {
    dispatch({
      type: PRINT_CALL_LETTER_GENERATE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(generateNoticeService(data), onPending, onSuccess, onError);
};
