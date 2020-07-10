import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

const {
  EHI_GRAVITRAP_AUDIT: {
    COMMON: {
      COMMON_POOL_LISTING,
      CLAIM_TASK,
      WORK_SPACE_LISTING,
      DETAIL,
      SUBMIT_TASK,
      CONCUR_ASSESSMENT,
      SAVE_CONCUR_ASSESSMENT,
      REJECT_ASSESSMENT,
      SUPPORT_ASSESSMENT,
      SAVE_TASK,
      SUBMIT_ADHOC_TASK,
      SAVE_ADHOC_TASK,
    },
  },
} = API_URLS;
export const commonPoolListingService = () => request({ ...COMMON_POOL_LISTING });

export const claimTaskService = (data = { taskIds: [] }) => request({ data, ...CLAIM_TASK });

export const workingSpaceListingService = () => request({ ...WORK_SPACE_LISTING });

export const getCaseDetailService = (data = { caseId: '' }) => request({ data, ...DETAIL });

export const submitTaskService = (data = {}) => request({ data, ...SUBMIT_TASK });

export const saveTaskService = (data = {}) => request({ data, ...SAVE_TASK });

export const concurAssessmentService = (data = {}) => request({ data, ...CONCUR_ASSESSMENT });

export const saveConcurAssessmentService = (data = {}) => request({ data, ...SAVE_CONCUR_ASSESSMENT });

export const rejectAssessmentService = (data = { taskId: '' }) => request({ data, ...REJECT_ASSESSMENT });

export const supportAssessmentService = (data = { taskIds: [] }) => request({ data, ...SUPPORT_ASSESSMENT });

export const submitAdHocTaskService = (data = { taskId: '' }) => request({ data, ...SUBMIT_ADHOC_TASK });

export const saveAdHocTaskService = (data = { taskIds: [] }) => request({ data, ...SAVE_ADHOC_TASK });
