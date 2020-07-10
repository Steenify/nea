import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import PromptOnLeave from 'components/common/formik/prompt-on-leave';
import FormikSubmitErrorMessage from 'components/common/formik/submit-error-message';
import ValidationField from 'components/common/formik/validationField';
import DataTable from 'components/common/data-table';
import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';
import AddButton from 'components/common/add-button';
import GoBackButton from 'components/ui/go-back-button';

import { formikValidate } from 'utils';

import { FUNCTION_NAMES, WEB_ROUTES, tableColumnWidth } from 'constants/index';

import { getAdditionalInfoAction, updateAdditionalInfoAction, resetAdditionInfoReducer } from './action';

const OpsAdditionalInfo = (props) => {
  const {
    resetAdditionInfoReducer,
    getAdditionalInfoAction,
    updateAdditionalInfoAction,
    location: { state },
    history,
    ui: { isLoading },
    data,
    functionNameList,
  } = props;

  const [isDetailLoaded, setIsDetailLoaded] = useState(false);
  const editAllowed = state?.isEditable && functionNameList.includes(FUNCTION_NAMES.updateAdditionalInfo);
  const viewAllowed = functionNameList.includes(FUNCTION_NAMES.getAdditionalInfo);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.OPS_AREA.ADDITIONAL_INFO.name}`;
    resetAdditionInfoReducer();
    if (state?.id && viewAllowed) {
      getAdditionalInfoAction({ id: state?.id }).then(() => {
        setIsDetailLoaded(true);
      });
    } else {
      history.goBack();
    }
  }, [getAdditionalInfoAction, resetAdditionInfoReducer, history, state, viewAllowed]);

  const onSubmit = (values, actions) => {
    values.operationsInfoVOList.forEach((ops) => {
      const temp = { ...ops };

      temp.opsId = state?.id;

      Object.assign(ops, temp);
    });
    values.operationsInitiativeVOList.forEach((ops) => {
      const temp = { ...ops };

      temp.opsId = state?.id;

      Object.assign(ops, temp);
    });
    updateAdditionalInfoAction(values, () => {
      actions.resetForm();
      actions.setSubmitting(false);
      actions.setErrors({});
      toast.success('Additional Information updated');
      history.goBack();
      // history.replace(WEB_ROUTES.OPS_AREA.LANDING_PAGE.url);
    });
  };

  const validate = (values) => {
    const errors = {};

    let groundFoggingErrorCount = 0;
    if (values.operationsTreatList && values.operationsTreatList.length) {
      const operationsTreatListErrors = [];
      let operationsTreatListCount = 0;
      values.operationsTreatList.forEach((item) => {
        const treatListError = {};
        if (!item.treatmentDate) {
          treatListError.treatmentDate = 'Required';
          operationsTreatListCount += 1;
        }
        if (!item.treatmentType) {
          treatListError.treatmentType = 'Required';
          operationsTreatListCount += 1;
        }
        if (!item.location) {
          treatListError.location = 'Required';
          operationsTreatListCount += 1;
        }
        if (formikValidate(item.treatmentCount, ['required', 'min=1'])) {
          treatListError.treatmentCount = formikValidate(item.treatmentCount, ['required', 'min=1']);
          operationsTreatListCount += 1;
        }
        operationsTreatListErrors.push(treatListError);
      });
      if (operationsTreatListCount) {
        errors.operationsTreatList = operationsTreatListErrors;
        groundFoggingErrorCount += operationsTreatListCount;
      }
    }

    let operationsInfoErrorCount = 0;
    if (values.operationsInfoVOList && values.operationsInfoVOList.length) {
      const errorList = [];
      let count = 0;
      values.operationsInfoVOList.forEach((item) => {
        const error = {};

        const noofOfficersError = formikValidate(item.noofOfficers, ['positive']);
        if (noofOfficersError) {
          error.noofOfficers = noofOfficersError;
          count += 1;
        }

        const noofMozzieError = formikValidate(item.noofMozzie, ['positive']);
        if (noofMozzieError) {
          error.noofMozzie = noofMozzieError;
          count += 1;
        }

        errorList.push(error);
      });
      if (count) {
        errors.operationsInfoVOList = errorList;
        operationsInfoErrorCount += count;
      }
    }

    let operationsGravitrapInfoErrorCount = 0;
    if (values.operationsGravitrapInfoVOList && values.operationsGravitrapInfoVOList.length) {
      const errorList = [];
      let count = 0;
      values.operationsGravitrapInfoVOList.forEach((item) => {
        const error = {};

        const trapsDeployedError = formikValidate(item.trapsDeployed, ['required', 'positive']);
        if (trapsDeployedError) {
          error.trapsDeployed = trapsDeployedError;
          count += 1;
        }

        const samplesCollectedError = formikValidate(item.samplesCollected, ['required', 'positive']);
        if (samplesCollectedError) {
          error.samplesCollected = samplesCollectedError;
          count += 1;
        }

        const trapsWithSamplesError = formikValidate(item.trapsWithSamples, ['required', 'positive']);
        if (trapsWithSamplesError) {
          error.trapsWithSamples = trapsWithSamplesError;
          count += 1;
        }

        const infectedAdultsError = formikValidate(item.infectedAdults, ['required', 'positive']);
        if (infectedAdultsError) {
          error.infectedAdults = infectedAdultsError;
          count += 1;
        }

        errorList.push(error);
      });
      if (count) {
        errors.operationsGravitrapInfoVOList = errorList;
        operationsGravitrapInfoErrorCount += count;
      }
    }

    const errorCount = groundFoggingErrorCount + operationsInfoErrorCount + operationsGravitrapInfoErrorCount;

    if (errorCount) {
      let errorHint = '';
      errors.errorCount = errorCount;
      if (operationsInfoErrorCount) errorHint += `There are ${operationsInfoErrorCount} issue(s) in Operation Summary. `;
      if (groundFoggingErrorCount) errorHint += `There are ${groundFoggingErrorCount} issue(s) in Ground Fogging / Misting / Spraying. `;
      if (operationsGravitrapInfoErrorCount) errorHint += `There are ${operationsGravitrapInfoErrorCount} issue(s) in Gravitrap Details. `;
      errors.errorHint = errorHint;
    }
    return errors;
  };

  const addTreatment = (values, setFieldValue) => {
    const list = values.operationsTreatList || [];
    list.push({
      opsId: state?.id,
      treatmentDate: '',
      treatmentType: '',
      location: '',
      treatmentCount: '',
      postalCode: state?.postalcode,
    });
    setFieldValue('operationsTreatList', list);
  };

  const removeTreatment = (values, setFieldValue, index) => {
    const list = values.operationsTreatList || [];
    list.splice(index, 1);
    setFieldValue('operationsTreatList', list);
  };

  const addGravitrap = (values, setFieldValue) => {
    const list = values.operationsGravitrapInfoVOList || [];
    list.push({
      opsId: state?.id,
      trapsDeployed: '',
      location: '',
      samplesCollected: '',
      infectedAdults: '',
      collectionDate: '',
      trapsWithSamples: '',
    });
    setFieldValue('operationsGravitrapInfoVOList', list);
  };

  const removeGravitrap = (values, setFieldValue, index) => {
    const list = values.operationsGravitrapInfoVOList || [];
    list.splice(index, 1);
    setFieldValue('operationsGravitrapInfoVOList', list);
  };

  const initialValues = {
    ...data,
    operationsInfoVOList: data?.operationsInfoVOList.map((item) => ({
      ...item,
      postalCode: state?.postalcode,
    })),
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.OPS_AREA.ADDITIONAL_INFO.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.OPS_AREA, WEB_ROUTES.OPS_AREA.LANDING_PAGE, WEB_ROUTES.OPS_AREA.OPERATION_DETAIL, WEB_ROUTES.OPS_AREA.ADDITIONAL_INFO]} />
          {isDetailLoaded && (
            <Formik
              // initialValues={_.merge({}, initialValues, data)}
              initialValues={initialValues}
              validate={validate}
              onSubmit={onSubmit}
              enableReinitialize>
              {({ values, isSubmitting, setFieldValue, dirty }) => {
                const gravitrapColumns = [
                  {
                    Header: 'Number of Traps Deployed',
                    accessor: 'trapsDeployed',
                    minWidth: tableColumnWidth.lg,
                    Cell: (cellInfo) => {
                      const { index } = cellInfo;
                      const { trapsDeployed } = cellInfo.original;
                      if (!editAllowed) return <span>{trapsDeployed || ''}</span>;
                      return (
                        <div className="d-flex flex-column">
                          <ValidationField name={`operationsGravitrapInfoVOList[${index}].trapsDeployed`} inputClassName="textfield" />
                        </div>
                      );
                    },
                  },
                  {
                    Header: 'Date of Collection',
                    accessor: 'collectionDate',
                    minWidth: tableColumnWidth.xl,
                    Cell: (cellInfo) => {
                      const { index } = cellInfo;
                      const { collectionDate } = cellInfo.original;
                      if (!editAllowed) return <span>{collectionDate || ''}</span>;
                      return (
                        <ValidationField
                          name={`operationsGravitrapInfoVOList[${index}].collectionDate`}
                          placeholder="DD/MM/YYYY"
                          inputComponent="singleDatePickerV2"
                          hideError
                          dateFormat="YYYY-MM-DD"
                        />
                      );
                    },
                  },
                  {
                    Header: 'Number of Adult Samples Collected',
                    accessor: 'samplesCollected',
                    minWidth: tableColumnWidth.lg,
                    Cell: (cellInfo) => {
                      const { index } = cellInfo;
                      const { samplesCollected } = cellInfo.original;
                      if (!editAllowed) return <span>{samplesCollected || ''}</span>;
                      return (
                        <div className="d-flex flex-column">
                          <ValidationField name={`operationsGravitrapInfoVOList[${index}].samplesCollected`} inputClassName="textfield" />
                        </div>
                      );
                    },
                  },
                  {
                    Header: 'Number of Traps with Adult Samples',
                    accessor: 'trapsWithSamples',
                    minWidth: tableColumnWidth.lg,
                    Cell: (cellInfo) => {
                      const { index } = cellInfo;
                      const { trapsWithSamples } = cellInfo.original;
                      if (!editAllowed) return <span>{trapsWithSamples || ''}</span>;
                      return (
                        <div className="d-flex flex-column">
                          <ValidationField name={`operationsGravitrapInfoVOList[${index}].trapsWithSamples`} inputClassName="textfield" />
                        </div>
                      );
                    },
                  },
                  {
                    Header: 'Number of Infected Adults',
                    accessor: 'infectedAdults',
                    minWidth: tableColumnWidth.lg,
                    Cell: (cellInfo) => {
                      const { index } = cellInfo;
                      const { infectedAdults } = cellInfo.original;
                      if (!editAllowed) return <span>{infectedAdults || ''}</span>;
                      return (
                        <div className="d-flex flex-column">
                          <ValidationField name={`operationsGravitrapInfoVOList[${index}].infectedAdults`} inputClassName="textfield" />
                        </div>
                      );
                    },
                  },
                  {
                    Header: 'Location of Infected Mosquitoes',
                    accessor: 'location',
                    minWidth: tableColumnWidth.lg,
                    Cell: (cellInfo) => {
                      const { index } = cellInfo;
                      const { location } = cellInfo.original;
                      if (!editAllowed) return <span>{location || ''}</span>;
                      return <ValidationField name={`operationsGravitrapInfoVOList[${index}].location`} inputClassName="textfield" hideError />;
                    },
                  },
                  {
                    Header: '',
                    accessor: 'action',
                    minWidth: tableColumnWidth.sm,
                    Cell: (cellInfo) => {
                      const { index } = cellInfo;
                      if (!editAllowed) return <></>;
                      return <CloseIcon className="cursor-pointer" onClick={() => removeGravitrap(values, setFieldValue, index)} />;
                    },
                  },
                ];
                const treatmentColumns = [
                  {
                    Header: 'Date',
                    accessor: 'treatmentDate',
                    minWidth: tableColumnWidth.xl,
                    Cell: (cellInfo) => {
                      const { index } = cellInfo;
                      const { treatmentDate } = cellInfo.original;
                      if (!editAllowed) return <span>{treatmentDate || ''}</span>;
                      return <ValidationField name={`operationsTreatList[${index}].treatmentDate`} placeholder="DD/MM/YYYY" inputComponent="singleDatePickerV2" hideError dateFormat="YYYY-MM-DD" />;
                    },
                  },
                  {
                    Header: 'Treatment',
                    accessor: 'treatmentType',
                    minWidth: tableColumnWidth.xl,
                    Cell: (cellInfo) => {
                      const { index } = cellInfo;
                      const { treatmentType } = cellInfo.original;
                      if (!editAllowed) return <span>{treatmentType || ''}</span>;
                      return (
                        <ValidationField
                          name={`operationsTreatList[${index}].treatmentType`}
                          inputComponent="react-select"
                          selectClassName="wf-200"
                          placeholder="Treatment Type"
                          options={[
                            { label: 'Ground Fogging', value: 'Ground Fogging' },
                            { label: 'Misting', value: 'Misting' },
                            { label: 'Spraying', value: 'Spraying' },
                          ]}
                          hideError
                        />
                      );
                    },
                  },
                  {
                    Header: 'Location',
                    accessor: 'location',
                    minWidth: tableColumnWidth.xxl,
                    Cell: (cellInfo) => {
                      const { index } = cellInfo;
                      const { location } = cellInfo.original;
                      if (!editAllowed) return <span>{location || ''}</span>;
                      return <ValidationField name={`operationsTreatList[${index}].location`} inputClassName="textfield" hideError />;
                    },
                  },
                  {
                    Header: 'Number of Foggers / Misting / Spraying Machines Deployed',
                    accessor: 'treatmentCount',
                    minWidth: tableColumnWidth.xl,
                    Cell: (cellInfo) => {
                      const { index } = cellInfo;
                      const { treatmentCount } = cellInfo.original;
                      if (!editAllowed) return <span>{treatmentCount || ''}</span>;
                      return (
                        <div className="d-flex flex-column">
                          <ValidationField name={`operationsTreatList[${index}].treatmentCount`} inputClassName="textfield" />
                        </div>
                      );
                    },
                  },
                  {
                    Header: '',
                    accessor: 'action',
                    minWidth: tableColumnWidth.sm,
                    Cell: (cellInfo) => {
                      const { index } = cellInfo;
                      if (!editAllowed) return <></>;
                      return <CloseIcon className="cursor-pointer" onClick={() => removeTreatment(values, setFieldValue, index)} />;
                    },
                  },
                ];
                return (
                  <Form>
                    <PromptOnLeave dirty={dirty} />
                    <GoBackButton onClick={() => history.goBack()} title={WEB_ROUTES.OPS_AREA.ADDITIONAL_INFO.name}>
                      <button type="submit" className={`btn btn-pri mr-3 ${!editAllowed ? 'd-none' : 'ml-auto'}`} disabled={isSubmitting}>
                        Confirm
                      </button>
                    </GoBackButton>
                    <div className="tabsContainer">
                      <FormikSubmitErrorMessage />
                      <div className="tab-content">
                        <div className="tab-pane__group bg-white">
                          <p className="tab-pane__title text-white">Operation Summary</p>
                          <div className="card">
                            <div className="card-body">
                              <div className="row paddingBottom10">
                                <div className="col-md-3 col-lg-3 font-weight-bold">Operation Planning Officer&apos;s Contact Number</div>
                                <div className="col-md-9 col-lg-4">
                                  {editAllowed ? (
                                    <ValidationField type="tel" name="operationsInfoVOList[0].officerContact" inputClassName="textfield" hideError />
                                  ) : (
                                    values?.operationsInfoVOList[0]?.officerContact
                                  )}
                                </div>
                              </div>
                              <div className="row paddingBottom10">
                                <div className="col-md-3 col-lg-3 font-weight-bold">Number of Mozzie Zap Cans Used</div>
                                <div className="col-md-9 col-lg-4">
                                  {editAllowed ? <ValidationField name="operationsInfoVOList[0].noofMozzie" inputClassName="textfield" /> : values?.operationsInfoVOList[0]?.noofMozzie}
                                </div>
                              </div>
                              <div className="row paddingBottom10">
                                <div className="col-md-3 col-lg-3 font-weight-bold">Number of Officers Deployed</div>
                                <div className="col-md-9 col-lg-4">
                                  {editAllowed ? <ValidationField name="operationsInfoVOList[0].noofOfficers" inputClassName="textfield" /> : values?.operationsInfoVOList[0]?.noofOfficers}
                                </div>
                              </div>
                              <div className="row paddingBottom10">
                                <div className="col-md-3 col-lg-3 font-weight-bold">Remarks</div>
                                <div className="col-md-9 col-lg-6">
                                  {editAllowed ? <ValidationField name="operationsInfoVOList[0].remarks" inputComponent="textarea" rows={5} /> : values?.operationsInfoVOList[0]?.remarks}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tab-content">
                        <div className="tab-pane__group bg-white">
                          <p className="tab-pane__title text-white">Ground Fogging / Misting / Spraying</p>
                          <div className="card">
                            <div className="card-body">
                              <div className="row paddingBottom10">
                                <div className="col-12">
                                  <DataTable data={values.operationsTreatList} columns={treatmentColumns} />
                                </div>
                                {editAllowed && <AddButton className="mt-4" title="Add new line item" onClick={() => addTreatment(values, setFieldValue)} />}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tab-content">
                        <div className="tab-pane__group bg-white">
                          <p className="tab-pane__title text-white">Gravitrap Details</p>
                          <div className="card">
                            <div className="card-body">
                              <div className="row paddingBottom10">
                                <div className="col-12">
                                  <DataTable data={values.operationsGravitrapInfoVOList} columns={gravitrapColumns} />
                                </div>
                                {editAllowed && <AddButton className="mt-4" title="Add gravitrap details" onClick={() => addGravitrap(values, setFieldValue)} />}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tab-content">
                        <div className="tab-pane__group bg-white">
                          <p className="tab-pane__title text-white">3P Initiatives</p>
                          <div className="card">
                            <div className="card-body">
                              <div className="row paddingBottom10">
                                <div className="col-md-4 col-lg-3 font-weight-bold">MP/CCC and RC/NC Chairman Informed of the Cluster On</div>
                                <div className="col-md-8 col-lg-4">
                                  {editAllowed ? (
                                    <ValidationField name="operationsInitiativeVOList[0].informedDate" placeholder="DD/MM/YYYY" inputComponent="singleDatePickerV2" hideError dateFormat="YYYY-MM-DD" />
                                  ) : (
                                    values?.operationsInitiativeVOList[0]?.informedDate
                                  )}
                                </div>
                              </div>
                              <div className="row paddingBottom10">
                                <div className="col-md-4 col-lg-3 font-weight-bold">Name of the MP</div>
                                <div className="col-md-8 col-lg-4">
                                  {editAllowed ? <ValidationField name="operationsInitiativeVOList[0].mpName" inputClassName="textfield" hideError /> : values?.operationsInitiativeVOList[0]?.mpName}
                                </div>
                              </div>
                              <div className="row paddingBottom10">
                                <div className="col-md-4 col-lg-3 font-weight-bold">Name of CCC Chairman</div>
                                <div className="col-md-8 col-lg-4">
                                  {editAllowed ? <ValidationField name="operationsInitiativeVOList[0].ccName" inputClassName="textfield" hideError /> : values?.operationsInitiativeVOList[0]?.ccName}
                                </div>
                              </div>
                              <div className="row paddingBottom10">
                                <div className="col-md-4 col-lg-3 font-weight-bold">Name of RC/NC Chairman</div>
                                <div className="col-md-8 col-lg-4">
                                  {editAllowed ? (
                                    <ValidationField name="operationsInitiativeVOList[0].rcncName" inputClassName="textfield" hideError />
                                  ) : (
                                    values?.operationsInitiativeVOList[0]?.rcncName
                                  )}
                                </div>
                              </div>
                              <div className="row paddingBottom10">
                                <div className="col-md-4 col-lg-3 font-weight-bold">Name of 3P Officer</div>
                                <div className="col-md-8 col-lg-4">
                                  {editAllowed ? (
                                    <ValidationField name="operationsInitiativeVOList[0].threepofficer" inputClassName="textfield" hideError />
                                  ) : (
                                    values?.operationsInitiativeVOList[0]?.threepofficer
                                  )}
                                </div>
                              </div>
                              <div className="row paddingBottom10">
                                <div className="col-md-4 col-lg-3 font-weight-bold">Number of Banners (Locations)</div>
                                <div className="col-md-8 col-lg-6">
                                  {editAllowed ? <ValidationField name="operationsInitiativeVOList[0].banners" inputComponent="textarea" rows={5} /> : values?.operationsInitiativeVOList[0]?.banners}
                                </div>
                              </div>
                              <div className="row paddingBottom10">
                                <div className="col-md-4 col-lg-3 font-weight-bold">Number of House Visits (Dates and Block Number)</div>
                                <div className="col-md-8 col-lg-6">
                                  {editAllowed ? (
                                    <ValidationField name="operationsInitiativeVOList[0].housevisit" inputComponent="textarea" rows={5} />
                                  ) : (
                                    values?.operationsInitiativeVOList[0]?.housevisit
                                  )}
                                </div>
                              </div>
                              <div className="row paddingBottom10">
                                <div className="col-md-4 col-lg-3 font-weight-bold">Number of Events / Road Shows (Dates)</div>
                                <div className="col-md-8 col-lg-6">
                                  {editAllowed ? <ValidationField name="operationsInitiativeVOList[0].roadshow" inputComponent="textarea" rows={5} /> : values?.operationsInitiativeVOList[0]?.roadshow}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          )}
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global, opsAreaReducers: { additionalInfo } }, ownProps) => ({
  ...ownProps,
  ...additionalInfo,
  masterCodes: global.data.masterCodes,
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {
  getAdditionalInfoAction,
  resetAdditionInfoReducer,
  updateAdditionalInfoAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OpsAdditionalInfo));
