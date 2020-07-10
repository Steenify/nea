import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TabContent, TabPane } from 'reactstrap';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import _ from 'lodash';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import InPageLoading from 'components/common/inPageLoading';
import Footer from 'components/ui/footer';
import CustomModal from 'components/common/modal';
import TabNav from 'components/ui/tabnav';
import FormikSubmitErrorMessage from 'components/common/formik/submit-error-message';
import PromptOnLeave from 'components/common/formik/prompt-on-leave';
import GoBackButton from 'components/ui/go-back-button';

import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import { WEB_ROUTES, FUNCTION_NAMES } from 'constants/index';

import { viewForm3DetailAction, saveForm3DetailAction, submitForm3DetailAction, submitForm3EnforcementAction, voidForm3DetailAction } from './action';
import Form3InfoTab from './info-tab';
import Form3EnforcementTab from './enforcement-tab';
import Form3SamplesTab from './samples-tab';

import { Form3Mode, form3Validation } from './helper';

const Form3Detail = (props) => {
  const {
    location: { state },
    history,
    // match: {
    //   params: { id: form3Id },
    // },
    ui: { isLoading, isDetailLoaded },
    data: { form3VO },
    viewForm3DetailAction,
    saveForm3DetailAction,
    getMastercodeAction,
    submitForm3DetailAction,
    submitForm3EnforcementAction,
    voidForm3DetailAction,
    masterCodes,
    functionNameList,
  } = props;

  const mode = state?.action || Form3Mode.view;
  const accessMode = state?.isFromWorkspace ? 'edit' : 'view';
  const form3Id = state?.form3Id || '';
  const isShowEnforcement = mode === Form3Mode.enforce || form3VO?.isEnableEnforcementTab === true;
  const tabNavMenu = ['Info', 'Samples'];
  const [activeTabNav, toggleTabNav] = useState('0');
  const [modalState, setModalState] = useState({ open: false, type: '', onConfirm: () => {}, header: '' });
  const [voidReason, setVoidReason] = useState();
  const [rejectionRemark, setRejectionRemark] = useState();
  const canCreateLOI = functionNameList.includes(FUNCTION_NAMES.getLOIListing) && mode === Form3Mode.enforce;

  if (isShowEnforcement && mode !== Form3Mode.void) {
    tabNavMenu.push('Enforcement');
  }

  const initialValues = {
    isStandardFormat: true,
    regionOfficeCode: '',
    premiseFullAddress: '',
    ownerName: '',
    ownerId: '',
    ownerFullAddress: '',
    routeTo: '',
    premiseType: '',
    postalCode: '',
    streetName: '',
    buildingName: '',
    blockHouseNo: '',
    floorNo: '',
    unitNo: '',
    enforcement: {
      offenderIdType: '',
      offenderId: '',
      offenceCode: '',
      loiType: '',
      loiSubmittedDate: '',
      loiSubmittedTime: '',
      loiStatus: '',
      isEnforcementToEEMS2: '',
    },
    isEnableEnforcementTab: false,
    // ...form3VO,
  };

  const onSubmit = (values, actions) => {
    actions.setSubmitting(false);
    actions.setErrors({});
    if (mode === Form3Mode.create) {
      const form3Data = !values.isStandardFormat
        ? {
            regionOfficeCode: values.regionOfficeCode,
            ownerName: values.ownerName,
            ownerId: values.ownerId,
            ownerFullAddress: values.ownerFullAddress,
            routeTo: values.routeTo,
            isStandardFormat: values.isStandardFormat,
            premiseFullAddress: values.premiseFullAddress,
          }
        : {
            regionOfficeCode: values.regionOfficeCode,
            ownerName: values.ownerName,
            ownerId: values.ownerId,
            ownerFullAddress: values.ownerFullAddress,
            routeTo: values.routeTo,
            isStandardFormat: values.isStandardFormat,
            premiseType: values.premiseType,
            postalCode: values.postalCode,
            streetName: values.streetName,
            buildingName: values.buildingName,
            blockHouseNo: values.blockHouseNo,
            floorNo: values.floorNo,
            unitNo: values.unitNo,
          };
      const data = {
        form3Id,
        form3VO: form3Data,
      };
      if (values.isSaving) {
        saveForm3DetailAction(data, () => {
          actions.resetForm();
          toast.success('Task saved');
          viewForm3DetailAction({ form3Id, accessMode });
        });
      } else {
        const onConfirm = () =>
          submitForm3DetailAction(data, () => {
            actions.resetForm();
            history.replace(WEB_ROUTES.MY_WORKSPACE.url);
          });
        if (form3VO.taskReferenceTypeCode === 'TC') {
          setModalState({
            open: true,
            type: 'routeForm3',
            header: 'Form 3 will be routed to TC Fine Regime. Proceed?',
            onConfirm,
          });
        } else {
          setModalState({
            open: true,
            type: 'routeForm3',
            header: `Form 3 will be routed to ${values.routeTo === 'TL' ? 'yourself' : 'IEU Officer'}. Proceed?`,
            onConfirm,
          });
        }
      }
    } else {
      const { enforcement } = values;
      const data = {
        form3Id,
        form3VO: {
          enforcement: {
            offenderIdType: enforcement.offenderIdType,
            offenderId: enforcement.offenderId,
            offenceCode: enforcement.offenceCode,
            isEnforcementToEEMS2: enforcement.isEnforcementToEEMS2,
            reasonNotEnforce: rejectionRemark,
          },
        },
      };
      if (values.isSaving) {
        saveForm3DetailAction(data, () => {
          actions.resetForm();
          toast.success('Task saved');
          viewForm3DetailAction({ form3Id, accessMode });
        });
      } else {
        submitForm3EnforcementAction(data, () => {
          actions.resetForm();
          history.push(WEB_ROUTES.MY_WORKSPACE.url);
        });
      }
    }
  };

  useEffect(() => {
    document.title = 'NEA | Form 3';
    if (form3Id) {
      viewForm3DetailAction({ form3Id, accessMode });
      getMastercodeAction([MASTER_CODE.OFFENDER_ID_TYPE, MASTER_CODE.PREMISES_TYPE, MASTER_CODE.RO_CODE]);
    } else {
      history.goBack();
    }
  }, [getMastercodeAction, viewForm3DetailAction, form3Id, accessMode, history]);

  const voidForm3 = () => {
    if (!voidReason) {
      toast.error('Void reason is required');
      return;
    }
    voidForm3DetailAction({ form3Id, voidReason }, () => {
      toast.success('Form3 Voided');
      setModalState({ open: false });
      history.goBack();
    });
  };

  return (
    <>
      <div>
        <Header />

        <div className="main-content">
          <NavBar active="Form 3 Detail" />

          <div className="contentWrapper">
            <NewBreadCrumb page={[WEB_ROUTES.DETAILS.FORM3]} />
            {isDetailLoaded && (
              <Formik initialValues={_.merge({}, initialValues, form3VO)} enableReinitialize validate={(values) => form3Validation(mode, values)} onSubmit={onSubmit}>
                {({ values, setFieldValue, submitForm, dirty, validateForm }) => (
                  <Form>
                    <CustomModal
                      isOpen={modalState.open && modalState.type === 'submitLOI'}
                      type="system-modal"
                      headerTitle={`LOI has not been submitted or approved. ${'\n'} Are you sure you want to submit Form 3?.`}
                      cancelTitle="Cancel"
                      onCancel={() => setModalState({ open: false })}
                      confirmTitle="Yes"
                      onConfirm={() => {
                        setModalState({ open: false });
                        submitForm();
                      }}
                    />
                    <CustomModal
                      isOpen={modalState.open && modalState.type === 'voidForm3'}
                      type="action-modal"
                      headerTitle="Void Reason"
                      cancelTitle="Cancel"
                      onCancel={() => setModalState({ open: false })}
                      confirmTitle="Submit"
                      onConfirm={voidForm3}
                      content={
                        <div>
                          <input className="textfield" value={voidReason} onChange={(e) => setVoidReason(e.target.value)} />
                        </div>
                      }
                    />
                    <CustomModal
                      isOpen={modalState.open && modalState.type === 'routeForm3'}
                      type="system-modal"
                      headerTitle={modalState.header}
                      cancelTitle="Cancel"
                      onCancel={() => setModalState({ open: false })}
                      confirmTitle="Yes"
                      onConfirm={() => {
                        setModalState({ open: false });
                        modalState.onConfirm();
                      }}
                    />
                    <PromptOnLeave dirty={dirty} />
                    <GoBackButton onClick={() => history.goBack()} title={`Form 3 ID : ${form3Id}`}>
                      {mode !== Form3Mode.view && (
                        <>
                          <button type="button" className={`btn btn-sec m-1 ${mode === Form3Mode.void ? 'ml-auto' : 'd-none'}`} onClick={() => setModalState({ open: true, type: 'voidForm3' })}>
                            Void
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sec m-1 ${mode === Form3Mode.create || mode === Form3Mode.enforce ? 'ml-auto' : 'd-none'}`}
                            onClick={() => {
                              setFieldValue('isSaving', true, false);
                              submitForm();
                            }}>
                            Save
                          </button>
                          {(mode === Form3Mode.create || mode === Form3Mode.enforce) && (
                            <button
                              type="button"
                              // className={`btn btn-pri m-1 ${mode !== Form3Mode.create && 'ml-auto'}`}
                              className="btn btn-pri m-1"
                              onClick={() => {
                                setFieldValue('isSaving', false, false);
                                validateForm().then((errors) => {
                                  if (mode === Form3Mode.create) submitForm();
                                  else if (!_.isEmpty(errors)) {
                                    submitForm();
                                  } else {
                                    const onSubmitEnforcment = () => {
                                      const isLOIApproved = values.enforcement?.loiStatus === 'Approved';
                                      if (isLOIApproved) submitForm();
                                      else setModalState({ open: true, type: 'submitLOI' });
                                    };
                                    if (values.enforcement.isEnforcementToEEMS2) {
                                      onSubmitEnforcment();
                                    } else {
                                      setModalState({ open: true, type: 'reject', onConfirm: onSubmitEnforcment });
                                    }
                                  }
                                });
                              }}>
                              Submit
                            </button>
                          )}
                        </>
                      )}
                    </GoBackButton>

                    <div className="tab__main">
                      <div className="tabsContainer">
                        <FormikSubmitErrorMessage />
                        <TabNav onToggleTab={toggleTabNav} activeTab={activeTabNav} menu={tabNavMenu} />
                        <TabContent activeTab={activeTabNav}>
                          <TabPane tabId="0">
                            <Form3InfoTab detail={values} mode={mode} />
                          </TabPane>
                          <TabPane tabId="1">
                            <Form3SamplesTab samples={values.samples || []} specimen={values.specimen} enforceable={values.enforceable} />
                          </TabPane>
                          {isShowEnforcement && mode !== Form3Mode.void && (
                            <TabPane tabId="2">
                              <Form3EnforcementTab form3Id={form3Id} enforcement={values.enforcement} masterCodes={masterCodes} mode={mode} canCreateLOI={canCreateLOI} />
                            </TabPane>
                          )}
                        </TabContent>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
            <InPageLoading isLoading={isLoading} />
            <Footer />

            <CustomModal
              headerTitle="Reason for Non-Enforcement"
              confirmTitle="Submit"
              cancelTitle="Cancel"
              isOpen={modalState.open && modalState.type === 'reject'}
              onConfirm={() => {
                if (!rejectionRemark) {
                  toast.error('Please enter Reason for Non-Enforcement');
                  return;
                }
                modalState.onConfirm();
              }}
              onCancel={() => {
                setModalState({ open: false });
                setRejectionRemark(undefined);
              }}
              type="action-modal"
              content={
                <form className="form-group">
                  <div className="row paddingBottom20">
                    <div className="col-lg-12">
                      <textarea className="form-control" rows={3} onChange={(e) => setRejectionRemark(e.target.value)} />
                    </div>
                  </div>
                </form>
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global, detailReducers: { form3Reducer } }) => ({
  masterCodes: global.data.masterCodes,
  functionNameList: global?.data?.functionNameList || [],
  ...form3Reducer,
});

const mapDispatchToProps = {
  viewForm3DetailAction,
  saveForm3DetailAction,
  submitForm3DetailAction,
  submitForm3EnforcementAction,
  voidForm3DetailAction,
  getMastercodeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Form3Detail));
