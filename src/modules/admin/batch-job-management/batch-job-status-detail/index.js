import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import _ from 'lodash';
import moment from 'moment';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import PromptOnLeave from 'components/common/formik/prompt-on-leave';
import FormikSubmitErrorMessage from 'components/common/formik/submit-error-message';
import ValidationField from 'components/common/formik/validationField';
import { WEB_ROUTES } from 'constants/index';

import { dateTimeDBFormatString } from 'utils';
import { createAction, updateAction, defaultAddValue, searchJobEndPtAction, searchAction } from './action';

const BatchJobStatusDetail = (props) => {
  const {
    createAction,
    updateAction,
    searchJobEndPtAction,
    searchAction,
    location: { state },
    match: {
      params: { id },
    },
    history,
    ui: { isLoading },
    data: { endPointLOV, searchDetail },
  } = props;

  const isCreating = id === 'create';
  const isEditing = id === 'edit';
  const isSearching = id === 'search';

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS_DETAIL.name}`;

    if (!isCreating && !isEditing && !isSearching) {
      history.replace(WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS.url);
    } else if (isSearching) {
      searchAction({ batchName: state?.jobName });
    } else {
      searchJobEndPtAction();
    }
  }, [id, history, searchAction, searchJobEndPtAction, isCreating, isEditing, isSearching, state]);

  const onSubmit = (values, actions) => {
    if (id === 'create') {
      createAction({ ...values, effectiveDate: new Date(values.startBatchJob).toISOString() }).then(() => {
        actions.resetForm();
        toast.success('Success');
        history.goBack();
      });
    }
    if (id === 'edit') {
      updateAction(values).then(() => {
        actions.resetForm();
        toast.success('Success');
        history.goBack();
      });
    }
    actions.setSubmitting(false);
    actions.setErrors({});
  };

  const validate = (values) => {
    const errors = {};
    let errorCount = 0;

    if (!values.batchName) {
      errors.batchName = '(Required)';
      errorCount += 1;
    }
    if (!values.cronExpression) {
      errors.cronExpression = '(Required)';
      errorCount += 1;
    }
    if (isCreating) {
      if (!values.jobEndPt) {
        errors.jobEndPt = '(Required)';
        errorCount += 1;
      }
      if (!values.startBatchJob) {
        errors.startBatchJob = '(Required)';
        errorCount += 1;
      }
    }
    if (errorCount) {
      errors.errorCount = errorCount;
      errors.errorHint = `There are ${errorCount} issues.`;
    }
    return errors;
  };

  const initialValues = _.merge(
    {},
    defaultAddValue(),
    !isCreating
      ? {
          ...state?.detail,
          batchName: state?.detail?.jobName,
          cronExpression: state?.detail?.cronExpression || undefined,
          status: state?.detail?.status === 'RUNNING',
        }
      : {
          incHoliday: false,
          jobEndPt: '',
          startBatchJob: '',
          remarks: '',
          batchName: state?.detail?.jobName,
          cronExpression: state?.detail?.cronExpression || undefined,
        },
  );

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.BATCH_JOB_MANAGEMENT, WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS, WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS_DETAIL]} />
          <div className="go-back d-flex align-items-center">
            <span onClick={() => history.goBack()}>{WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS_DETAIL.name}</span>
          </div>
          <div className="tabsContainer">
            {isSearching && (
              <div className="row">
                <div className="col-lg-12">
                  <div className="row mb-3">
                    <div className="col-md-4 col-lg-3 d-flex align-items-center justify-content-end">
                      <div className="font-weight-bold">Batch Job Name </div>
                    </div>
                    <div className="col col-lg-5">{searchDetail?.batchName}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 col-lg-3 d-flex justify-content-end">
                      <div className="font-weight-bold">Job Type</div>
                    </div>
                    <div className="col col-lg-5">{searchDetail?.jobType}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 col-lg-3 d-flex justify-content-end">
                      <div className="font-weight-bold">Job Frequency</div>
                    </div>
                    <div className="col col-lg-5">{searchDetail?.cronExpression}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 col-lg-3 d-flex align-items-center justify-content-end">
                      <div className="font-weight-bold">Job URL</div>
                    </div>
                    <div className="col col-lg-5">{searchDetail?.jobEndPt}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 col-lg-3 d-flex align-items-center justify-content-end">
                      <div className="font-weight-bold">Rest Method</div>
                    </div>
                    <div className="col col-lg-5">{searchDetail?.restMethod}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 col-lg-3 d-flex justify-content-end align-items-center">
                      <div className="font-weight-bold">Start Date</div>
                    </div>
                    <div className="col col-lg-5">{searchDetail?.startBatchJob || searchDetail?.effectiveDate}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 col-lg-3 d-flex justify-content-end align-items-center">
                      <div className="font-weight-bold">Include Holiday?</div>
                    </div>
                    <div className="col col-lg-5">{searchDetail?.incHoliday ? 'Yes' : 'No'}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 col-lg-3 d-flex justify-content-end align-items-center">
                      <div className="font-weight-bold">Active Status</div>
                    </div>
                    <div className="col col-lg-5">{searchDetail?.activeStatus ? 'Yes' : 'No'}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 col-lg-3 d-flex justify-content-end">
                      <div className="font-weight-bold">Remarks</div>
                    </div>
                    <div className="col col-lg-5">{searchDetail?.remarks}</div>
                  </div>
                </div>
              </div>
            )}
            {!isSearching && (
              <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit} enableReinitialize>
                {({ dirty }) => (
                  <Form>
                    <PromptOnLeave dirty={dirty} />
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="row mb-3">
                          <div className="col-md-4 col-lg-3 d-flex align-items-center justify-content-end">
                            <div className="font-weight-bold">Batch Job Name (*)</div>
                          </div>
                          <div className="col col-lg-5">
                            <ValidationField name="batchName" inputClassName="textfield " hideError />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-4 col-lg-3 d-flex justify-content-end">
                            <div className="font-weight-bold">Job Frequency (*)</div>
                          </div>
                          <div className="col col-lg-5">
                            <ValidationField inputComponent="textarea" name="cronExpression" rows={5} hideError />
                          </div>
                        </div>
                        {isCreating && (
                          <>
                            <div className="row mb-3">
                              <div className="col-md-4 col-lg-3 d-flex align-items-center justify-content-end">
                                <div className="font-weight-bold">Job URL (*)</div>
                              </div>
                              <div className="col col-lg-5">
                                <ValidationField
                                  name="jobEndPt"
                                  inputComponent="react-select"
                                  options={endPointLOV.map((item) => ({ value: item.jobEndPt, label: item.jobEndPt }))}
                                  // selectClassName="w-100"
                                  hideError
                                  // onChange={(value) => setValueAction({ value, divId, name })}
                                />
                              </div>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-4 col-lg-3 d-flex justify-content-end align-items-center">
                                <div className="font-weight-bold">Start Date (*)</div>
                              </div>
                              <div className="col col-lg-5">
                                <ValidationField
                                  name="startBatchJob"
                                  placeholder="Date"
                                  inputClassName="d-inline m-1"
                                  inputComponent="singleDatePickerV2"
                                  minDate={moment()}
                                  hideError
                                  dateFormat={dateTimeDBFormatString}
                                />
                              </div>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-4 col-lg-3 d-flex justify-content-end align-items-center">
                                <div className="font-weight-bold">Include Holiday?</div>
                              </div>
                              <div className="col col-lg-5">
                                <label className="custom-radio m-2">
                                  <ValidationField type="radio" id="incHoliday_yes" name="incHoliday" value hideError />
                                  <label className="form-label" htmlFor="incHoliday_yes">
                                    Yes
                                  </label>
                                </label>
                                <label className="custom-radio m-2">
                                  <ValidationField type="radio" id="incHoliday_no" name="incHoliday" value={false} hideError />
                                  <label className="form-label" htmlFor="incHoliday_no">
                                    No
                                  </label>
                                </label>
                              </div>
                            </div>
                          </>
                        )}
                        {isEditing && (
                          <div className="row mb-3">
                            <div className="col-md-4 col-lg-3 d-flex justify-content-end align-items-center">
                              <div className="font-weight-bold">Active Status</div>
                            </div>
                            <div className="col col-lg-5">
                              <label className="custom-radio m-2">
                                <ValidationField type="radio" id="activeStatus_yes" name="activeStatus" value hideError />
                                <label className="form-label" htmlFor="activeStatus_yes">
                                  Yes
                                </label>
                              </label>
                              <label className="custom-radio m-2">
                                <ValidationField type="radio" id="activeStatus_no" name="activeStatus" value={false} hideError />
                                <label className="form-label" htmlFor="activeStatus_no">
                                  No
                                </label>
                              </label>
                            </div>
                          </div>
                        )}
                        <div className="row mb-3">
                          <div className="col-md-4 col-lg-3 d-flex justify-content-end">
                            <div className="font-weight-bold">Remarks</div>
                          </div>
                          <div className="col col-lg-5">
                            <ValidationField inputComponent="textarea" name="remarks" rows={5} hideError />
                          </div>
                        </div>
                      </div>
                    </div>
                    <FormikSubmitErrorMessage />
                    <div className="text-center mb-5">
                      <button type="button" className="btn btn-sec m-1" onClick={() => history.goBack()}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-pri m-1">
                        Submit
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ adminReducers: { batchJobStatusDetail } }, ownProps) => ({
  ...ownProps,
  ...batchJobStatusDetail,
});

const mapDispatchToProps = {
  createAction,
  updateAction,
  searchJobEndPtAction,
  searchAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BatchJobStatusDetail));
