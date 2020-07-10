import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Formik, Form } from 'formik';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';

import moment from 'moment';
import ValidationField from 'components/common/formik/validationField';
import { dateStringFromDate, actionTryCatchCreator, byteArrayToBase64, autoGenerateDownloadLink, isValid_NRIC_FIN } from 'utils';
import InPageLoading from 'components/common/inPageLoading';
import FormikSubmitErrorMessage from 'components/common/formik/submit-error-message';
import PromptOnLeave from 'components/common/formik/prompt-on-leave';
import GoBackButton from 'components/ui/go-back-button';

import FilePreviewModal from 'components/common/file-review-modal';

import { loiPreviewService, loiDownloadService } from 'services/inspection-management/letter-of-intent';

import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import { getLast12MonthsLOIListAction, loiSubmitForApporvalAction, loiCreateAction, loiSaveAction } from './action';

import './style.scss';

const LetterOfIntent = (props) => {
  const {
    history,
    location: { state },
    ui: { isLoading },
    data: { letterList },
    getLast12MonthsLOIListAction,
    loiSubmitForApporvalAction,
    loiCreateAction,
    loiSaveAction,
    getMastercodeAction,
    masterCodes,
  } = props;

  const form3Id = state?.id;
  const canCreateLOI = state?.canCreateLOI;
  const [localLoading, setLocalLoading] = useState(false);
  const [previewModalState, setPreviewModalState] = useState({ isOpen: false, file: null });

  const initialValues = {
    form3Id,
    loiReferenceNo: '',
    loiType: '',
    loiDate: dateStringFromDate(moment()),
    offenderSalutation: '',
    offenderName: '',
    offenderAddress: '',
    offenderPostalcode: '',
    offenceAddress: '',
    offencePostalCode: '',
    ownerName: '',
    ownerDesignation: '',
    ownerSalutation: '',
    tenantName: '',
    tenantNric: '',
    tenantDob: '',
    tenantNationality: '',
    tenantAddress: '',
    tenantPostalCode: '',
    tenantPhone: '',
    tenantGender: '',
    companyName: '',
    companyAddress: '',
    companyPostal: '',
  };

  const formValidation = (values) => {
    const isDomestic = values.loiType === 'DMC' || values.loiType === 'DRFT' || values.loiType === 'TFLD';
    const isTenancy = values.loiType === 'DRFT' || values.loiType === 'TFLD';
    const errors = {};
    let errorCount = 0;

    if (!values.loiDate) {
      errorCount += 1;
      errors.loiDate = 'Required';
    }
    if (!values.ownerName && values.loiType !== 'TFLD') {
      errorCount += 1;
      errors.ownerName = 'Required';
    }
    if (!values.ownerSalutation && values.loiType !== 'TFLD') {
      errorCount += 1;
      errors.ownerSalutation = 'Required';
    }
    if (!values.offenceAddress) {
      errorCount += 1;
      errors.offenceAddress = 'Required';
    }
    if (!values.offencePostalCode) {
      errorCount += 1;
      errors.offencePostalCode = 'Required';
    }
    if (!values.offenderSalutation) {
      errorCount += 1;
      errors.offenderSalutation = 'Required';
    }
    if (!values.offenderName) {
      errorCount += 1;
      errors.offenderName = 'Required';
    }
    if (isDomestic) {
      if (!values.offenderAddress) {
        errorCount += 1;
        errors.offenderAddress = 'Required';
      }
      if (!values.offenderPostalcode) {
        errorCount += 1;
        errors.offenderPostalcode = 'Required';
      }
    } else {
      if (!values.companyName) {
        errorCount += 1;
        errors.companyName = 'Required';
      }
      if (!values.companyAddress) {
        errorCount += 1;
        errors.companyAddress = 'Required';
      }
      if (!values.companyPostal) {
        errorCount += 1;
        errors.companyPostal = 'Required';
      }
      if (!values.offenderDesignation) {
        errorCount += 1;
        errors.offenderDesignation = 'Required';
      }
    }
    if (isTenancy) {
      // if (!values.tenantName) {
      //   errorCount += 1;
      //   errors.tenantName = 'Required';
      // }
      if (values.tenantNric && !isValid_NRIC_FIN(values.tenantNric)) {
        errorCount += 1;
        errors.tenantNric = 'Invalid NRIC';
      }
      // if (!values.tenantDob) {
      //   errorCount += 1;
      //   errors.tenantDob = 'Required';
      // }
      // if (!values.tenantNationality) {
      //   errorCount += 1;
      //   errors.tenantNationality = 'Required';
      // }
      // if (!values.tenantAddress) {
      //   errorCount += 1;
      //   errors.tenantAddress = 'Required';
      // }
      // if (!values.tenantPostalCode) {
      //   errorCount += 1;
      //   errors.tenantPostalCode = 'Required';
      // }
      // if (!values.tenantPhone) {
      //   errorCount += 1;
      //   errors.tenantPhone = 'Required';
      // }
      // if (!values.tenantGender) {
      //   errorCount += 1;
      //   errors.tenantGender = 'Required';
      // }
    }

    if (errorCount) {
      errors.errorCount = errorCount;
      errors.errorHint = `There are ${errorCount} missing required fields. `;
    }

    return errors;
  };

  const onSubmit = (values, actions) => {
    const { loiType } = values;
    loiCreateAction({ form3Id, loiType }, (loiReferenceNo) => {
      loiSaveAction({ loiVO: { ...values, loiReferenceNo } }, () => {
        actions.resetForm();
        getLast12MonthsLOIListAction({ form3Id });
      });
    });
    actions.setSubmitting(false);
    actions.setErrors({});
  };

  useEffect(() => {
    document.title = 'NEA | Letter Of Intent';
    if (form3Id) {
      getMastercodeAction([MASTER_CODE.COUNTRY, MASTER_CODE.GENDER, MASTER_CODE.SALUTATION, MASTER_CODE.LOI_TYPE]);
      getLast12MonthsLOIListAction({ form3Id });
    } else {
      history.goBack();
    }
  }, [getMastercodeAction, getLast12MonthsLOIListAction, form3Id, history]);

  const downloadLOI = async (loiReferenceNo) => {
    const onPending = () => {
      setLocalLoading(true);
    };
    const onSuccess = (data) => {
      setLocalLoading(false);
      const base64 = byteArrayToBase64(data?.loiVO?.loiFile || []);
      autoGenerateDownloadLink(`${loiReferenceNo}.pdf`, 'application/pdf', base64);
    };
    const onError = () => {
      setLocalLoading(false);
    };
    await actionTryCatchCreator(loiDownloadService({ loiReferenceNo }), onPending, onSuccess, onError);
  };

  const previewLOI = async (loiReferenceNo) => {
    const onPending = () => {
      setLocalLoading(true);
    };
    const onSuccess = (data) => {
      const base64 = byteArrayToBase64(data?.loiVO?.loiFile || []);

      setPreviewModalState({ isOpen: true, file: base64 });
      setLocalLoading(false);
    };
    const onError = () => {
      setLocalLoading(false);
    };
    await actionTryCatchCreator(loiPreviewService({ loiReferenceNo }), onPending, onSuccess, onError);
  };

  return (
    <>
      <Header />
      <div className="main-content">
        <NavBar active="task" />
        <div className="contentWrapper">
          <NewBreadCrumb />
          <GoBackButton onClick={() => history.goBack()} title="Letter of Intent" />
          <div className="tabsContainer">
            <div className="tab-content">
              <div className="tab-pane__group bg-white">
                <p className="tab-pane__title text-bold text-white">LOI History Log</p>
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-3">
                        <div className="label-group">
                          <p className="col-form-label font-weight-bold">Type of LOI</p>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="label-group">
                          <p className="col-form-label font-weight-bold">Saved as at</p>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="label-group">
                          <p className="col-form-label font-weight-bold text-center">LOI Status</p>
                        </div>
                      </div>
                      <div className="col-3" />
                    </div>
                    {letterList.map((letter, lIndex) => (
                      <div className="row mb-2" key={`past_12_months_LOI_list_${lIndex + 1}`}>
                        <div className="col-3 d-flex align-items-center">
                          <div className="">
                            <p className="col-form-label">{letter.loiType}</p>
                          </div>
                        </div>
                        <div className="col-3 d-flex align-items-center">
                          <div className="">
                            <p className="col-form-label">{letter.loiSubmittedDate}</p>
                            {letter.isEnablePreview && (
                              <span className="col-form-label text-blue cursor-pointer p-0" onClick={() => previewLOI(letter.loiReferenceNo)}>
                                Preview
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-3 d-flex align-items-center justify-content-center">
                          {letter.loiStatus ? <span className={`badge badge-${letter.loiStatus === 'Approved' ? 'success' : 'warning'}`}>{letter.loiStatus}</span> : <></>}
                        </div>
                        <div className="col-3 d-flex align-items-center">
                          <div className="">
                            {letter.isEnableDownload && (
                              <button type="button" className="btn btn-pri m-1" onClick={() => downloadLOI(letter.loiReferenceNo)}>
                                Download
                              </button>
                            )}
                            {!letter.loiStatus && (
                              <button type="button" className="btn btn-pri m-1" onClick={() => loiSubmitForApporvalAction({ loiReferenceNo: letter.loiReferenceNo, form3Id })}>
                                Submit for Approval
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {canCreateLOI && (
            <Formik initialValues={initialValues} enableReinitialize validate={formValidation} onSubmit={onSubmit}>
              {({ values, dirty }) => {
                const isDomestic = values.loiType === 'DMC' || values.loiType === 'DRFT' || values.loiType === 'TFLD';
                const isTenancy = values.loiType === 'DRFT' || values.loiType === 'TFLD';
                return (
                  <Form>
                    <PromptOnLeave dirty={dirty} />
                    <div className="tabsContainer">
                      <div className="tab-content">
                        <div className="tab-pane__group bg-white">
                          <div className="tab-pane__title">
                            <div className="row">
                              <div className="col-md-4 col-lg-2 d-flex align-items-center">Select new LOI for</div>
                              <div className="col-md-4">
                                <ValidationField
                                  name="loiType"
                                  inputComponent="react-select"
                                  options={masterCodes[MASTER_CODE.LOI_TYPE]}
                                  selectClassName="d-inline-block wf-400"
                                  // onChange={onChangeLOIType}
                                />
                              </div>
                            </div>
                          </div>
                          {values.loiType && (
                            <div className="card">
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-lg-6 mb-3">
                                    <label className="font-weight-bold">Ref No:</label>
                                    <div>{values.loiReferenceNo}</div>
                                  </div>
                                  <div className="col-lg-6 mb-3">
                                    <label className="font-weight-bold">Date (*)</label>
                                    <ValidationField inputComponent="singleDatePickerV2" name="loiDate" minDate={moment()} />
                                  </div>
                                  {isDomestic && (
                                    <>
                                      <div className="col-lg-6 mb-3">
                                        <label className="font-weight-bold">Offender&apos;s Name (*)</label>
                                        <div className="d-flex">
                                          <div>
                                            <ValidationField
                                              name="offenderSalutation"
                                              inputComponent="react-select"
                                              selectClassName="d-inline-block wf-200"
                                              placeholder="Please select"
                                              options={masterCodes[MASTER_CODE.SALUTATION]}
                                            />
                                          </div>
                                          <div className="flex-fill mw-400">
                                            <ValidationField type="text" name="offenderName" inputClassName="ml-2 d-inline-block  textfield" />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-6 mb-3">
                                        <label className="font-weight-bold">Offender&apos;s Address (*)</label>
                                        <ValidationField name="offenderAddress" inputClassName="textfield mt-2 mb-2 mw-400" />
                                        <ValidationField name="offenderPostalcode" inputClassName="wf-200 textfield" placeholder="Postal Code" />
                                      </div>
                                    </>
                                  )}
                                  {!isDomestic && (
                                    <>
                                      <div className="col-lg-6 mb-3">
                                        <label className="font-weight-bold">Company&apos;s Registered Name (*)</label>
                                        <ValidationField name="companyName" inputClassName="d-inline-block textfield mw-400" />
                                      </div>
                                      <div className="col-lg-6 mb-3">
                                        <label className="font-weight-bold">Company&apos;s Registered Address (*)</label>
                                        <ValidationField name="companyAddress" inputClassName="textfield mt-2 mb-2 mw-400" />
                                        <ValidationField name="companyPostal" inputClassName="wf-200 textfield" placeholder="Postal Code" />
                                      </div>
                                      <div className="col-lg-6 mb-3">
                                        <label className="font-weight-bold">Person-in-charge&apos;s Name (*)</label>
                                        <div className="d-flex">
                                          <div>
                                            <ValidationField
                                              name="offenderSalutation"
                                              inputComponent="react-select"
                                              selectClassName="d-inline-block wf-200"
                                              placeholder="Please select"
                                              options={masterCodes[MASTER_CODE.SALUTATION]}
                                            />
                                          </div>
                                          <div className="flex-fill mw-400">
                                            <ValidationField name="offenderName" inputClassName="ml-2 d-inline-block textfield" />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-6 mb-3">
                                        <label className="font-weight-bold">Person-in-charge&apos;s Designation (*)</label>
                                        <ValidationField name="offenderDesignation" inputClassName="d-inline-block textfield mw-400" />
                                      </div>
                                    </>
                                  )}
                                  <div className="col-lg-6 mb-3">
                                    <label className="font-weight-bold">Name of owner/occupier who witnessed the breeding {values.loiType !== 'TFLD' && '(*)'}</label>
                                    <div className="d-flex">
                                      <div>
                                        <ValidationField
                                          name="ownerSalutation"
                                          inputComponent="react-select"
                                          selectClassName="d-inline-block wf-200"
                                          placeholder="Please select"
                                          options={masterCodes[MASTER_CODE.SALUTATION]}
                                        />
                                      </div>
                                      <div className="flex-fill mw-400">
                                        <ValidationField name="ownerName" inputClassName="ml-2 d-inline-block textfield" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 mb-3">
                                    <label className="font-weight-bold">Offence Address (*)</label>
                                    <ValidationField name="offenceAddress" inputClassName="textfield mt-2 mb-2 mw-400" />
                                    <ValidationField name="offencePostalCode" inputClassName="wf-200 textfield" placeholder="Postal Code" />
                                  </div>
                                </div>

                                {isTenancy && (
                                  <>
                                    <hr className="marginTop10 marginBottom10" />
                                    <h1 className="font-weight-bold mt-4 mb-4">Tenant&apos;s Information</h1>
                                    <div className="row">
                                      <div className="col-lg-6">
                                        <div className="mb-3">
                                          <label className="font-weight-bold">Name</label>
                                          <ValidationField name="tenantName" inputClassName="d-inline-block textfield mw-400" />
                                        </div>
                                        <div className="mb-3">
                                          <label className="font-weight-bold">Date of Birth</label>
                                          <ValidationField inputComponent="singleDatePickerV2" name="tenantDob" />
                                        </div>
                                        <div className="mb-3">
                                          <label className="font-weight-bold">Address</label>
                                          <ValidationField name="tenantAddress" inputClassName="textfield mt-2 mb-2 mw-400" />
                                          <ValidationField name="tenantPostalCode" inputClassName="wf-200 textfield" placeholder="Postal Code" />
                                        </div>
                                      </div>
                                      <div className="col-lg-6">
                                        <div className="mb-3">
                                          <label className="font-weight-bold">NRIC No.</label>
                                          <ValidationField name="tenantNric" inputClassName="d-inline-block textfield mw-400" />
                                        </div>
                                        <div className="mb-3">
                                          <label className="font-weight-bold">Nationality</label>
                                          <div className="d-flex align-items-center">
                                            <ValidationField
                                              name="tenantNationality"
                                              inputComponent="react-select"
                                              selectClassName="d-inline-block wf-200"
                                              placeholder="Please select"
                                              options={masterCodes[MASTER_CODE.COUNTRY]}
                                            />
                                          </div>
                                        </div>
                                        <div className="mb-3">
                                          <label className="font-weight-bold">Contact No.</label>
                                          <ValidationField type="tel" name="tenantPhone" inputClassName="d-inline-block textfield mw-400" />
                                        </div>
                                        <div className="mb-3">
                                          <label className="font-weight-bold">Gender</label>
                                          <div className="d-flex align-items-center">
                                            <ValidationField
                                              name="tenantGender"
                                              inputComponent="react-select"
                                              selectClassName="d-inline-block wf-200"
                                              placeholder="Please select"
                                              options={masterCodes[MASTER_CODE.GENDER]}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {values.loiType && (
                        <>
                          <FormikSubmitErrorMessage />
                          <div className="text-center mt-2">
                            <div className="btnWrapper">
                              <button type="submit" className="btn btn-pri">
                                Generate
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </Form>
                );
              }}
            </Formik>
          )}

          <InPageLoading isLoading={isLoading || localLoading} />
          <FilePreviewModal isOpen={previewModalState.isOpen} file={previewModalState.file} onCancel={() => setPreviewModalState({ isOpen: false, file: null })} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global, detailReducers: { letterOfIntentReducer } }) => ({
  masterCodes: global.data.masterCodes,
  ...letterOfIntentReducer,
});

const mapDispatchToProps = {
  getMastercodeAction,
  getLast12MonthsLOIListAction,
  loiSubmitForApporvalAction,
  loiCreateAction,
  loiSaveAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LetterOfIntent));
