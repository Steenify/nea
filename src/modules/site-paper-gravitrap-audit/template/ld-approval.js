import React, { useState } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { changeLDStatusService, updateApprovedLDService } from 'services/site-paper-gravitrap-audit';
import InPageLoading from 'components/common/inPageLoading';
import { actionTryCatchCreator, configMissingFieldMessage, monthIntToString, formikValidate } from 'utils';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import { WEB_ROUTES, SUBMISSION_TYPE } from 'constants/index';
import { TabContent } from 'reactstrap';
import GoBackButton from 'components/ui/go-back-button';
import { toast } from 'react-toastify';
import { Form, Formik } from 'formik';
import ValidationField from 'components/common/formik/validationField';
import SubmitErrorMessage from 'components/common/formik/submit-error-message';

const FormRow = ({ label = '', text = '', isPaddingBottom = false, isPaddingTop = false, isPaddingLeft = false, children }) => (
  <div className={`row ${isPaddingBottom ? 'pb-3' : ''} ${isPaddingTop ? 'pt-3' : ''}`}>
    {label && <div className={`${isPaddingLeft ? '' : 'font-weight-bold'} col-md-8 col-lg-8`}>{label}</div>}
    <div className="col-md-4 col-lg-4">{text ? text.split('-').map((item, index) => <div key={`FormRow_${index + 1}`}>{item}</div>) : children}</div>
  </div>
);

const CardItem = ({ item, parentIndex }) => {
  const { finalLdRate = '', group = '', collatedLdList = [], breakDownLdList = [] } = item;
  return (
    <div className="tab-pane__group bg-white">
      <p className="tab-pane__title text-white">{group}</p>
      <div className="card">
        <div className="card-body">
          {collatedLdList.length > 0 && (
            <>
              <div className="row">
                <div className="col-6">
                  <p className="font-weight-bold">{`The final liquidated damages amount is $${finalLdRate} and is broken down as follows:`}</p>
                </div>
                <div className="col-6">
                  <p className="font-weight-bold">The lapses are broken down as follows:</p>
                </div>
              </div>

              {collatedLdList.map(({ lapseDesc = '', totalOccurance = '', _lapseCategory = '', _breakDownList = [], _status = '' }, index) => {
                const remarkItem = breakDownLdList[index];
                return (
                  <div className={`row ${index === 0 ? '' : 'pt-3'}`} key={`collatedLdList_${parentIndex}_${index + 1}`}>
                    <div className="col-6">
                      <>
                        <FormRow label={`${index + 1}. ${lapseDesc}`} text={`$${totalOccurance || 0}`} />
                      </>
                    </div>
                    <div className="col-6">{remarkItem && <FormRow label={`${index + 1}. ${remarkItem?.lapseDesc}`} text={`${remarkItem?.totalOccurance} ${remarkItem?.lapseCategory || ''}`} />}</div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ACTIONS = {
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  SUBMIT: 'SUBMIT',
};

const ApprovalTemplate = ({ history: { goBack }, location: { state = {} } }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { year = 0, month = 0, canSubmit = false, template = {} } = state;
  const mappedMonth = monthIntToString(month - 1, true);
  const { EHI_GRAVITRAP_AUDIT } = WEB_ROUTES;
  const { APPROVE, REJECT, SUBMIT } = ACTIONS;
  const { approvalList = [] } = template;
  const title = canSubmit ? WEB_ROUTES.EHI_GRAVITRAP_AUDIT.UPLOADED_DOCUMENT_FOR_LD.name : WEB_ROUTES.MY_WORKSPACE.name;

  const approveLDAction = (isApprove = true, rejectionRemarks = '', resetForm) => {
    const mes = isApprove ? 'LD approved' : 'LD rejected';
    const param = { year, month, rejectionRemarks, action: isApprove ? APPROVE : REJECT };
    const onPending = () => {
      setIsLoading(true);
    };
    const onSuccess = (_data) => {
      setIsLoading(false);
      toast.success(mes);
      if (resetForm) resetForm();
      goBack();
    };
    const onError = (_error) => {
      setIsLoading(false);
    };
    actionTryCatchCreator(changeLDStatusService(param), onPending, onSuccess, onError);
  };

  const updateApprovedLDAction = (
    param = {
      ldAmount: 0,
      finalRemarks: '',
      fileIds: [],
      month: 0,
      year: 0,
    },
    callback,
  ) => {
    const onPending = () => {
      setIsLoading(true);
    };
    const onSuccess = (data) => {
      setIsLoading(false);
      if (callback) callback(data);
    };
    const onError = (_error) => {
      setIsLoading(false);
    };
    actionTryCatchCreator(updateApprovedLDService(param), onPending, onSuccess, onError);
  };

  const validate = ({ finalRemarks, fileIds, ldAmount, action }) => {
    const errors = {};
    const required = 'Required';
    let errorCount = 0;
    if (!canSubmit) {
      if (action === REJECT) {
        if (!finalRemarks) {
          errors.finalRemarks = required;
          errorCount += 1;
        }
        if (errorCount) {
          errors.errorCount = errorCount;
          errors.errorHint = configMissingFieldMessage(errorCount);
        }
        return errors;
      }
      return errors;
    }

    if (!finalRemarks) {
      errors.finalRemarks = required;
      errorCount += 1;
    }
    if (!fileIds?.length) {
      errors.fileIds = required;
      errorCount += 1;
    }
    const ldAmountError = formikValidate(ldAmount, ['required', 'positive']);
    if (ldAmountError) {
      errors.ldAmount = ldAmountError;
      errorCount += 1;
    }
    if (errorCount) {
      errors.errorCount = errorCount;
      errors.errorHint = configMissingFieldMessage(errorCount);
    }
    return errors;
  };
  const onSubmit = (values, { setSubmitting, resetForm }) => {
    setSubmitting(false);
    if (canSubmit) {
      const { finalRemarks, fileIds, ldAmount } = values;
      updateApprovedLDAction({ ldAmount, fileIds, finalRemarks, month, year }, () => {
        toast.success('Supporting Documents Uploaded');
        if (resetForm) resetForm();
        goBack();
      });
    } else {
      const { action, finalRemarks } = values;
      approveLDAction(action === APPROVE, finalRemarks, resetForm);
    }
  };

  if (!state?.template) {
    return <Redirect to={WEB_ROUTES.MY_WORKSPACE.url} />;
  }

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={title} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[EHI_GRAVITRAP_AUDIT, EHI_GRAVITRAP_AUDIT.TASK_DETAIL]} />
          <Formik initialValues={{ finalRemarks: '', fileIds: [], ldAmount: '', ...template }} validate={validate} onSubmit={onSubmit} enableReinitialize>
            {({ setFieldValue, submitForm }) => (
              <Form>
                <div className="paddingBottom50">
                  <GoBackButton onClick={() => goBack()} title={`Total Liquidated Damages amount for ${mappedMonth}`}>
                    <div className="ml-auto">
                      <button
                        type="button"
                        className="btn btn-pri float-right"
                        onClick={() => {
                          setFieldValue('action', canSubmit ? SUBMIT : APPROVE, true);
                          submitForm();
                        }}>
                        {canSubmit ? 'Submit' : 'Approve'}
                      </button>
                      {!canSubmit && (
                        <button
                          type="button"
                          className="btn btn-sec float-right mr-3"
                          onClick={() => {
                            setFieldValue('action', REJECT, true);
                            submitForm();
                          }}>
                          Reject
                        </button>
                      )}
                    </div>
                  </GoBackButton>
                  <div className="tabsContainer">
                    <SubmitErrorMessage />
                    <TabContent>
                      {approvalList.map((item, index) => (
                        <CardItem item={item} key={`CardItem_${index + 1}`} parentIndex={index} />
                      ))}
                      <div className="tab-pane__group bg-white">
                        <div className="card">
                          <div className="card-body">
                            {canSubmit && (
                              <>
                                <div className="row paddingBottom30">
                                  <div className="col-12 font-weight-bold">Supporting Documents*</div>
                                  <div className="col-12">
                                    <ValidationField submissionType={SUBMISSION_TYPE.GRAVITRAP_SUPPORT_DOC} name="fileIds" inputComponent="dropbox" deleteLocally />
                                  </div>
                                </div>
                                <div className="row paddingBottom30">
                                  <div className="col-md-3 col-lg-2 font-weight-bold">LD Amount*</div>
                                  <div className="col-md-9 col-lg-10">
                                    <ValidationField name="ldAmount" />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="row">
                            <div className="col-md-3 col-lg-2 font-weight-bold">{canSubmit ? 'Remarks*' : 'Remarks'}</div>
                            <div className="col-md-9 col-lg-10">
                              <ValidationField name="finalRemarks" inputComponent="textarea" rows={5} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabContent>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
          <Footer />
        </div>
      </div>
      <InPageLoading isLoading={isLoading} />
    </>
  );
};

export default withRouter(ApprovalTemplate);
