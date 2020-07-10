import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const { VECTOR_INSPECTION, INSPECTION_MANAGEMENT } = API_URLS;

export const getDefaultBarcodeQuantityService = (data = {}) =>
  request({
    data,
    ...VECTOR_INSPECTION.DEFAULT_BARCODE_QUANTITY,
  });

export const generateBarcodeService = (data = {}) =>
  request({
    data,
    ...VECTOR_INSPECTION.GENERATE_BARCODE,
  });

export const getLatestInspectionListingService = (data = {}) =>
  request({
    data,
    ...VECTOR_INSPECTION.GET_LATEST_INSPECTION_LISTING,
  });

export const getQueryInspectionFormDetail = (
  data = {
    object: {
      value: {
        inspectionId: 'VC-20215-11700',
      },
    },
  },
) =>
  request({
    data,
    ...VECTOR_INSPECTION.GET_QUERY_INSPECTION_FORM_DETAIL,
  });

export const getQueryInspectionFormStatuses = (data) =>
  request({
    data,
    ...INSPECTION_MANAGEMENT.QUERY_NON_RODENT_INSPECTION,
  });

export const getDepositListingService = () =>
  request({
    ...VECTOR_INSPECTION.GET_DEPOSIT_LISTING,
  });

export const getSendListingService = () =>
  request({
    ...VECTOR_INSPECTION.GET_SEND_LISTING,
  });

export const validateBarcodeDepositService = (data = { barcodeId: 'string' }) =>
  request({
    data,
    ...VECTOR_INSPECTION.VALIDATE_BARCODE_DEPOSIT,
  });

export const validateBarcodeSendService = (data = { barcodeId: 'string' }) =>
  request({
    data,
    ...VECTOR_INSPECTION.VALIDATE_BARCODE_SEND,
  });

export const submitDepositService = (
  data = {
    samples: [
      {
        barcodeId: 'string',
        rejectReasonCode: 'string',
        rejectReasonOther: 'string',
        rejectFileIds: ['string'],
      },
    ],
  },
) =>
  request({
    data,
    ...VECTOR_INSPECTION.SUBMIT_DEPOSIT,
  });

export const submitSendService = (
  data = {
    samples: [
      {
        barcodeId: 'string',
        rejectReasonCode: 'string',
        rejectReasonOther: 'string',
        rejectFileIds: ['string'],
      },
    ],
  },
) =>
  request({
    data,
    ...VECTOR_INSPECTION.SUBMIT_SEND,
  });

export const getBlockSummaryList = (data) =>
  request({
    data,
    ...VECTOR_INSPECTION.BLOCK_SUMMARY_LISTING,
  });

export const getBlockChartData = (data = {}) =>
  request({
    data,
    ...VECTOR_INSPECTION.BLOCK_SUMMARY_BLOCK_BLOCK_CHART,
  });

export const getLatestBlockChartData = (data = {}) =>
  request({
    data,
    ...VECTOR_INSPECTION.LATEST_BLOCK_SUMMARY_BLOCK_BLOCK_CHART,
  });

export const getTrackListingService = (data = { startDate: 'string', endDate: 'string' }) =>
  request({
    data,
    ...VECTOR_INSPECTION.SAMPLE_TRACK_LISTING,
  });

export const getUrgentSampleListingService = (data) =>
  request({
    data,
    ...VECTOR_INSPECTION.URGENT_SAMPLE_LISTING,
  });

export const saveUrgentSampleService = (data) =>
  request({
    data,
    ...VECTOR_INSPECTION.SAMPLE_TRACK_SAVE_URGENT,
  });

export const getBreedingSummaryService = (data = {}) =>
  request({
    data,
    ...VECTOR_INSPECTION.BLOCK_SUMMARY_BLOCK_BREEDING,
  });

export const getLatestBreedingSummaryService = (data = {}) =>
  request({
    data,
    ...VECTOR_INSPECTION.LATEST_BLOCK_SUMMARY_BLOCK_BREEDING,
  });

export const getBlockDetailService = (data = {}) =>
  request({
    data,
    ...VECTOR_INSPECTION.BLOCK_SUMMARY_BLOCK_DETAIL,
  });

export const getBlockLandedDetailService = (data = {}) =>
  request({
    data,
    ...VECTOR_INSPECTION.BLOCK_SUMMARY_LANDED_DETAIL,
  });
export const getLatestBlockDetailService = (data = {}) =>
  request({
    data,
    ...VECTOR_INSPECTION.LATEST_BLOCK_SUMMARY_BLOCK_DETAIL,
  });
export const getLatestLandedDetailService = (data = {}) =>
  request({
    data,
    ...VECTOR_INSPECTION.LATEST_BLOCK_SUMMARY_LANDED_DETAIL,
  });

export const getApprovedNoticeService = (data = {}) =>
  request({
    data,
    ...VECTOR_INSPECTION.VIEW_APPROVED_INSPECTION_NOTICE,
  });

export const downloadApprovedNoticeService = (data = {}) =>
  request({
    data,
    ...VECTOR_INSPECTION.DOWNLOAD_APPROVED_INSPECTION_NOTICE,
  });

export const generateNoticeService = (data = {}) =>
  request({
    data,
    ...VECTOR_INSPECTION.GENERATE_INSPECTION_NOTICE,
  });

export const getNoticeApproverLov = (data = { noticeType: '', noticeAction: '' }) =>
  request({
    data,
    ...VECTOR_INSPECTION.GET_NOTICE_APPROVER_LOV,
  });

export const insertNoticeService = (data = {}) =>
  request({
    data,
    ...VECTOR_INSPECTION.INSERT_NOTICE,
  });

export const enforceS35Service = (data = {}) =>
  request({
    data,
    ...VECTOR_INSPECTION.ENFORCE_S35,
  });

export const previewNoticeService = (data = {}) =>
  request({
    data,
    ...VECTOR_INSPECTION.PREVIEW_NOTICE,
  });
