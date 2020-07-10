import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  INSPECTION_MANAGEMENT: {
    FORM3: {
      ENFORCEMENT_SUBMIT,
      QUERY_LISTING,
      SAMPLE_IDENTIFIED_LISTING,
      DETAIL,
      NO_FURTHER_ACTION_SUBMIT,
      CREATE,
      SAVE,
      VOID,
      VOID_LISTING,
      SUBMIT,
      COMMON_POOL,
      NO_ENFORCEMENT_LISTING,
      APPROVE_NO_ENFORCEMENT,
      NO_FURTHER_ACTION_LISTING,
      NO_FURTHER_ACTION_APPROVE,
      CLAIM,
      WORKSPACE,
    },
  },
} = API_URLS;

export const form3WorkspaceService = data =>
  request({
    data,
    ...WORKSPACE,
  });

export const form3EnforcementSubmitService = data =>
  request({
    data,
    ...ENFORCEMENT_SUBMIT,
  });

export const form3QueryListingService = (data = {}) =>
  request({
    data,
    ...QUERY_LISTING,
  });

export const form3SampleIdentifiedListingService = () =>
  request({
    ...SAMPLE_IDENTIFIED_LISTING,
  });

export const form3DetailService = (data = {}) =>
  request({
    data,
    ...DETAIL,
  });

export const form3NoFurtherActionListingService = () =>
  request({
    ...NO_FURTHER_ACTION_LISTING,
  });

export const form3NoFurtherActionSubmitService = data =>
  request({
    data,
    ...NO_FURTHER_ACTION_SUBMIT,
  });

export const form3CreateService = data =>
  request({
    data,
    ...CREATE,
  });

export const form3SaveService = data =>
  request({
    data,
    ...SAVE,
  });

export const form3SubmitService = data =>
  request({
    data,
    ...SUBMIT,
  });

export const form3VoidService = data =>
  request({
    data,
    ...VOID,
  });

export const form3VoidListingService = data =>
  request({
    data,
    ...VOID_LISTING,
  });

export const form3CommonPoolService = () =>
  request({
    ...COMMON_POOL,
  });

export const form3NoEnforcementListingService = () =>
  request({
    ...NO_ENFORCEMENT_LISTING,
  });

export const approveNoEnforcementService = data =>
  request({
    ...APPROVE_NO_ENFORCEMENT,
    data,
  });

export const approveNoFurtherActionService = data =>
  request({
    ...NO_FURTHER_ACTION_APPROVE,
    data,
  });

export const form3ClaimService = (form3Ids = []) =>
  request({
    ...CLAIM,
    data: {
      form3Ids,
    },
  });
