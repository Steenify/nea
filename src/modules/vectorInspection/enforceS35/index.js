import React, { useEffect, useState } from 'react';

import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import InPageLoading from 'components/common/inPageLoading';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Breadcrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';

import './style.scss';
import { WEB_ROUTES, SUBMISSION_TYPE } from 'constants/index';
import { configMissingFieldMessage, actionTryCatchCreator } from 'utils';
import CustomModal from 'components/common/modal';
import DropBox from 'components/common/dropbox';
import { Formik, Form } from 'formik';
import ValidationField from 'components/common/formik/validationField';
import SubmitErrorMessage from 'components/common/formik/submit-error-message';
import GoBackButton from 'components/ui/go-back-button';
import { deleteFile } from 'services/file-operation';
import { enforceS35Action } from './action';

const EnforceNotice = ({ enforceS35Action, location: { state = {} }, history: { goBack }, ui: { isLoading = false } }) => {
  const { noticeType = '', address = '', block = {}, isLanded = false, unitData = [] } = state;
  const [uploadModal, setUploadModal] = useState(null);
  const [modal, setModal] = useState({ isShow: false, action: '', onConfirm: () => {} });
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const initialUnits =
    unitData?.map((item) => ({
      ...item,
      remark: '',
      uploadedFileIds: [],
      enforce: true,
    })) || [];
  useEffect(() => {
    if (!noticeType) return;
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.ENFORCE_S35.name}`;
  }, [noticeType]);

  const deleteFileAction = (fileId = '', onSuccessHandler) => {
    const onPending = () => {
      setIsLocalLoading(true);
    };
    const onSuccess = (data) => {
      setIsLocalLoading(false);
      if (onSuccessHandler) onSuccessHandler(data);
    };
    const onError = (_error) => {
      setIsLocalLoading(false);
    };
    actionTryCatchCreator(deleteFile({ fileId }), onPending, onSuccess, onError);
  };

  const validate = (values) => {
    const { units } = values;
    const errors = {};
    let errorCount = 0;
    const unitErrors = units?.map((unit) => {
      const uEs = {};
      const { remark, enforce } = unit;
      if (enforce === '') {
        uEs.enforce = 'Required';
        errorCount += 1;
      }
      if (enforce === false && !remark) {
        uEs.remark = 'Required';
        errorCount += 1;
      }
      return uEs;
    });
    if (unitErrors.reduce((acc, cur) => acc + Object.keys(cur).length, 0) > 0) errors.units = unitErrors;
    if (errorCount) {
      errors.errorCount = errorCount;
      errors.errorHint = configMissingFieldMessage(errorCount);
    }
    return errors;
  };
  const onSubmit = (values, { resetForm }) => {
    const { units } = values;
    const { postalCode, blockHouseNo } = block;
    const param = {
      postalCode,
      blockHouseNo,
      enforcements: units.map((item) => {
        const { floorNo, unitNo, remark, uploadedFileIds, enforce } = item;
        const isLandedParam = isLanded ? {} : { floorNo, unitNo };
        return {
          ...isLandedParam,
          proceedToEnforce: enforce,
          reason: remark,
          uploadedFileIds: uploadedFileIds?.map(({ fileId }) => fileId) || [],
        };
      }),
    };
    const onConfirm = () => {
      setModal({ isShow: false });
      resetForm();
      goBack();
    };
    enforceS35Action(param, () => {
      setModal({ isShow: true, action: 'Enforce', onConfirm });
    });
  };

  const initialValues = {
    units: initialUnits,
  };

  return noticeType === '' ? (
    <Redirect to={WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION.url} />
  ) : (
    <>
      <Header />
      <div className="main-content">
        <NavBar active={WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION.name} />
        <div className="contentWrapper">
          <Breadcrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION, WEB_ROUTES.INSPECTION_MANAGEMENT.ENFORCE_S35]} />
          <GoBackButton onClick={goBack} title={WEB_ROUTES.INSPECTION_MANAGEMENT.ENFORCE_S35.name} />
          <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
            {({ values, isSubmitting, setFieldValue }) => {
              const units = values?.units || [];
              return (
                <Form>
                  <div className="tabsContainer">
                    <SubmitErrorMessage />
                  </div>
                  <div className="mainBox">
                    <div className="row paddingBottom20">
                      <div className="col-lg-3 bold-font">Address of Owner/Occupier</div>
                      <div className="col-lg-9 bold-font text-blue">{address}</div>
                    </div>
                    <div className="overflow-auto">
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
                            <td align="center" valign="middle" className="bold-font" style={{ minWidth: '300px' }}>
                              Latest Inspection Date and Time
                            </td>
                            <td align="center" valign="middle" className="bold-font" style={{ minWidth: '200px' }}>
                              Status
                            </td>
                            <td align="center" valign="middle" className="bold-font" style={{ minWidth: '300px' }}>
                              Inspection Date and Time Indicated in S35
                            </td>
                            <td align="center" valign="middle" className="bold-font" width="200px" style={{ minWidth: '200px', maxWidth: '240px' }}>
                              Enforce?
                            </td>
                            <td align="center" valign="middle" className="bold-font" style={{ minWidth: '300px' }}>
                              Reason
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          {units.map((unit, index) => (
                            <tr key={`unit-id-${[unit.floorNo, unit.unitNo].join('-')}`}>
                              {!isLanded && (
                                <>
                                  <td align="center" valign="top">
                                    {[unit.floorNo, unit.unitNo].join('-')}
                                  </td>
                                </>
                              )}
                              <td align="center" valign="top">
                                {unit?.inspectionDate}
                              </td>
                              <td align="center" valign="top">
                                {unit?.accessibilityDescription || ''}
                              </td>
                              <td align="center" valign="top">
                                {unit?.inspectionDateForS35}
                              </td>
                              <td align="center" valign="top">
                                <div className="d-flex justify-content-between">
                                  <span className="custom-radio paddingBottom5 mr-2">
                                    <ValidationField type="radio" id={`${index + 1}-true`} name={`units[${index}].enforce`} value hideError />
                                    <label className="form-label" htmlFor={`${index + 1}-true`}>
                                      Yes
                                    </label>
                                  </span>
                                  <span className="custom-radio paddingBottom5">
                                    <ValidationField type="radio" id={`${index + 1}-false`} name={`units[${index}].enforce`} value={false} hideError />
                                    <label className="form-label" htmlFor={`${index + 1}-false`}>
                                      No
                                    </label>
                                  </span>
                                </div>
                              </td>
                              <td align="left" valign="middle">
                                <div className="marginTop10">
                                  <ValidationField name={`units[${index}].remark`} inputComponent="textarea" rows={5} />
                                </div>
                                <div className="marginTop10">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const onChange = (fileIds) => setFieldValue(`units[${index}].uploadedFileIds`, fileIds, false);
                                      setUploadModal({
                                        unit,
                                        onChange,
                                      });
                                    }}
                                    className="btn btn-pri">
                                    Upload Document
                                  </button>
                                </div>
                                <div className="marginTop10 upload-drop-zone__file">
                                  {unit?.uploadedFileIds?.map(({ fileId = '', fileName = '' }, indexTemp) => {
                                    const fileIds = unit?.uploadedFileIds || [];
                                    const fs = fileIds.filter((file) => file?.fileId !== fileId);
                                    const onSuccess = () => setFieldValue(`units[${index}].uploadedFileIds`, fs, false);
                                    return (
                                      <li key={`${fileId}_${indexTemp + 1}`}>
                                        {`${fileName}`}
                                        <div className="remove-button" onClick={() => deleteFileAction(fileId, onSuccess)} />
                                      </li>
                                    );
                                  }) || null}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="btnWrapper">
                    <button type="submit" className="btn btn-pri" disabled={isSubmitting}>
                      Submit to EEMS2
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
          <Footer />
          <InPageLoading isLoading={isLoading || isLocalLoading} />
        </div>
        <CustomModal isOpen={modal.isShow} type="system-modal" headerTitle={`${modal.action} Successfully`} confirmTitle="OK" onConfirm={modal.onConfirm} />
        <CustomModal
          headerTitle={`Upload Document ${isLanded ? '' : `for unit ${[(uploadModal?.unit?.floorNo, uploadModal?.unit?.unitNo)].join('-')}`}`}
          confirmTitle="OK"
          isOpen={uploadModal !== null}
          onConfirm={() => {
            setUploadModal(null);
          }}
          onCancel={() => {
            setUploadModal(null);
          }}
          type="action-modal"
          content={
            <form className="form-group">
              <div className="row">
                <div className="col-lg-12">
                  <DropBox
                    size="sm"
                    submissionType={SUBMISSION_TYPE.SAMPLEID}
                    fileIdList={uploadModal?.unit?.uploadedFileIds?.map((file) => file.fileId) || []}
                    onChange={(fileList) => {
                      const uploadedFiles = fileList.map(({ fileName, fileId }) => ({ fileId, fileName }));
                      if (uploadModal?.onChange) uploadModal.onChange(uploadedFiles);
                    }}
                  />
                </div>
              </div>
            </form>
          }
        />
      </div>
    </>
  );
};
const mapStateToProps = ({ vectorInspectionReducers: { enforceS35 } }) => ({ ...enforceS35 });

const mapDispatchToProps = { enforceS35Action };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EnforceNotice));
