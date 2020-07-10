import { getGroundSurveillanceListingService } from 'services/inspection-management/surveillance-for-red-cluster';
import { actionCreator, sortFunc, filterFunc, actionTryCatchCreator } from 'utils';

export const defaultFilterValue = {
  sortValue: {
    id: 'rccId',
    label: 'RCC ID',
    desc: true,
  },
  searchText: '',
  searchType: 'rccId',
};

export const GROUND_SURVEILLANCE_LISTING_FILTER = 'GROUND_SURVEILLANCE_LISTING_FILTER';
export const groundSurveillanceListingFilterAction = (filterData) => (dispatch, getState) => {
  const {
    vectorInspectionReducers: {
      groundSurveillanceListing: {
        data: { clusters },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = clusters.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: GROUND_SURVEILLANCE_LISTING_FILTER,
    payload: filteredList,
  });
};

export const GET_GROUND_SURVEILLANCE_LISTING = actionCreator('GET_GROUND_SURVEILLANCE_LISTING');
export const getGroundSurveillanceListingAction = () => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GET_GROUND_SURVEILLANCE_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GET_GROUND_SURVEILLANCE_LISTING.SUCCESS,
      payload: data,
    });
    dispatch(groundSurveillanceListingFilterAction(defaultFilterValue));
  };
  const onError = (error) => {
    dispatch({
      type: GET_GROUND_SURVEILLANCE_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getGroundSurveillanceListingService(), onPending, onSuccess, onError);
};
