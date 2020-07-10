import React, { useState } from 'react';
import { connect } from 'react-redux';
import { TabContent, TabPane } from 'reactstrap';
import { Formik, Form } from 'formik';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import TabNav from 'components/ui/tabnav';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import PromptOnLeave from 'components/common/formik/prompt-on-leave';
import FormikSubmitErrorMessage from 'components/common/formik/submit-error-message';
import GoBackButton from 'components/ui/go-back-button';

import { WEB_ROUTES } from 'constants/index';

import AuditResults from 'components/pages/fogging-audit/audit-results';
import FoggingInfo from 'components/pages/fogging-audit/fogging-info';
import Enforcement from 'components/pages/fogging-audit/enforcement';
import Assignment from 'components/pages/fogging-audit/assignment';

import { getFoggingEnforcementDetailService, saveFoggingEnforcementService, submitFoggingEnforcementService } from 'services/fogging-audit';
import { actionTryCatchCreator } from 'utils';
import { toast } from 'react-toastify';

const EnforcementDetail = (props) => {
  const {
    history,
    location: { state },
  } = props;

  const tabNavMenu = ['Fogging Info', 'Audit Results', 'Enforcement Recommendation', 'Assignment History'];
  const [activeTabNav, toggleTabNav] = useState('0');
  const [detail, setDetail] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const getDetailAction = async (params) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setDetail(data);
      setIsLoading(false);
    };
    const onError = () => {
      setIsLoading(false);
      setDetail({});
    };
    await actionTryCatchCreator(getFoggingEnforcementDetailService(params), onPending, onSuccess, onError);
  };

  useState(() => {
    document.title = `NEA | ${WEB_ROUTES.FOGGING_AUDIT.FOGGING_WORKSPACE_ENFORCEMENT_DETAIL.name}`;
    if (state?.auditTaskId) {
      getDetailAction({ auditTaskId: state?.auditTaskId });
    } else {
      history.goBack();
    }
  }, []);

  const showAcknowledgementMessage = (lapses) => {
    const isManager = state?.action === 'confirm';
    const totalCount = lapses.length;
    let compliantNonEnforcement = 0;
    let compliantEnforcement = 0;
    let nonCompliantNonEnforcement = 0;
    // let nonCompliantEnforcement = 0;
    let enforcement = 0;
    let nonEnforcment = 0;

    lapses.forEach((lapse) => {
      if (lapse.isEnforced) enforcement += 1;
      if (!lapse.isEnforced) nonEnforcment += 1;
      if (lapse.isCompliant && !lapse.isEnforced) compliantNonEnforcement += 1;
      if (lapse.isCompliant && lapse.isEnforced) compliantEnforcement += 1;
      // if (!lapse.isCompliant && lapse.isEnforced) nonCompliantEnforcement += 1;
      if (!lapse.isEnforced && !lapse.isCompliant) nonCompliantNonEnforcement += 1;
    });

    if (!isManager) {
      // * Task only has compliant items, and they are all indicated as "No" for enforcement.
      if (compliantNonEnforcement === totalCount) {
        toast.success('Task submitted. No enforcement required.');
        return;
      }
      // * As long as there is one compliant item indicated as "Yes" for enforcement, route to Manager.
      // * As long as there is one non-compliant item indicated as "No" for enforcement, route to Manager.
      if (compliantEnforcement > 0 || nonCompliantNonEnforcement > 0) {
        toast.success('Task submitted for approval.');
        return;
      }
      // * All non-compliant items are indicated as "Yes" for enforcement, and all compliant items are indicated as "No" for enforcement.
      if (compliantEnforcement === 0 && nonCompliantNonEnforcement === 0) {
        toast.success('Enforcement submitted to EEMS2.');
      }
    } else {
      // * As long as one item is indicated as "Yes" for enforcement.
      if (enforcement > 0) {
        toast.success('Enforcement submitted to EEMS2.');
        return;
      }
      // * All items are indicated as "No" for enforcement.
      if (nonEnforcment === totalCount) {
        toast.success('Task submitted. No enforcement required.');
      }
    }

    // if (!isManager) {
    //   // * RO TL submits a non-compliant item for non-enforcement.
    //   if (nonCompliantNonEnforcement > 0) {
    //     toast.success('Task submitted for approval.');
    //     return;
    //   }
    //   // * RO TL submits a non-compliant item for enforcement.
    //   if (nonCompliantEnforcement > 0) {
    //     toast.success('Enforcement submitted to EEMS2.');
    //     return;
    //   }
    //   // * RO TL submits a compliant item for enforcement.
    //   if (compliantEnforcement > 0) {
    //     toast.success('Task submitted for approval.');
    //     return;
    //   }
    //   // * RO TL submits a compliant item for non-enforcement.
    //   if (compliantNonEnforcement > 0) {
    //     toast.success('Task submitted. No enforcement required.');
    //     return;
    //   }
    // } else {
    //   // * Manager submits a non-compliant item for non-enforcement.
    //   if (nonCompliantNonEnforcement > 0) {
    //     toast.success('Task submitted. No enforcement required.');
    //     return;
    //   }
    //   // * Manager submits a non-compliant item for enforcement.
    //   if (nonCompliantEnforcement > 0) {
    //     toast.success('Enforcement submitted to EEMS2.');
    //     return;
    //   }
    //   // * Manager submits a compliant item for enforcement.
    //   if (compliantEnforcement > 0) {
    //     toast.success('Enforcement submitted to EEMS2.');
    //     return;
    //   }
    //   // * Manager submits a compliant item for non-enforcement.
    //   if (compliantNonEnforcement > 0) {
    //     toast.success('Task submitted. No enforcement required.');
    //     return;
    //   }
    // }
  };

  const onSubmit = (values, actions) => {
    if (values.isSaving) {
      const onPending = () => setIsLoading(true);
      const onSuccess = () => {
        toast.success('Task saved');
        getDetailAction({ auditTaskId: state?.auditTaskId });
        actions.setSubmitting(false);
        actions.setErrors({});
      };
      const onError = () => setIsLoading(false);
      actionTryCatchCreator(saveFoggingEnforcementService(values), onPending, onSuccess, onError);
    } else {
      const onPending = () => setIsLoading(true);
      const onSuccess = () => {
        actions.resetForm();
        actions.setSubmitting(false);
        actions.setErrors({});
        history.goBack();
        showAcknowledgementMessage(values.lapses);
      };
      const onError = () => setIsLoading(false);
      actionTryCatchCreator(submitFoggingEnforcementService(values), onPending, onSuccess, onError);
    }
  };

  const validate = (values) => {
    let errorCount = 0;
    const lapsesErrors = [];
    values.lapses.forEach((lapse) => {
      const error = {};
      if (lapse.isEnforced === undefined) {
        error.isEnforced = 'Required';
        errorCount += 1;
      } else if (((lapse.isEnforced && lapse.isCompliant) || (!lapse.isEnforced && !lapse.isCompliant)) && !lapse.remarks) {
        error.remarks = 'Required';
        errorCount += 1;
      }
      lapsesErrors.push(error);
    });
    const errors = {};
    if (errorCount > 0) {
      errors.errorCount = errorCount;
      errors.errorHint = `There are ${errorCount} missing required fields in the Enforcement Recommendation tab.`;
      errors.lapses = lapsesErrors;
    }
    return errors;
  };

  const getInitialValues = () => {
    const lapses = (state?.action === 'confirm' ? detail?.managerEnforcements : detail?.teamLeaderEnforcements) || [];
    const LSE = lapses.find((lapse) => lapse.lapseTypeCode === 'LSE') || {};
    const PRD = lapses.find((lapse) => lapse.lapseTypeCode === 'PRD') || {};
    const PPE = lapses.find((lapse) => lapse.lapseTypeCode === 'PPE') || {};
    const NTF = lapses.find((lapse) => lapse.lapseTypeCode === 'NTF') || {};
    const OTH = lapses.find((lapse) => lapse.lapseTypeCode === 'OTH') || {};
    const initialValues = {
      auditTaskId: state?.auditTaskId,
      isSaving: true,
      lapses: [
        {
          lapseType: 'Licence Lapse',
          lapseTypeCode: 'LSE',
          isEnforced: LSE?.isEnforced,
          isCompliant: LSE?.isCompliant,
          remarks: LSE?.remarks || '',
          fileIds: LSE?.documents.map((file) => file.fileId) || [],
        },
        {
          lapseType: 'Product Lapse',
          lapseTypeCode: 'PRD',
          isEnforced: PRD?.isEnforced,
          isCompliant: PRD?.isCompliant,
          remarks: PRD?.remarks || '',
          fileIds: PRD?.documents.map((file) => file.fileId) || [],
        },
        {
          lapseType: 'Personal Protective Equipment Lapse',
          lapseTypeCode: 'PPE',
          isEnforced: PPE?.isEnforced,
          isCompliant: PPE?.isCompliant,
          remarks: PPE?.remarks || '',
          fileIds: PPE?.documents.map((file) => file.fileId) || [],
        },
        {
          lapseType: 'Notification Lapse',
          lapseTypeCode: 'NTF',
          isEnforced: NTF?.isEnforced,
          isCompliant: NTF?.isCompliant,
          remarks: NTF?.remarks || '',
          fileIds: NTF?.documents.map((file) => file.fileId) || [],
        },
        {
          lapseType: 'Other Lapses',
          lapseTypeCode: 'OTH',
          isEnforced: OTH?.isEnforced,
          isCompliant: OTH?.isCompliant,
          remarks: OTH?.remarks || '',
          fileIds: OTH?.documents.map((file) => file.fileId) || [],
        },
      ],
    };

    return initialValues;
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.MY_WORKSPACE, WEB_ROUTES.FOGGING_AUDIT.FOGGING_WORKSPACE_ENFORCEMENT_DETAIL]} />
          {detail && (
            <Formik initialValues={getInitialValues()} validate={validate} onSubmit={onSubmit} enableReinitialize>
              {({ setFieldValue, submitForm, dirty }) => (
                <Form>
                  <PromptOnLeave dirty={dirty} />
                  <GoBackButton onClick={() => history.goBack()} title={`Inspection ID: ${state?.inspectionId}`}>
                    {(state?.action === 'propose' || state?.action === 'confirm') && (
                      <>
                        <button
                          type="button"
                          className="btn btn-sec m-2 ml-auto"
                          onClick={() => {
                            setFieldValue('isSaving', true, false);
                            submitForm();
                          }}>
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-pri m-2"
                          onClick={() => {
                            setFieldValue('isSaving', false, false);
                            submitForm();
                          }}>
                          Submit
                        </button>
                      </>
                    )}
                  </GoBackButton>

                  <nav className="tab__main">
                    <div className="tabsContainer">
                      <FormikSubmitErrorMessage />
                      <div>
                        <TabNav onToggleTab={toggleTabNav} activeTab={activeTabNav} menu={tabNavMenu} />
                        <TabContent activeTab={activeTabNav}>
                          <TabPane tabId="0">
                            <FoggingInfo foggingInfo={detail?.foggingInfo} companyName={detail?.companyName} />
                          </TabPane>
                          <TabPane tabId="1">
                            <AuditResults auditResult={detail?.auditResult} />
                          </TabPane>
                          <TabPane tabId="2">
                            <Enforcement teamLeaderEnforcements={detail?.teamLeaderEnforcements} managerEnforcements={detail?.managerEnforcements} mode={state?.action} />
                          </TabPane>
                          <TabPane tabId="3">
                            <Assignment assignments={detail?.assignments} />
                          </TabPane>
                        </TabContent>
                      </div>
                    </div>
                  </nav>
                </Form>
              )}
            </Formik>
          )}

          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(EnforcementDetail);
