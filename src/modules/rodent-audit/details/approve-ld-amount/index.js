import React, { useState } from 'react';
import { connect } from 'react-redux';

import { Formik, Form } from 'formik';
import PromptOnLeave from 'components/common/formik/prompt-on-leave';
import FormikSubmitErrorMessage from 'components/common/formik/submit-error-message';
import ValidationField from 'components/common/formik/validationField';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';

import { WEB_ROUTES } from 'constants/index';

import { approvalWithCommentsService, ldSummaryBreakdownService } from 'services/rodent-audit';
import { actionTryCatchCreator } from 'utils';
import GoBackButton from 'components/ui/go-back-button';
import { toast } from 'react-toastify';

const LDByMonthDetail = (props) => {
  const {
    history,
    location: { state },
  } = props;

  const [ldBreakdown, setLdBreakdown] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const ldSummaryBreakdownAction = (params) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setLdBreakdown(data.ldBreakdown);
      setIsLoading(false);
    };
    const onError = () => setIsLoading(false);
    actionTryCatchCreator(ldSummaryBreakdownService(params), onPending, onSuccess, onError);
  };

  useState(() => {
    document.title = `NEA | ${WEB_ROUTES.RODENT_AUDIT.APPROVE_LD_AMOUNT.name}`;
    if (state?.year && state?.month && state?.contractor) {
      ldSummaryBreakdownAction({
        year: state?.year,
        month: state?.month,
        companyName: state?.contractor,
      });
    } else {
      history.goBack();
    }
  }, []);

  const onSubmit = (values, actions) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      actions.resetForm();
      setIsLoading(false);
      toast.success(`${values.approve ? 'Approved' : 'Rejected'} total amount of LD for the month`);
      history.goBack();
      actions.setSubmitting(false);
      actions.setErrors({});
    };
    const onError = () => {
      setIsLoading(false);
      actions.setSubmitting(false);
      actions.setErrors({});
    };
    actionTryCatchCreator(approvalWithCommentsService(values), onPending, onSuccess, onError);
  };

  const validate = (values) => {
    const errors = {};
    let errorCount = 0;

    if (!values.approve && !values.remarks) {
      errors.remarks = '(Required)';
      errorCount += 1;
    }

    if (errorCount > 0) {
      errors.errorCount = errorCount;
      errors.errorHint = `There are ${errorCount} missing required fields.`;
    }
    return errors;
  };

  const initialValues = {
    approve: true,
    remarks: '',
    year: state?.year,
    month: state?.month,
    companyName: state?.contractor,
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.RODENT_AUDIT, WEB_ROUTES.RODENT_AUDIT.APPROVE_LD_AMOUNT]} />
          <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit} enableReinitialize>
            {({ setFieldValue, dirty, submitForm }) => {
              return (
                <Form>
                  <PromptOnLeave dirty={dirty} />
                  <GoBackButton onClick={() => history.goBack()} title={`Total Liquidated Damages for ${state?.monthYear}`}>
                    <button
                      type="button"
                      className="btn btn-pri m-1 ml-auto"
                      onClick={() => {
                        setFieldValue('approve', true, false);
                        setTimeout(() => {
                          submitForm();
                        }, 500);
                      }}>
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn btn-sec m-1"
                      onClick={() => {
                        setFieldValue('approve', false, false);
                        setTimeout(() => {
                          submitForm();
                        }, 500);
                      }}>
                      Reject
                    </button>
                  </GoBackButton>

                  <nav className="tab__main">
                    <div className="tabsContainer paddingBottom50">
                      <FormikSubmitErrorMessage />
                      <div className="mt-4">
                        <div className="row">
                          <div className="col-md-1 col-12 font-weight-bold">RO</div>
                          <div className="col-md-11 col-12 font-weight-bold">Final Liquidated Damages recommended by RO after Show Cause</div>
                        </div>
                        <hr />
                        {ldBreakdown?.ero && ldBreakdown?.ero.length > 0 && (
                          <>
                            <div className="row">
                              <div className="col-md-1 col-12 font-weight-bold">ERO</div>
                              <div className="col-md-11 col-12">
                                <div className="mb-3">
                                  The final Liquidated Damages is ${ldBreakdown?.ero.map((item) => item.amountValue).reduce((total, current) => Number(total || 0) + Number(current))} and is broken
                                  down as follows:
                                </div>
                                {ldBreakdown?.ero.map((item, index) => (
                                  <div key={`ero_block_${index + 1}`}>
                                    <div className="row">
                                      <div className="col-10 font-weight-bold">
                                        {index + 1}. {item.amountDescription}
                                      </div>
                                      <div className="col-2 font-weight-bold">${item.amountValue}</div>
                                    </div>
                                    <div className="row mb-2">
                                      <div className="col-10">{item.countDescription}</div>
                                      <div className="col-2">{item.countvalue}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <hr />
                          </>
                        )}
                        {ldBreakdown?.cro && ldBreakdown?.cro.length > 0 && (
                          <>
                            <div className="row">
                              <div className="col-md-1 col-12 font-weight-bold">CRO</div>
                              <div className="col-md-11 col-12">
                                <div className="mb-3">
                                  The final Liquidated Damages is ${ldBreakdown?.cro.map((item) => item.amountValue).reduce((total, current) => Number(total || 0) + Number(current))} and is broken
                                  down as follows:
                                </div>
                                {ldBreakdown?.cro &&
                                  ldBreakdown?.cro.length > 0 &&
                                  ldBreakdown?.cro.map((item, index) => (
                                    <div key={`ero_block_${index + 1}`}>
                                      <div className="row">
                                        <div className="col-10 font-weight-bold">
                                          {index + 1}. {item.amountDescription}
                                        </div>
                                        <div className="col-2 font-weight-bold">${item.amountValue}</div>
                                      </div>
                                      <div className="row mb-2">
                                        <div className="col-10">{item.countDescription}</div>
                                        <div className="col-2">{item.countvalue}</div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                            <hr />
                          </>
                        )}
                        {ldBreakdown?.wro && ldBreakdown?.wro.length > 0 && (
                          <>
                            <div className="row">
                              <div className="col-md-1 col-12 font-weight-bold">WRO</div>
                              <div className="col-md-11 col-12">
                                <div className="mb-3">
                                  The final Liquidated Damages is ${ldBreakdown?.wro.map((item) => item.amountValue).reduce((total, current) => Number(total || 0) + Number(current))} and is broken
                                  down as follows:
                                </div>
                                {ldBreakdown?.wro &&
                                  ldBreakdown?.wro.length > 0 &&
                                  ldBreakdown?.wro.map((item, index) => (
                                    <div key={`ero_block_${index + 1}`}>
                                      <div className="row">
                                        <div className="col-10 font-weight-bold">
                                          {index + 1}. {item.amountDescription}
                                        </div>
                                        <div className="col-2 font-weight-bold">${item.amountValue}</div>
                                      </div>
                                      <div className="row mb-2">
                                        <div className="col-10">{item.countDescription}</div>
                                        <div className="col-2">{item.countvalue}</div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                            <hr />
                          </>
                        )}
                        <div className="row mb-3">
                          <div className="col-md-1 col-12 font-weight-bold">Remarks (Required if reject)</div>
                          <div className="col-md-11 col-12">
                            <ValidationField name="remarks" placeholder="Remarks" inputComponent="textarea" rows={3} />
                            {/* <textarea className="form-control" rows={3} onChange={(e) => setRemarks(e.target.value)} /> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </nav>
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

const mapStateToProps = ({ global }) => ({
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LDByMonthDetail);
