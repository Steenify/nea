import { sofListingService } from 'services/inspection-management/sof';
import { actionCreator, sortFunc, filterFunc, actionTryCatchCreator } from 'utils';

export const defaultFilterValue = {
  sortValue: {
    id: 'breedingDetectionDate',
    label: 'Breeding Detection Date',
    desc: false,
  },
  filterValue: null,
  datePickerValue: null,
  searchText: '',
  searchType: 'inspectionId',
};

export const EDIT_SOF_LISTING_FILTER = 'EDIT_SOF_LISTING_FILTER';
export const filterListAction = filterData => (dispatch, getState) => {
  const {
    vectorInspectionReducers: {
      editSof: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter(item => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: EDIT_SOF_LISTING_FILTER,
    payload: filteredList,
  });
};

export const EDIT_SOF_LISTING = actionCreator('EDIT_SOF_LISTING');
export const getListAction = params => async dispatch => {
  const onPending = () => {
    dispatch({
      type: EDIT_SOF_LISTING.PENDING,
    });
  };
  const onSuccess = data => {
    dispatch({
      type: EDIT_SOF_LISTING.SUCCESS,
      payload: data.inspections,
    });
    dispatch(filterListAction(defaultFilterValue));
  };
  const onError = error => {
    dispatch({
      type: EDIT_SOF_LISTING.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(sofListingService(params), onPending, onSuccess, onError);
};
