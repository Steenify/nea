import { sortFunc, filterFunc, actionCreator, actionTryCatchCreator } from 'utils';
import { optionalInstanceCfgListingService, saveOptionalInstanceCfgService } from 'services/rodent-audit';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'createdBy',
  datePickerValue: null,
  filterValue: null,
  sortValue: {
    id: 'crcInstance',
    label: 'CRC Instance',
    desc: false,
  },
};

export const OPTIONAL_INSTANCE_CFG_FILTER = 'OPTIONAL_INSTANCE_CFG_FILTER';
export const filterListAction = (filterData = defaultFilterValue) => (dispatch, getState) => {
  const {
    rodentAuditReducers: {
      optionalTaskLDConfiguration: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: OPTIONAL_INSTANCE_CFG_FILTER,
    payload: filteredList,
  });
};

export const OPTIONAL_INSTANCE_CFG_LISTING = actionCreator('OPTIONAL_INSTANCE_CFG_LISTING');
export const optionalInstanceCfgListingAction = () => async (dispatch) => {
  const { PENDING, SUCCESS, ERROR } = OPTIONAL_INSTANCE_CFG_LISTING;

  const onPending = () => {
    dispatch({
      type: PENDING,
    });
  };

  const onSuccess = (res) => {
    dispatch({ type: SUCCESS, payload: res?.optionalInctanceCfgHistory || [] });

    dispatch(filterListAction());
  };

  const onError = (error) => {
    console.error(error);

    dispatch({ type: ERROR });
  };

  await actionTryCatchCreator(optionalInstanceCfgListingService(), onPending, onSuccess, onError);
};

export const SAVE_OPTIONAL_INSTANCE_CFG = actionCreator('SAVE_OPTIONAL_INSTANCE_CFG');
export const saveOptionalInstanceCfgAction = (data = {}, callback) => async (dispatch) => {
  const { PENDING, SUCCESS, ERROR } = SAVE_OPTIONAL_INSTANCE_CFG;

  const onPending = () => dispatch({ type: PENDING });

  const onSuccess = () => {
    dispatch({ type: SUCCESS });

    if (callback) callback(null);
  };

  const onError = (error) => {
    console.error(error);

    dispatch({ type: ERROR });

    if (callback) callback(error);
  };

  await actionTryCatchCreator(saveOptionalInstanceCfgService(data), onPending, onSuccess, onError);
};
