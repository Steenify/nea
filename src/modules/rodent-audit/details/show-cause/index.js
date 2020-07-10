import React, { useState } from 'react';
import { connect } from 'react-redux';
import { TabContent, TabPane } from 'reactstrap';
import { toast } from 'react-toastify';

import { Formik, Form } from 'formik';
import PromptOnLeave from 'components/common/formik/prompt-on-leave';
import FormikSubmitErrorMessage from 'components/common/formik/submit-error-message';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import TabNav from 'components/ui/tabnav';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';

import { WEB_ROUTES } from 'constants/index';
import Overview from 'components/pages/rodent-audit/overview';
import Assignment from 'components/pages/rodent-audit/assignment';
import ContractorFindings from 'components/pages/rodent-audit/contractor-findings';
// import ContractorCorrespondence from 'components/pages/rodent-audit/contractor-correspondence';
import Audit from 'components/pages/rodent-audit/audit';
import ShowCauseRecommendation from 'components/pages/rodent-audit/show-cause-recommendation';

import { actionTryCatchCreator } from 'utils';
import GoBackButton from 'components/ui/go-back-button';

import { submitManagerRecommendationService, updateShowcauseService, getAuditTaskDetailService } from 'services/rodent-audit';

const ShowCauseDetail = (props) => {
  const {
    history,
    location: { state },
    // functionNameList,
  } = props;

  const taskId = state?.auditId || state?.id;
  const [detail, setDetail] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [tabNavMenu, setTabNavMenu] = useState([]);
  const [activeTabNav, toggleTabNav] = useState(`${tabNavMenu.length - 1}`);

  const getDetailAction = (params) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setDetail(data.detailListing);

      const detail = data?.detailListing;
      let index = 0;

      if (detail?.overviewResponseVO) {
        index += 1;
        tabNavMenu.push({
          name: 'Overview',
          component: (
            <>
              <Overview type={state?.taskType} taskOverview={detail.overviewResponseVO} />
              {detail.overviewResponseVO?.taskAssignments && <Assignment assignments={detail.overviewResponseVO.taskAssignments} taskId={state?.id} />}
            </>
          ),
        });
      }

      if (detail?.contractorFindingResponseVO) {
        index += 1;
        tabNavMenu.push({
          name: "Contractor's Findings",
          component: <ContractorFindings type={state?.taskType} contractorsFindings={detail.contractorFindingResponseVO} />,
        });
      }

      if (detail?.auditDetailResponseVO) {
        index += 1;
        tabNavMenu.push({
          name: 'Audit',
          component: <Audit type={state?.taskType} audit={detail?.auditDetailResponseVO} />,
        });
      }

      if (detail?.recommendationResponseVO || true) {
        index += 1;
        tabNavMenu.push({
          name: 'Show Cause Recommendation',
          component: <ShowCauseRecommendation type={state?.taskType} showCause={detail?.recommendationResponseVO} action={state?.action} />,
        });
      }

      // if (detail?.contractorCorrespondanceVO && functionNameList.includes(FUNCTION_NAMES.submitManagerRecommendation)) {
      //   tabNavMenu.push({
      //     name: "Contractor's Correspondence",
      //     component: <ContractorCorrespondence type={state?.taskType} correspondence={detail?.contractorCorrespondanceVO} />,
      //   });
      // }

      setTabNavMenu(tabNavMenu);

      toggleTabNav(`${index - 1}`);

      setIsLoading(false);
    };
    const onError = () => setIsLoading(false);
    actionTryCatchCreator(getAuditTaskDetailService(params), onPending, onSuccess, onError);
  };

  useState(() => {
    document.title = `NEA | ${WEB_ROUTES.RODENT_AUDIT.SHOW_CAUSE_DETAIL.name}`;
    if (taskId) {
      getDetailAction({ id: taskId, vcs2TaskType: state?.taskType });
    } else {
    }
  }, []);

  const onSubmit = (values, actions) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = () => {
      setIsLoading(false);
      toast.success('Show Cause Recommendation submitted.');
      actions.resetForm();
      history.goBack();
    };
    const onError = () => setIsLoading(false);
    if (state?.action === 'submit') {
      actionTryCatchCreator(updateShowcauseService(values), onPending, onSuccess, onError);
    }
    if (state?.action === 'approve') {
      // errors.managerShowCauseRemarks = '(Required)';
      actionTryCatchCreator(submitManagerRecommendationService({ ...values, showcauseRemarks: values.managerShowCauseRemarks, isShowCause: values.managerShowCause }), onPending, onSuccess, onError);
    }

    actions.setSubmitting(false);
    actions.setErrors({});
  };

  const validate = (values) => {
    const errors = {};
    let errorCount = 0;

    if (state?.action === 'submit') {
      if (!values.showcauseRemarks && !values.isShowCause) {
        errorCount += 1;
        errors.showcauseRemarks = '(Required)';
      }
    }

    if (state?.action === 'approve') {
      if (!values.managerShowCauseRemarks) {
        errorCount += 1;
        errors.managerShowCauseRemarks = '(Required)';
      }
    }

    if (errorCount) {
      errors.errorCount = errorCount;
      errors.errorHint = `There are ${errorCount} missing required fields Show Cause Recommendation tab.`;
      return errors;
    }
    return {};
  };

  const initialValues =
    state?.action === 'submit'
      ? {
          taskId,
          isShowCause: detail?.recommendationResponseVO?.showCause || false,
          showcauseRemarks: detail?.recommendationResponseVO?.showCauseRemarks || '',
          saveMode: 'submit',
        }
      : {
          taskId,
          saveMode: 'submit',
          managerShowCause: detail?.recommendationResponseVO?.managerShowCause || false,
          managerShowCauseRemarks: detail?.recommendationResponseVO?.managerShowCauseRemarks || '',
        };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.RODENT_AUDIT, WEB_ROUTES.RODENT_AUDIT.SHOW_CAUSE_DETAIL]} />
          <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit} enableReinitialize>
            {({ dirty }) => {
              return (
                <Form>
                  <PromptOnLeave dirty={dirty} />
                  <GoBackButton onClick={() => history.goBack()} title={`Task ID: ${state?.taskId}`}>
                    <div className="ml-auto">
                      <button type="submit" className="btn btn-pri">
                        Submit
                      </button>
                    </div>
                  </GoBackButton>
                  <nav className="tab__main">
                    <div className="tabsContainer">
                      <FormikSubmitErrorMessage />
                      <div>
                        <TabNav onToggleTab={toggleTabNav} activeTab={activeTabNav} menu={tabNavMenu.map((item) => item.name)} />
                        <TabContent activeTab={activeTabNav}>
                          {tabNavMenu.map((menu, index) => {
                            return (
                              <TabPane key={`audit_task_detail_tabs_${index + 1}`} tabId={`${index}`}>
                                {menu.component}
                              </TabPane>
                            );
                          })}
                        </TabContent>
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

export default connect(mapStateToProps, mapDispatchToProps)(ShowCauseDetail);
