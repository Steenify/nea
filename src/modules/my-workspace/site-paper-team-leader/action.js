import { actionCreator, actionTryCatchCreator } from 'utils';
import { supportLDService } from 'services/site-paper-gravitrap-audit';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'id',
  datePickerValue: {},
  filterValue: null,
  sortValue: {
    id: 'mappedWeek',
    label: 'Eweek',
    desc: false,
    sortType: 'number',
  },
};

export const CHANGE_LD_STATUS = actionCreator('SITE_PAPER_CHANGE_LD_STATUS');
export const supportRejectLDAction = (params = {}, callback) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: CHANGE_LD_STATUS.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: CHANGE_LD_STATUS.SUCCESS,
    });
    if (callback) callback(data);
  };
  const onError = (error) => {
    dispatch({
      type: CHANGE_LD_STATUS.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(supportLDService(params), onPending, onSuccess, onError);
};
