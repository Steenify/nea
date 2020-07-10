import React, { useEffect, useState } from 'react';

import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import InPageLoading from 'components/common/inPageLoading';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Breadcrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import GoBackButton from 'components/ui/go-back-button';

import './style.scss';
import { WEB_ROUTES, SUBMISSION_TYPE } from 'constants/index';
import { configMissingFieldMessage, actionTryCatchCreator } from 'utils';
import moment from 'moment';
import CustomModal from 'components/common/modal';
import DropBox from 'components/common/dropbox';
import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import { Formik, Form } from 'formik';
import ValidationField from 'components/common/formik/validationField';
import SubmitErrorMessage from 'components/common/formik/submit-error-message';
import { deleteFile } from 'services/file-operation';
import { insertNoticeAction } from './action';

const SERVED = 'SERVED';
const OTHERS = 'OTHERS';

const InsertNotice = ({ insertNoticeAction, getMastercodeAction, location: { state = {} }, history: { goBack }, ui: { isLoading = false }, reasonOption = [] }) => {
  const { noticeType = '', address = '', block = {}, isLanded = false, unitData = [] } = state;
  const [uploadModal, setUploadModal] = useState(null);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [modal, setModal] = useState({
    isShow: false,
    action: '',
    onConfirm: () => {},
  });
  const initialUnits =
    unitData?.map((item) => ({
      ...item,
      servedDate: null,
      reason: '',
      remark: '',
      uploadedFileIds: [],
    })) || [];
  useEffect(() => {
    if (!noticeType) return;
    document.title = `NEA | Insert ${noticeType?.text || ''}`;

    getMastercodeAction([MASTER_CODE.INSERT_NOTICE_REASON]);
  }, [getMastercodeAction, noticeType]);

  const deleteFileAction = (fileId = '', onSuccessHandler) => {
    const onPending = () => {
      setIsLocalLoading(true);
    };
    const onSuccess = (data) => {
      setIsLocalLoading(false);
      if (onSuccessHandler) onSuccessHandler(data);
    };
    const onError = () => {
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
      const { servedDate, reason, remark } = unit;
      if (!reason) {
        uEs.reason = 'Required';
        errorCount += 1;
      } else {
        if (reason === SERVED) {
          if (!servedDate) {
            uEs.servedDate = 'Required';
            errorCount += 1;
          }
        }
        if (reason === OTHERS) {
          if (!remark) {
            uEs.remark = 'Required';
            errorCount += 1;
          }
        }
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
  const onSubmit = (values, { setSubmitting }) => {
    const { units } = values;
    const { postalCode, blockHouseNo } = block;
    const onConfirm = () => {
      setModal({ isShow: false });
      goBack();
    };
    const param = {
      noticeType: noticeType.key || '',
      postalCode,
      blockHouseNo,
      notices: units.map((item) => {
        const { floorNo, unitNo, servedDate, reason, remark, uploadedFileIds } = item;
        const isLandedParam = isLanded ? {} : { floorNo, unitNo };
        return {
          ...isLandedParam,
          remark,
          noticeServedDate: servedDate,
          reason,
          uploadedFileIds: uploadedFileIds?.map(({ fileId }) => fileId) || [],
        };
      }),
    };
    insertNoticeAction(param, () => {
      setModal({ isShow: true, action: 'Insert', onConfirm });
    });
    setSubmitting(false);
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
          <GoBackButton onClick={goBack} title={`Insert ${noticeType?.descText || ''}: Notice to Enter Premises`} />
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
                            <td align="center" valign="middle" className="bold-font" style={{ minWidth: '200px' }}>
                              Latest Inspection Date
                            </td>
                            <td align="center" valign="middle" className="bold-font" style={{ minWidth: '200px' }}>
                              Status
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
                                {unit?.inspectionDate || ''}
                              </td>
                              <td align="center" valign="top">
                                {unit?.accessibilityDescription || ''}
                              </td>
                              <td align="left" valign="middle">
                                <div className=" navtab-select form-group">
                                  <ValidationField name={`units[${index}].reason`} inputComponent="react-select" selectClassName="d-inline-block wf-200" options={reasonOption} hideError />
                                </div>
                                {unit?.reason && (
                                  <>
                                    {unit?.reason === SERVED && (
                                      <div className="marginTop10">
                                        <ValidationField
                                          name={`units[${index}].servedDate`}
                                          placeholder="Served Date"
                                          inputComponent="singleDatePickerV2"
                                          inputClassName="d-contents"
                                          maxDate={moment()}
                                          hideError
                                        />
                                      </div>
                                    )}
                                    <div className="marginTop10">
                                      <ValidationField name={`units[${index}].remark`} inputComponent="textarea" rows={5} />
                                    </div>
                                    <div className="marginTop10">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const onChange = (fileIds) => setFieldValue(`units[${index}].uploadedFileIds`, fileIds || [], false);
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
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="btnWrapper">
                    <button type="submit" className="btn btn-pri" disabled={isSubmitting}>
                      Submit
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
                    submissionType={SUBMISSION_TYPE.NOTICE}
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
const mapStateToProps = ({ global: { data: masterCodes }, vectorInspectionReducers: { insertNotice } }) => ({
  ...insertNotice,
  reasonOption: masterCodes?.masterCodes[MASTER_CODE.INSERT_NOTICE_REASON] || [],
});

const mapDispatchToProps = { insertNoticeAction, getMastercodeAction };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InsertNotice));
