import { manpowerListingService, uploadRodentContractManpowerListService } from 'services/rodent-audit';
import { actionCreator, sortFunc, filterFunc, actionTryCatchCreator } from 'utils';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'companyName',
  datePickerValue: null,
  filterValue: null,
  sortValue: {
    id: 'submittedDate',
    label: 'Date Submitted',
    desc: false,
  },
};

export const RODENT_AUDIT_MANPOWER_FILTER = 'RODENT_AUDIT_MANPOWER_FILTER';
export const filterListAction = (filterData = defaultFilterValue) => (dispatch, getState) => {
  const {
    rodentAuditReducers: {
      manpowerList: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: RODENT_AUDIT_MANPOWER_FILTER,
    payload: filteredList,
  });
};

export const RODENT_AUDIT_MANPOWER_LISTING = actionCreator('RODENT_AUDIT_MANPOWER_LISTING');
export const getListAction = (data = {}) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: RODENT_AUDIT_MANPOWER_LISTING.PENDING,
    });
  };
  const onSuccess = (res) => {
    dispatch({
      type: RODENT_AUDIT_MANPOWER_LISTING.SUCCESS,
      payload: res.manpowerLists || [],
    });
    dispatch(filterListAction());
  };
  const onError = (error) => {
    dispatch({
      type: RODENT_AUDIT_MANPOWER_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(manpowerListingService(data), onPending, onSuccess, onError);
};

export const UPLOAD_ROD_CONTRACT_MANPOWER_LIST = actionCreator('UPLOAD_ROD_CONTRACT_MANPOWER_LIST');
export const uploadRodentContractManpowerListAction = (data, callback) => async (dispatch) => {
  const { PENDING, SUCCESS, ERROR } = UPLOAD_ROD_CONTRACT_MANPOWER_LIST;
  const onPending = () => {
    dispatch({ type: PENDING });
  };
  const onSuccess = () => {
    dispatch({ type: SUCCESS });

    if (callback) callback(null);
  };
  const onError = (e) => {
    dispatch({ type: ERROR });

    if (callback) callback(e);
  };
  await actionTryCatchCreator(uploadRodentContractManpowerListService(data), onPending, onSuccess, onError);
};
