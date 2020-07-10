import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';
import { dailyDeploymentListingService, uploadDailyDevelopmentService } from 'services/rodent-audit';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'technicianName',
  datePickerValue: null,
  filterValue: null,
  sortValue: {
    id: 'contractType',
    label: 'Contract Type',
    desc: false,
  },
};

export const RODENT_AUDIT_DAILY_DEPLOYMENT_FILTER = 'RODENT_AUDIT_DAILY_DEPLOYMENT_FILTER';
export const filterListAction = (filterData = defaultFilterValue) => (dispatch, getState) => {
  const {
    rodentAuditReducers: {
      dailyDeployment: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: RODENT_AUDIT_DAILY_DEPLOYMENT_FILTER,
    payload: filteredList,
  });
};

export const DAILY_DEVELOPMENT_LISTING = actionCreator('DAILY_DEVELOPMENT_LISTING');
export const dailyDeploymentListingAction = () => async (dispatch) => {
  const { PENDING, SUCCESS, ERROR } = DAILY_DEVELOPMENT_LISTING;

  const onPending = () => {
    dispatch({ type: PENDING });
  };
  const onSuccess = (res) => {
    dispatch({ type: SUCCESS, payload: res?.dailyDeployments || [] });

    dispatch(filterListAction());
  };
  const onError = (e) => {
    dispatch({ type: ERROR, payload: e });
  };
  await actionTryCatchCreator(dailyDeploymentListingService(), onPending, onSuccess, onError);
};

export const UPLOAD_DAILY_DEVELOPMENT = actionCreator('UPLOAD_DAILY_DEVELOPMENT');
export const uploadDailyDevelopmentAction = (data, callback) => async (dispatch) => {
  const { PENDING, SUCCESS, ERROR } = UPLOAD_DAILY_DEVELOPMENT;

  const onPending = () => {
    dispatch({ type: PENDING });
  };
  const onSuccess = (_res) => {
    dispatch({ type: SUCCESS });

    if (callback) callback(null);
  };
  const onError = (e) => {
    dispatch({ type: ERROR, payload: e });

    if (callback) callback(e);
  };
  await actionTryCatchCreator(uploadDailyDevelopmentService(data), onPending, onSuccess, onError);
};
