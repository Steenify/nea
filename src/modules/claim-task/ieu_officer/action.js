import { form3CommonPoolService, form3ClaimService } from 'services/inspection-management/form3';
import { actionCreator, actionTryCatchCreator, filterFunc, sortFunc } from 'utils';

export const defaultFilterValue = {
  sortValue: {
    id: 'breedingDate',
    label: 'Breeding Date',
    desc: false,
  },
  region: '',
  searchType: 'address',
  searchText: '',
  datePickerValue: null,
  filterValue: null,
};

export const CLAIM_TASK_IEU_OFFICER_FILTER = 'CLAIM_TASK_IEU_OFFICER_FILTER';
export const sampleMyWorkspaceFilter = (data = defaultFilterValue) => (dispatch, getState) => {
  const {
    claimTaskReducers: {
      ieuOfficer: {
        data: { taskList },
      },
    },
  } = getState();
  const filterData = { ...defaultFilterValue, ...data };
  const { sortValue } = filterData;
  dispatch({
    type: CLAIM_TASK_IEU_OFFICER_FILTER,
    payload: taskList.sort((a, b) => sortFunc(a, b, sortValue)).filter((item) => filterFunc(item, filterData)),
  });
};

export const CLAIM_TASK_IEU_OFFICER_COMMON_POOL_LISTING = actionCreator('CLAIM_TASK_IEU_OFFICER_COMMON_POOL_LISTING');
export const form3CommonPoolAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: CLAIM_TASK_IEU_OFFICER_COMMON_POOL_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: CLAIM_TASK_IEU_OFFICER_COMMON_POOL_LISTING.SUCCESS,
      payload: data?.queryForm3VOs || [],
    });
    dispatch(sampleMyWorkspaceFilter());
  };
  const onError = (error) => {
    dispatch({
      type: CLAIM_TASK_IEU_OFFICER_COMMON_POOL_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(form3CommonPoolService(), onPending, onSuccess, onError);
};

export const CLAIM_TASK_IEU_OFFICER_CLAIM = actionCreator('CLAIM_TASK_IEU_OFFICER_CLAIM');
export const form3ClaimAction = (form3Ids = []) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: CLAIM_TASK_IEU_OFFICER_CLAIM.PENDING,
    });
  };
  const onSuccess = () => {
    dispatch({
      type: CLAIM_TASK_IEU_OFFICER_CLAIM.SUCCESS,
    });
    dispatch(form3CommonPoolAction());
  };
  const onError = (error) => {
    dispatch({
      type: CLAIM_TASK_IEU_OFFICER_CLAIM.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(form3ClaimService(form3Ids), onPending, onSuccess, onError);
};
