import React from 'react';
import { AD_HOC_LAPSE_CODE } from 'constants/index';

const {
  LATE_HDB,
  LATE_LANDED,
  LATE_WEEKLY_REPORT,
  LATE_MONTHLY_REPORT,
  FAILURE_WEEKLY_REPORT,
  FAILURE_MONTHLY_REPORT,
  LATE_ATTENDANCE_ICARE_FEEDBACK,
  LATE_SUBMISSION_ICARE_REPORT,
  FAILURE_TO_SUPPLY,
  LATE_SUBMISSION_SAMPLE_EHI,
  MOSQUITO_SAMPLES,
  SYSTEM_AUDIT,
} = AD_HOC_LAPSE_CODE;

export const submissionDeadlineTitle = (lapseCode = '') => {
  let title = '';
  if ([LATE_HDB, LATE_LANDED].includes(lapseCode)) {
    title = 'Deployment deadline*';
  } else if ([LATE_WEEKLY_REPORT, LATE_MONTHLY_REPORT, LATE_SUBMISSION_ICARE_REPORT, LATE_SUBMISSION_SAMPLE_EHI, MOSQUITO_SAMPLES].includes(lapseCode)) {
    title = 'Submission deadline*';
  } else if (lapseCode === LATE_ATTENDANCE_ICARE_FEEDBACK) {
    title = 'Response deadline*';
  }
  return title;
};

export const submissionDateTitle = (lapseCode = '') => {
  let title = '';
  if ([LATE_HDB, LATE_LANDED].includes(lapseCode)) {
    title = 'Actual deployment date*';
  } else if ([LATE_WEEKLY_REPORT, LATE_MONTHLY_REPORT].includes(lapseCode)) {
    title = 'Actual submission date*';
  } else if (lapseCode === LATE_ATTENDANCE_ICARE_FEEDBACK) {
    title = 'Actual response date*';
  } else if ([LATE_SUBMISSION_ICARE_REPORT, LATE_SUBMISSION_SAMPLE_EHI, MOSQUITO_SAMPLES].includes(lapseCode)) {
    title = 'Submission date*';
  }
  return title;
};

export const totalBatchesTitle = (lapseCode = '') => {
  let title = '';
  if (lapseCode === LATE_HDB) {
    title = 'Number of blocks late*';
  } else if (lapseCode === LATE_LANDED) {
    title = 'Number of traps late*';
  } else if ([LATE_WEEKLY_REPORT, LATE_MONTHLY_REPORT].includes(lapseCode)) {
    title = 'Number of reports late*';
  } else if ([FAILURE_WEEKLY_REPORT, FAILURE_MONTHLY_REPORT, LATE_ATTENDANCE_ICARE_FEEDBACK, SYSTEM_AUDIT].includes(lapseCode)) {
    title = 'Number of occasions*';
  } else if (lapseCode === FAILURE_TO_SUPPLY) {
    title = 'Number of occurrence* ';
  } else if ([LATE_SUBMISSION_SAMPLE_EHI, MOSQUITO_SAMPLES].includes(lapseCode)) {
    title = 'Number of Batches Late*';
  }
  return title;
};

export const notificationDateTitle = (lapseCode = '') => {
  let title = '';
  if ([LATE_ATTENDANCE_ICARE_FEEDBACK, LATE_SUBMISSION_ICARE_REPORT].includes(lapseCode)) {
    title = 'Notification date*';
  }
  return title;
};

export const FormRow = ({ label = '', text = '', isPaddingBottom = false, children }) => (
  <div className={`row ${isPaddingBottom ? 'pb-3' : ''}`}>
    {label && <div className="col-md-3 col-lg-2 font-weight-bold">{label}</div>}
    <div className="col-md-9 col-lg-10">{text || children}</div>
  </div>
);

export const newLapse = {
  submissionDate: undefined,
  submissionDeadline: undefined,
  totalBatches: '',
  month: undefined,
  notificationDate: undefined,
  lapseCode: undefined,
  lapseDescription: undefined,
};
