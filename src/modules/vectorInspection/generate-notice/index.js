import React, { useState, useEffect } from 'react';

import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Breadcrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';
import { getNoticeApproverLov } from 'services/vector-inspection';
import './style.scss';
import { NOTICE_TYPE, NOTICE_ACTION, WEB_ROUTES } from 'constants/index';
import CheckBox from 'components/common/checkbox';
import { configMissingFieldMessage, dateFromString, byteArrayToBase64 } from 'utils';
import { Formik, Form } from 'formik';
import ValidationField from 'components/common/formik/validationField';
import SubmitErrorMessage from 'components/common/formik/submit-error-message';
import CustomModal from 'components/common/modal';
import FilePreviewModal from 'components/common/file-review-modal';
import GoBackButton from 'components/ui/go-back-button';

import { generateNoticeAction, previewNoticeAction } from './action';

const APPLIED_TYPES = {
  ALL: 'All',
  INDIVIDUAL: 'Individual',
};
const appliedOptions = Object.values(APPLIED_TYPES).map((item) => ({ label: item, value: item }));

const defaultOfficers = [
  { name: '', checked: false },
  { name: '', checked: false },
  { name: '', checked: false },
  { name: '', checked: false },
  { name: '', checked: false },
];

const GenerateNotice = ({ generateNoticeAction, previewNoticeAction, location: { state = {} }, history: { goBack }, ui: { isLoading = false } }) => {
  const {
    noticeType = '',
    address = '',
    block = {},
    isLanded = false,
    unitData = [],
    // fromDetail
  } = state;
  const isS36 = noticeType.key === NOTICE_TYPE.S36.key;

  const [approverLov, setApproverLov] = useState([]);
  const [modal, setModal] = useState({ isShow: false, onConfirm: () => {} });

  const [modalState, setModalState] = useState({ isOpen: false, data: null });

  const initialUnits =
    unitData?.map((item) => ({
      ...item,
      inspectionTimeFrom: '',
      inspectionTimeTo: '',
      officeTelephoneNumber: '',
      inspectionDateChange: '',
      approver: '',
    })) || [];

  useEffect(() => {
    if (!noticeType) return;
    document.title = `NEA | Generate ${noticeType?.text || ''}`;
    getNoticeApproverLov({ noticeType: noticeType?.key || '', noticeAction: NOTICE_ACTION.GENERATE }).then((data) => {
      const lov = data?.data?.approvers || [];
      setApproverLov(lov.map((item) => ({ label: item?.fullName || '', value: item?.soeId || '' })));
    });
  }, [noticeType]);

  const initialValues = {
    units: initialUnits,
    appliedType: APPLIED_TYPES.ALL,
    authorisedOfficers: defaultOfficers,
    vicinity: '',
    allTimeFrom: '',
    allTimeTo: '',
    allApprover: '',
    allInspectionDate: '',
    allOfficeTelephoneNumber: '',
    isPreview: false,
  };

  const validate = (values) => {
    const { units, appliedType, authorisedOfficers, vicinity, allTimeFrom, allTimeTo, allApprover, allOfficeTelephoneNumber, allInspectionDate, isPreview } = values;
    const errors = {};
    let errorCount = 0;
    let timeHasError = false;
    let timeInPast = false;
    const required = 'Required';

    if (appliedType === APPLIED_TYPES.ALL) {
      if (!allApprover) {
        errors.allApprover = required;
        errorCount += 1;
      }

      if (!isS36) {
        if (!allOfficeTelephoneNumber) {
          errors.allOfficeTelephoneNumber = required;
          errorCount += 1;
        }
        if (!allTimeFrom) {
          errors.allTimeFrom = required;
          errorCount += 1;
        }
        if (!allTimeTo) {
          errors.allTimeTo = required;
          errorCount += 1;
        }
        if (allTimeFrom && allTimeTo) {
          if (!dateFromString(allTimeTo).isAfter(dateFromString(allTimeFrom))) {
            timeHasError = true;
            errors.allTimeTo = required;
            errors.allTimeFrom = required;
          } else if (dateFromString(allInspectionDate).isSame(moment(), 'date')) {
            if (!dateFromString(allTimeFrom).isAfter(moment())) {
              timeInPast = true;
              errors.allTimeFrom = required;
            }
          }
        }
      }
      if (!allInspectionDate) {
        errors.allInspectionDate = required;
        errorCount += 1;
      }
      const unitErrors = units.map((unit) => {
        const err = {};
        if (!unit.ownerName) {
          err.ownerName = required;
          errorCount += 1;
        }
        return err;
      });

      if (unitErrors.reduce((acc, curr) => acc + Object.keys(curr).length, 0) > 0) errors.units = unitErrors;
    } else {
      const unitErrors = units
        .filter((_item, index) => (isPreview ? index === 0 : true))
        .map((unit) => {
          const err = {};
          const timeTo = dateFromString(unit.inspectionTimeTo);
          const timeFrom = dateFromString(unit.inspectionTimeFrom);
          if (!unit.approver) {
            err.approver = required;
            errorCount += 1;
          }

          if (!unit.ownerName) {
            err.ownerName = required;
            errorCount += 1;
          }

          if (!isS36) {
            if (!unit.officeTelephoneNumber) {
              err.officeTelephoneNumber = required;
              errorCount += 1;
            }
            if (!unit.inspectionTimeFrom) {
              err.inspectionTimeFrom = required;
              errorCount += 1;
            }
            if (!unit.inspectionTimeTo) {
              err.inspectionTimeTo = required;
              errorCount += 1;
            }
            if (unit.inspectionTimeFrom && unit.inspectionTimeTo) {
              if (!timeTo.isAfter(timeFrom)) {
                timeHasError = true;
                err.inspectionTimeFrom = required;
                err.inspectionTimeTo = required;
              } else if (dateFromString(unit.inspectionDateChange).isSame(moment(), 'date')) {
                if (!timeFrom.isAfter(moment())) {
                  timeInPast = true;
                  err.inspectionTimeFrom = required;
                }
              }
            }
          }
          if (!unit.inspectionDateChange) {
            err.inspectionDateChange = required;
            errorCount += 1;
          }

          return err;
        });

      if (unitErrors.reduce((acc, curr) => acc + Object.keys(curr).length, 0) > 0) errors.units = unitErrors;
    }
    if (isS36) {
      if (!vicinity) {
        errors.vicinity = required;
        errorCount += 1;
      }
      const offErrors = authorisedOfficers.map((item) => {
        const err = {};
        if (item.checked) {
          if (!item.name) {
            err.name = required;
            errorCount += 1;
          }
        }
        return err;
      });
      if (offErrors.reduce((acc, curr) => acc + Object.keys(curr).length, 0) > 0) errors.authorisedOfficers = offErrors;
    }
    if (errorCount || timeHasError || timeInPast) {
      const timeError = timeHasError ? 'Inspection Time From must be before Inspection Time To.' : timeInPast ? 'Inspection Date Time From must be before current date time' : '';
      errors.errorCount = errorCount > 0 ? errorCount : 1;
      errors.errorHint = errorCount > 0 ? configMissingFieldMessage(errorCount) : timeError;
    }
    return errors;
  };

  const onSubmit = (values, { resetForm, setSubmitting }) => {
    const { units, allInspectionDate, appliedType, authorisedOfficers, vicinity, allTimeFrom, allTimeTo, allOfficeTelephoneNumber, allApprover, isPreview } = values;
    const { postalCode, blockHouseNo } = block;
    const type = noticeType?.key;
    const commonParam = {
      noticeType: type,
      postalCode,
      blockHouseNo,
    };

    const onConfirm = () => {
      setModal({ isShow: false, onConfirm: () => {} });
      resetForm();
      goBack();
    };
    const onSuccess = () => {
      setModal({ isShow: true, onConfirm });
    };

    const onPreviewSuccess = (noticeFile) => {
      const data = byteArrayToBase64(noticeFile || []);
      setModalState({ isOpen: true, data });
    };

    switch (noticeType.key) {
      case NOTICE_TYPE.S35.key:
      case NOTICE_TYPE.S35R.key: {
        const notices = units.map((item) => {
          const { floorNo, unitNo, inspectionTimeFrom, inspectionTimeTo, approver, officeTelephoneNumber, inspectionDateChange, ownerName } = item;
          const isLandedParam = isLanded ? {} : { floorNo, unitNo };
          const date = appliedType === APPLIED_TYPES.ALL ? allInspectionDate : inspectionDateChange;
          const timeFrom = appliedType === APPLIED_TYPES.ALL ? allTimeFrom : inspectionTimeFrom;
          const timeTo = appliedType === APPLIED_TYPES.ALL ? allTimeTo : inspectionTimeTo;
          const ap = appliedType === APPLIED_TYPES.ALL ? allApprover : approver;
          const phone = appliedType === APPLIED_TYPES.ALL ? allOfficeTelephoneNumber : officeTelephoneNumber;
          return {
            ...isLandedParam,
            inspectionDate: date,
            inspectionTimeFrom: timeFrom,
            inspectionTimeTo: timeTo,
            officeTelephoneNumber: phone,
            approver: ap,
            ownerName,
          };
        });
        if (isPreview) {
          previewNoticeAction({ ...commonParam, notices: notices.filter((_, index) => index === 0) }, onPreviewSuccess);
        } else {
          generateNoticeAction({ ...commonParam, notices }, onSuccess);
        }
        break;
      }
      case NOTICE_TYPE.S36.key: {
        const officersParam = {};
        authorisedOfficers.forEach((item, index) => {
          if (item.checked) {
            officersParam[`authorisedOfficer${index + 1}`] = item.name;
          }
        });
        const notices = units.map((item) => {
          const { floorNo, unitNo, approver, inspectionDateChange, ownerName } = item;
          const isLandedParam = isLanded ? {} : { floorNo, unitNo };
          const date = appliedType === APPLIED_TYPES.ALL ? allInspectionDate : inspectionDateChange;
          const ap = appliedType === APPLIED_TYPES.ALL ? allApprover : approver;
          return {
            ...isLandedParam,
            inspectionDate: date,
            approver: ap,
            ownerName,
          };
        });
        const param = {
          ...commonParam,
          ...officersParam,
          vicinity,
          allOfficer: Object.keys(officersParam).length === 0,
          notices,
        };
        if (isPreview) {
          previewNoticeAction({ ...param, notices: param.notices.filter((_, index) => index === 0) }, onPreviewSuccess);
        } else {
          generateNoticeAction(param, onSuccess);
        }
        break;
      }
      default:
        break;
    }
    setSubmitting(false);
  };

  return noticeType === '' ? (
    <Redirect to={WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION.url} />
  ) : (
    <>
      <Header />
      <div className="main-content">
        <NavBar active={WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION.name} />
        <div className="contentWrapper">
          <Breadcrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION, WEB_ROUTES.INSPECTION_MANAGEMENT.GENERATE_NOTICE]} />
          <GoBackButton onClick={goBack} title={`Generate ${noticeType?.descText || ''}: Notice to Enter Premises`} />

          <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
            {({ values, isSubmitting, setFieldValue }) => {
              const { units, appliedType, authorisedOfficers } = values;
              const isSelectAllOfficer = authorisedOfficers.filter((item) => item.checked).length === 0;
              return (
                <Form>
                  <div className="tabsContainer">
                    <SubmitErrorMessage />
                  </div>
                  <div className="mainBox">
                    <div className="row paddingBottom20 align-items-center">
                      <div className="col-lg-3 bold-font">Address of Owner/Occupier</div>
                      <div className="col-lg-3 bold-font text-blue">{address}</div>
                      {units.length > 1 && (
                        <ValidationField name="appliedType" inputComponent="react-select" selectClassName="d-inline-block wf-200 ml-auto bold-font" options={appliedOptions} isClearable={false} />
                      )}
                    </div>
                    <div className="paddingBottom30 overflow-auto">
                      <table className="simpleTbl">
                        <thead>
                          <tr>
                            {!isLanded && (
                              <>
                                <td align="center" valign="middle" className="bold-font" style={{ minWidth: '100px' }}>
                                  Unit
                                </td>
                              </>
                            )}
                            <td align="left" valign="middle" className="bold-font" style={{ minWidth: '250px' }}>
                              Name of owner/occupier
                            </td>
                            <td align="left" valign="middle" className="bold-font" style={{ minWidth: '250px' }}>
                              {noticeType?.generateDateColumn || 'Date'}
                            </td>
                            <td align="left" valign="middle" className="bold-font" style={{ minWidth: '250px' }}>
                              Inspection Date
                            </td>
                            {!isS36 && (
                              <td align="left" valign="middle" className="bold-font" style={{ minWidth: '400px' }}>
                                <div className="d-flex align-items-center">Inspection time</div>
                              </td>
                            )}
                            {!isS36 && (
                              <td align="left" valign="middle" className="bold-font" style={{ minWidth: '250px' }}>
                                Officer Telephone Number
                              </td>
                            )}
                            <td align="left" valign="middle" className="bold-font" style={{ minWidth: '250px' }}>
                              Approver
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          {units.map((unit, index) => (
                            <tr key={`unit-id-${[unit.floorNo, unit.unitNo].join('-')}`}>
                              {!isLanded && (
                                <>
                                  <td align="center" valign="middle">
                                    {[unit.floorNo, unit.unitNo].join('-')}
                                  </td>
                                </>
                              )}
                              <td align="left" valign="middle">
                                {/* {unit?.ownerName || ''} */}
                                <ValidationField name={`units[${index}].ownerName`} hideError inputClassName="textfield wf-200" />
                              </td>
                              <td align="left" valign="middle">
                                {unit?.inspectionDate || ''}
                              </td>
                              {appliedType === APPLIED_TYPES.ALL && index === 0 && (
                                <>
                                  <td rowSpan={units.length} style={{ minWidth: '200px' }}>
                                    <div className="align-items-center">
                                      <ValidationField name="allInspectionDate" inputClassName="d-contents" placeholder="DD/MM/YYYY" inputComponent="singleDatePickerV2" minDate={moment()} hideError />
                                    </div>
                                  </td>
                                  {!isS36 && (
                                    <td rowSpan={units.length} style={{ minWidth: '200px' }}>
                                      <div className="d-flex align-items-center">
                                        <div>
                                          <ValidationField name="allTimeFrom" inputComponent="timePicker" placeholder="hh:mm a" hideError />
                                        </div>
                                        <span className="marginRight20 marginLeft30">To</span>
                                        <div>
                                          <ValidationField name="allTimeTo" inputComponent="timePicker" placeholder="hh:mm a" hideError />
                                        </div>
                                      </div>
                                    </td>
                                  )}
                                  {!isS36 && (
                                    <td rowSpan={units.length} style={{ minWidth: '200px' }}>
                                      <div className="align-items-center">
                                        <ValidationField name="allOfficeTelephoneNumber" type="phone-number" hideError inputClassName="textfield wf-200" />
                                      </div>
                                    </td>
                                  )}
                                  <td rowSpan={units.length} style={{ minWidth: '200px' }}>
                                    <div className="align-items-center">
                                      <ValidationField name="allApprover" inputComponent="react-select" selectClassName="d-inline-block wf-200" options={approverLov} hideError />
                                    </div>
                                  </td>
                                </>
                              )}
                              {appliedType === APPLIED_TYPES.INDIVIDUAL && (
                                <>
                                  <td style={{ minWidth: '200px' }}>
                                    <div className="align-items-center">
                                      <ValidationField
                                        name={`units[${index}].inspectionDateChange`}
                                        inputClassName="d-contents"
                                        placeholder="DD/MM/YYYY"
                                        inputComponent="singleDatePickerV2"
                                        minDate={moment()}
                                        hideError
                                      />
                                    </div>
                                  </td>
                                  {!isS36 && (
                                    <td style={{ minWidth: '200px' }}>
                                      <div className="time-picker-box d-flex align-items-center">
                                        <div>
                                          <ValidationField name={`units[${index}].inspectionTimeFrom`} inputComponent="timePicker" placeholder="hh:mm a" hideError />
                                        </div>
                                        <span className="marginRight20 marginLeft30">To</span>
                                        <div>
                                          <ValidationField name={`units[${index}].inspectionTimeTo`} inputComponent="timePicker" placeholder="hh:mm a" hideError />
                                        </div>
                                      </div>
                                    </td>
                                  )}
                                  {!isS36 && (
                                    <td style={{ minWidth: '200px' }}>
                                      <div className="align-items-center">
                                        <ValidationField name={`units[${index}].officeTelephoneNumber`} type="phone-number" hideError inputClassName="textfield wf-200" />
                                      </div>
                                    </td>
                                  )}
                                  <td style={{ minWidth: '200px' }}>
                                    <div className="align-items-center">
                                      <ValidationField name={`units[${index}].approver`} inputComponent="react-select" selectClassName="d-inline-block wf-200" options={approverLov} hideError />
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {isS36 && (
                      <>
                        <hr />
                        <div className="row">
                          <div className="col-md-12 title bold-font paddingTop10 paddingBottom20">Annex E</div>
                        </div>
                        <div className="row">
                          <div className="col-md-12 paddingBottom15">Authorised Officers</div>
                        </div>
                        {authorisedOfficers.map((_item, index) => (
                          <div className="row paddingBottom10" key={`authorised_officer_${index + 1}`}>
                            <div className="col-md-3">
                              <ValidationField name={`authorisedOfficers[${index}].checked`} label={`  Officer ${index + 1}`} inputComponent="checkbox" />
                            </div>
                            <div className="col-md-5">
                              <ValidationField name={`authorisedOfficers[${index}].name`} hideError />
                            </div>
                          </div>
                        ))}

                        <div className="row paddingBottom10">
                          <div className="col-md-3">
                            <CheckBox
                              checked={isSelectAllOfficer}
                              label="All Officers"
                              onChange={() =>
                                setFieldValue(
                                  'authorisedOfficers',
                                  authorisedOfficers.map((item) => ({
                                    ...item,
                                    checked: !!isSelectAllOfficer,
                                  })),
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-12 small-grey-text paddingBottom5">Description of vicinity</div>
                          <div className="col-md-8">
                            <ValidationField name="vicinity" inputComponent="textarea" rows={5} hideError />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="text-left paddingLeft30 marginTop10 marginBottom50">
                    <button onClick={() => setFieldValue('isPreview', true, false)} type="submit" className="btn btn-sec marginRight20" disabled={isSubmitting}>
                      Preview
                    </button>
                    <button className="btn btn-pri" disabled={isSubmitting} type="submit" onClick={() => setFieldValue('isPreview', false, false)}>
                      Submit for Approval
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
          <Footer />
          <InPageLoading isLoading={isLoading} />
          <FilePreviewModal isOpen={modalState.isOpen} file={modalState.data} onCancel={() => setModalState({ isOpen: false, data: null })} />
          <CustomModal isOpen={modal.isShow} type="system-modal" headerTitle="Generate Notice Successfully" confirmTitle="OK" onConfirm={modal.onConfirm} />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ vectorInspectionReducers: { generateNotice } }) => ({ ...generateNotice });

const mapDispatchToProps = { generateNoticeAction, previewNoticeAction };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GenerateNotice));
