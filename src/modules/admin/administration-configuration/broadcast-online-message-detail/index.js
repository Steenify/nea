import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import _ from 'lodash';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import PromptOnLeave from 'components/common/formik/prompt-on-leave';
import FormikSubmitErrorMessage from 'components/common/formik/submit-error-message';
import ValidationField from 'components/common/formik/validationField';
import { WEB_ROUTES } from 'constants/index';

import { dbDateTimeStringFrom, dateAndTimeFromDB } from 'utils';

import { createAction, updateAction, defaultAddValue, getRolesAction } from './action';

const BroadcastOnlineMessageDetail = (props) => {
  const {
    createAction,
    updateAction,
    getRolesAction,
    location: { state },
    match: {
      params: { id },
    },
    history,
    ui: { isLoading },
    data: { publishUserGroupLOV },
    // data,
  } = props;

  const urgencyLOV = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
  ];

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.ADMINISTRATION.BROADCAST_MESSAGES_DETAIL.name}`;

    if (id !== 'edit' && id !== 'create') {
      history.replace(WEB_ROUTES.ADMINISTRATION.BROADCAST_MESSAGES_DETAIL.url);
    } else {
      getRolesAction();
    }
  }, [id, history, getRolesAction]);

  const onSubmit = (values, actions) => {
    const data = {
      ...values,
      startDate: dbDateTimeStringFrom(values.startDate, values.startTime),
      endDate: dbDateTimeStringFrom(values.endDate, values.endTime),
      startTime: undefined,
      endTime: undefined,
    };
    if (id === 'create') {
      createAction(data).then(() => {
        actions.resetForm();
        toast.success('Success');
        history.goBack();
      });
    }
    if (id === 'edit') {
      updateAction(data).then(() => {
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

    if (!values.broadcastTitle) {
      errors.broadcastTitle = '(Required)';
      errorCount += 1;
    }
    if (!values.broadcastMessageContent) {
      errors.broadcastMessageContent = '(Required)';
      errorCount += 1;
    }
    if (!values.startDate) {
      errors.startDate = '(Required)';
      errorCount += 1;
    }
    if (!values.endDate) {
      errors.endDate = '(Required)';
      errorCount += 1;
    }
    if (!values.publishUserGroup || values.publishUserGroup.length === 0) {
      errors.publishUserGroup = '(Required)';
      errorCount += 1;
    }
    if (!values.urgency) {
      errors.urgency = '(Required)';
      errorCount += 1;
    }
    if (errorCount) {
      errors.errorCount = errorCount;
      errors.errorHint = `There are ${errorCount} issues.`;
    }
    return errors;
  };

  let initialValues = defaultAddValue();
  if (state?.detail) {
    const [startDate, startTime] = dateAndTimeFromDB(state?.detail.startDate);
    const [endDate, endTime] = dateAndTimeFromDB(state?.detail.endDate);
    const detail = { ...state?.detail, startDate, startTime, endDate, endTime };
    initialValues = _.merge({}, defaultAddValue(), detail);
  }
  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.ADMINISTRATION.BROADCAST_MESSAGES.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.ADMINISTRATION, WEB_ROUTES.ADMINISTRATION.BROADCAST_MESSAGES, WEB_ROUTES.ADMINISTRATION.BROADCAST_MESSAGES_DETAIL]} />
          <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit} enableReinitialize>
            {({ dirty }) => {
              return (
                <Form>
                  <PromptOnLeave dirty={dirty} />
                  <div className="go-back d-flex align-items-center">
                    <span onClick={() => history.goBack()}>{WEB_ROUTES.ADMINISTRATION.BROADCAST_MESSAGES.name}</span>
                  </div>
                  <div className="tabsContainer">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="row mb-3">
                          <div className="col-md-4 col-lg-3 d-flex align-items-center justify-content-end">
                            <div className="font-weight-bold">Broadcast Message Title</div>
                          </div>
                          <div className="col col-lg-5">
                            <ValidationField name="broadcastTitle" inputClassName="textfield " hideError />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-4 col-lg-3 d-flex align-items-center justify-content-end">
                            <div className="font-weight-bold">Broadcast Message Content</div>
                          </div>
                          <div className="col col-lg-5">
                            <ValidationField name="broadcastMessageContent" inputClassName="textfield " hideError />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-4 col-lg-3 d-flex align-items-center justify-content-end">
                            <div className="font-weight-bold">Start Date & Time</div>
                          </div>
                          <div className="col col-lg-5">
                            <ValidationField name="startDate" placeholder="Date" inputClassName="d-inline m-1" inputComponent="singleDatePickerV2" hideError />
                            <ValidationField name="startTime" placeholder="Time" inputClassName="d-inline wf-150 " inputComponent="timePicker" use12Hours hideError />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-4 col-lg-3 d-flex align-items-center justify-content-end">
                            <div className="font-weight-bold">End Date & Time</div>
                          </div>
                          <div className="col col-lg-5">
                            <ValidationField name="endDate" placeholder="Date" inputClassName="d-inline m-1" inputComponent="singleDatePickerV2" hideError />
                            <ValidationField name="endTime" placeholder="Time" inputClassName="d-inline wf-150 " inputComponent="timePicker" use12Hours hideError />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-4 col-lg-3 d-flex justify-content-end">
                            <div className="font-weight-bold mt-4">Publisher User Group</div>
                          </div>
                          <div className="col col-lg-5">
                            <ValidationField name="publishUserGroup" inputComponent="searchable-check-list" placeholder="Publisher User Group" options={publishUserGroupLOV} hideError />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-4 col-lg-3 d-flex align-items-center justify-content-end">
                            <div className="font-weight-bold">Urgency</div>
                          </div>
                          <div className="col col-lg-5">
                            <ValidationField name="urgency" inputComponent="react-select" placeholder="Urgency" options={urgencyLOV} hideError />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-4 col-lg-3 d-flex justify-content-end">
                            <div className="font-weight-bold">Remarks</div>
                          </div>
                          <div className="col col-lg-5">
                            <ValidationField inputComponent="textarea" name="remark" rows={5} hideError />
                          </div>
                        </div>
                      </div>
                    </div>
                    <FormikSubmitErrorMessage />
                    <div className="text-center mb-5">
                      <button type="button" className="btn btn-sec m-1" onClick={history.goBack}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-pri m-1">
                        Submit
                      </button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global, adminReducers: { broadcastOnlineMessageDetail } }, ownProps) => ({
  ...ownProps,
  ...broadcastOnlineMessageDetail,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = {
  createAction,
  updateAction,
  getRolesAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BroadcastOnlineMessageDetail));
