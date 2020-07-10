import { insertNoticeService } from 'services/vector-inspection';
import { actionCreator, actionTryCatchCreator } from 'utils';

export const INSERT_NOTICE = actionCreator('INSERT_NOTICE_INSERT_NOTICE');
export const insertNoticeAction = (
  data = {
    noticeType: '',
    postalCode: '',
    blockHouseNo: '',
    approver: '',
    notices: [],
  },
  callback,
) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: INSERT_NOTICE.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: INSERT_NOTICE.SUCCESS,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: INSERT_NOTICE.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(insertNoticeService(data), onPending, onSuccess, onError);
};
