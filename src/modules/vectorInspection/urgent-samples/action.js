import { actionCreator, filterFunc, actionTryCatchCreator, sortFunc } from 'utils';
import { getUrgentSampleListingService, saveUrgentSampleService } from 'services/vector-inspection';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'inspectionId',
  datePickerValue: {},
  filterValue: null,
  sortValue: {
    id: 'breedingDetectionDate',
    label: 'Breeding Detection Date',
    desc: false,
  },
};

export const VECTOR_INSPECTION_GET_URGENT_SAMPLE_LISTING_FILTER = 'VECTOR_INSPECTION_GET_URGENT_SAMPLE_LISTING_FILTER';
export const getUrgentSampleListingFilterAction = (filterData = defaultFilterValue) => (dispatch, getState) => {
  const {
    sampleIdentificationReducers: {
      urgentSamples: {
        data: { samples },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredSamples = samples
    .filter(item => filterFunc(item, filterData))
    .sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: VECTOR_INSPECTION_GET_URGENT_SAMPLE_LISTING_FILTER,
    payload: filteredSamples,
  });
};

export const VECTOR_INSPECTION_GET_URGENT_SAMPLE_LISTING = actionCreator('VECTOR_INSPECTION_GET_URGENT_SAMPLE_LISTING');
export const getUrgentSampleListingAction = params => async dispatch => {
  const onPending = () => {
    dispatch({ type: VECTOR_INSPECTION_GET_URGENT_SAMPLE_LISTING.PENDING });
  };
  const onSuccess = data => {
    dispatch({
      type: VECTOR_INSPECTION_GET_URGENT_SAMPLE_LISTING.SUCCESS,
      payload: data.sampleIdentificationList,
    });

    dispatch(getUrgentSampleListingFilterAction());
  };
  const onError = error => {
    dispatch({ type: VECTOR_INSPECTION_GET_URGENT_SAMPLE_LISTING.ERROR, payload: error });
  };

  await actionTryCatchCreator(getUrgentSampleListingService(params), onPending, onSuccess, onError);
};

export const VECTOR_INSPECTION_SAVE_URGENT_SAMPLE = actionCreator('VECTOR_INSPECTION_SAVE_URGENT_SAMPLE');
export const saveUrgentAction = (params, callback) => async dispatch => {
  const onPending = () => {
    dispatch({ type: VECTOR_INSPECTION_SAVE_URGENT_SAMPLE.PENDING });
  };
  const onSuccess = data => {
    dispatch({
      type: VECTOR_INSPECTION_SAVE_URGENT_SAMPLE.SUCCESS,
      payload: data,
    });
    if (callback) callback();
  };
  const onError = error => {
    dispatch({ type: VECTOR_INSPECTION_SAVE_URGENT_SAMPLE.ERROR, payload: error });
  };

  await actionTryCatchCreator(saveUrgentSampleService(params), onPending, onSuccess, onError);
};
