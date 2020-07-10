import { getLatestInspectionListingService } from 'services/vector-inspection';
import { actionCreator, sortFunc, filterFunc, actionTryCatchCreator } from 'utils';

const defaultFilterValue = {
  searchText: '',
  searchType: 'roadName',
  filterValue: {
    division: [],
    regionOffice: [],
    premisesType: [],
  },
  sort: {
    id: 'roadName',
    label: 'Road Name',
    desc: false,
  },
};

export const SET_DEFAULT_VALUE = 'SET_DEFAULT_VALUE_LATEST_INSPECTION';
export const setDefaultValueAction = (payload) => (dispatch) => {
  dispatch({
    type: SET_DEFAULT_VALUE,
    payload,
  });
};

export const LATEST_INSPECTION_LISTING_FILTER = 'LATEST_INSPECTION_LISTING_FILTER';
export const latestInspectionListingFilterAction = (filterData) => (dispatch, getState) => {
  const {
    vectorInspectionReducers: {
      latestInspectionListing: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: LATEST_INSPECTION_LISTING_FILTER,
    payload: filteredList,
  });
};

export const SORT = 'SORT_LATEST_INSPECTION';
export const sortAction = (sortValue) => (dispatch, getState) => {
  const {
    vectorInspectionReducers: {
      latestInspectionListing: {
        data: { list },
      },
    },
  } = getState();
  const sortedList = list.sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: SORT,
    payload: sortedList,
  });
};

export const GET_LATEST_INSPECTION_LISTING = actionCreator('GET_LATEST_INSPECTION_LISTING');
export const getLatestInspectionListingAction = (
  data = {
    searchType: 'string',
    searchKeyword: '',
    inspectionDateFrom: 'string',
    inspectionDateTo: 'string',
    propertyType: 'BLOCK || LANDED',
    regionOffice: 'string',
    divisions: ['string'],
    inspectors: ['string'],
  },
  filterData = defaultFilterValue,
) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GET_LATEST_INSPECTION_LISTING.PENDING,
    });
  };
  const onSuccess = (data) => {
    dispatch({
      type: GET_LATEST_INSPECTION_LISTING.SUCCESS,
      payload: data.inspections || [],
    });
    dispatch(latestInspectionListingFilterAction(filterData));
  };
  const onError = (error) => {
    dispatch({
      type: GET_LATEST_INSPECTION_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getLatestInspectionListingService(data), onPending, onSuccess, onError);
};
