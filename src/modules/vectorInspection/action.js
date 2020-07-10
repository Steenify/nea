import { downloadApprovedNoticeService } from 'services/vector-inspection';
import { actionTryCatchCreator, actionCreator } from 'utils';

export const INITIAL_NOTICE_OF_ENTRY_DOWNLOAD = actionCreator('INITIAL_NOTICE_OF_ENTRY_DOWNLOAD');
export const downloadNoticeAction = (noticeFileIds = [], action = INITIAL_NOTICE_OF_ENTRY_DOWNLOAD, successHandler = () => {}) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: action.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: action.SUCCESS,
    });

    if (successHandler) {
      successHandler(data);
    }
  };
  const onError = (error) => {
    dispatch({
      type: action.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(downloadApprovedNoticeService({ noticeFileIds }), onPending, onSuccess, onError);
};
