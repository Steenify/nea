import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const { SAMPLE_IDENTIFICATION } = API_URLS;

export const getListTasksClaim = (data = { roCdList: ['string'] }) =>
  request({
    data,
    ...SAMPLE_IDENTIFICATION.COMMON_POOL,
  });

export const claimSampleService = (data = { barcodeId: 'string' }) =>
  request({
    data,
    ...SAMPLE_IDENTIFICATION.CLAIM_SAMPLE,
  });

export const validateScannedBarcode = (data = { barcodeId: 'string' }) =>
  request({
    data,
    ...SAMPLE_IDENTIFICATION.VALIDATE_BARCODE,
  });

export const getSampleIdentificationMyWorkspace = () =>
  request({
    ...SAMPLE_IDENTIFICATION.MY_WORKSPACE,
  });

export const getQueriesStatus = data =>
  request({
    data,
    ...SAMPLE_IDENTIFICATION.QUERY_SAMPLE_STATUS,
  });

export const getSampleInfo = (data = { barcodeId: 'string' }) =>
  request({
    data,
    ...SAMPLE_IDENTIFICATION.SAMPLE_INFO,
  });

export const submitReceivedSample = (
  data = {
    receiveList: [
      {
        barcodeId: 'string',
        rejectReasonOther: 'string',
        rejectReasonCodes: ['string'],
        rejFileList: ['string'],
      },
    ],
  },
) =>
  request({
    data,
    ...SAMPLE_IDENTIFICATION.SUBMIT_RECEIVED_SAMPLE,
  });

export const certifyFindings = (
  data = {
    emailList: ['string'],
  },
) =>
  request({
    data,
    ...SAMPLE_IDENTIFICATION.CERTIFY_INSPECTION_FORM,
  });

export const submitFindingService = (
  data = {
    barcodeId: 'string',
    sampleId: 'string',
    sampleFindingsVO: {
      findingsId: 'string',
      specimenCode: 'string',
      speciesCode: 'string',
      remarks: 'string',
      specimenTypeCode: 'string',
      sampleTreatmentCode: 'string',
      researchPurpose: 'string',
      researchBy: 'string',
      specimenStages: ['string'],
      maleCount: 0,
      femaleCount: 0,
      unidentifiedCount: 0,
      status: 'string',
    },
    sampleRejectionVO: {
      remarks: 'string',
      fileIdList: ['string'],
    },
  },
) =>
  request({
    data,
    ...SAMPLE_IDENTIFICATION.SUBMIT_FINDINGS,
  });

export const getEmailGroupsLOV = () =>
  request({
    ...SAMPLE_IDENTIFICATION.GET_EMAIL_GROUPS,
  });

export const generateSampleKPIMonthlyService = (data = {}) =>
  request({
    data,
    ...SAMPLE_IDENTIFICATION.SAMPLE_KPI_MONTHLY,
  });

export const getSampleKPIMonthlyDetailService = (data = {}) =>
  request({
    data,
    ...SAMPLE_IDENTIFICATION.SAMPLE_KPI_MONTHLY_DETAIL,
  });

export const querySampleInspectionListingService = (data = {}) =>
  request({
    data,
    ...SAMPLE_IDENTIFICATION.QUERY_INSPECTION_FORM_STATUS,
  });
