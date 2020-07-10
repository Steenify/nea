import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  EHI_GRAVITRAP_AUDIT: {
    QUERY_ADDITIONAL_LAPSE: { LISTING, SAVE, DELETE_BY_ID, DELETE_ALL },
    GET_LAPSE_LIST,
    UPLOAD_AD_HOC,
  },
} = API_URLS;

export const listingService = () => request({ ...LISTING });

export const saveService = (data) => request({ data, ...SAVE });

export const deleteByIdService = (data) => request({ data, ...DELETE_BY_ID });

export const deleteAllService = () => request({ ...DELETE_ALL });

export const uploadAdHocLapseService = (data = {}) => request({ data, ...UPLOAD_AD_HOC });

export const lapseListingService = (lapseType = '', getAllAdhocLapses = false) => request({ ...GET_LAPSE_LIST, data: { lapseType, getAllAdhocLapses } });
