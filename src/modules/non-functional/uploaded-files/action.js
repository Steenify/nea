import { getUploadedFilesService } from 'services/file-operation';
import { actionCreator, sortFunc, filterFunc, actionTryCatchCreator } from 'utils';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'fileName',
  filterValue: null,
  sortValue: {
    id: 'uploaded',
    label: 'Uploaded Date & Time',
    desc: true,
    combineDateTime: true,
  },
};

export const FILTER_UPLOADED_FILES = 'FILTER_UPLOADED_FILES';
export const filterListAction = (filterData) => (dispatch, getState) => {
  const {
    nonFunctionalReducers: {
      uploadedFiles: {
        data: { list },
      },
    },
  } = getState();
  const { sortValue } = filterData;
  const filteredList = list.filter((item) => filterFunc(item, filterData)).sort((a, b) => sortFunc(a, b, sortValue));

  dispatch({
    type: FILTER_UPLOADED_FILES,
    payload: filteredList,
  });
};

export const GET_UPLOADED_FILES = actionCreator('GET_UPLOADED_FILES');
export const getListAction = (params) => async (dispatch) => {
  const onPending = () => {
    dispatch({
      type: GET_UPLOADED_FILES.PENDING,
    });
  };
  const onSuccess = (data) => {
    const payload = data?.fileList || [];
    // const payload = list.map((item) => {
    //   const uploadedDate = dateStringFromDate(item.uploadedDate || '');
    //   return { ...item, uploadedDate };
    // });
    dispatch({
      type: GET_UPLOADED_FILES.SUCCESS,
      payload,
    });
    dispatch(filterListAction(defaultFilterValue));
  };
  const onError = (error) => {
    dispatch({
      type: GET_UPLOADED_FILES.ERROR,
      payload: error,
    });
  };
  await actionTryCatchCreator(getUploadedFilesService(params), onPending, onSuccess, onError);
};
