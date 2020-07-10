import { getApprovedNoticeService } from 'services/vector-inspection';
import { actionCreator, sortFunc, filterFunc, actionTryCatchCreator } from 'utils';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'unit',
  datePickerValue: {},
  filterValue: null,
  sortValue: {
    id: 'unit',
    label: 'Unit',
    desc: false,
  },
};

export const FILTER_ACTION = 'NOTICE_OF_ENTRY_FILTER';
export const filterAction = (filterData = defaultFilterValue) => (dispatch, getState) => {
  const {
    vectorInspectionReducers: {
      noticeOfEntry: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));
  dispatch({
    type: FILTER_ACTION,
    payload: filteredList,
  });
};

export const NOTICE_OF_ENTRY_DOWNLOAD = actionCreator('NOTICE_OF_ENTRY_DOWNLOAD');
export const VIEW_APPROVED_NOTICE = actionCreator('NOTICE_OF_ENTRY_VIEW_APPROVED_');
export const getApprovedNoticeAction = (data = {}, onSuccessHandler) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: VIEW_APPROVED_NOTICE.PENDING,
    });
  };
  const onSuccess = (data) => {
    const notices = data?.notices || [];
    const payload = notices.map((item) => {
      const { inspectionTimeFrom = '', inspectionTimeTo = '' } = item;
      const timeDesc = [inspectionTimeFrom, inspectionTimeTo].filter((item) => item).join(' to ');
      return { ...item, timeDesc };
    });
    dispatch({
      type: VIEW_APPROVED_NOTICE.SUCCESS,
      payload,
    });
    dispatch(filterAction());
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
