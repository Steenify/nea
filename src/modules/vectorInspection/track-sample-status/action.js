import { actionCreator, filterFunc, actionTryCatchCreator, sortFunc } from 'utils';
import { getTrackListingService, saveUrgentSampleService } from 'services/vector-inspection';
import moment from 'moment';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'inspectionId',
  datePickerValue: {
    startDate: moment().startOf('day'),
    endDate: moment().endOf('day'),
    selectedValue: 'breeding',
  },
  filterValue: null,
  sortValue: {
    id: 'breedingDetectionDate',
    label: 'Breeding Detection Date',
    desc: false,
  },
};

export const VECTOR_INSPECTION_GET_TRACK_LISTING_FILTER = 'VECTOR_INSPECTION_GET_TRACK_LISTING_FILTER';
export const getTrackListingFilterAction = (filterData = defaultFilterValue) => (dispatch, getState) => {
  const {
    sampleIdentificationReducers: {
      trackSampleStatus: {
        data: { samples },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredSamples = samples.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: VECTOR_INSPECTION_GET_TRACK_LISTING_FILTER,
    payload: filteredSamples,
  });
};

export const VECTOR_INSPECTION_GET_TRACK_LISTING = actionCreator('VECTOR_INSPECTION_GET_TRACK_LISTING');
export const getTrackListingAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({ type: VECTOR_INSPECTION_GET_TRACK_LISTING.PENDING });
  };
  const onSuccess = (data) => {
    dispatch({
      type: VECTOR_INSPECTION_GET_TRACK_LISTING.SUCCESS,
      payload: data,
    });

    dispatch(getTrackListingFilterAction());
  };
  const onError = (error) => {
    dispatch({ type: VECTOR_INSPECTION_GET_TRACK_LISTING.ERROR, payload: error });
  };

  await actionTryCatchCreator(getTrackListingService(params), onPending, onSuccess, onError);
};

export const VECTOR_INSPECTION_SAMPLE_TRACK_SAVE_URGENT = actionCreator('VECTOR_INSPECTION_SAMPLE_TRACK_SAVE_URGENT');
export const saveUrgentAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({ type: VECTOR_INSPECTION_SAMPLE_TRACK_SAVE_URGENT.PENDING });
  };
  const onSuccess = (data) => {
    dispatch({
      type: VECTOR_INSPECTION_SAMPLE_TRACK_SAVE_URGENT.SUCCESS,
      payload: data,
    });
  };
  const onError = (error) => {
    dispatch({ type: VECTOR_INSPECTION_SAMPLE_TRACK_SAVE_URGENT.ERROR, payload: error });
  };

  await actionTryCatchCreator(saveUrgentSampleService(params), onPending, onSuccess, onError);
};
