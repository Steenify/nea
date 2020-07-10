import React, { useState } from 'react';
import { connect } from 'react-redux';
import { TabContent, TabPane } from 'reactstrap';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import TabNav from 'components/ui/tabnav';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import CustomModal from 'components/common/modal';

import { WEB_ROUTES } from 'constants/index';
import SubmissionInfo from 'components/pages/rodent-audit/submission-info';
import Overview from 'components/pages/rodent-audit/overview';
import Assignment from 'components/pages/rodent-audit/assignment';
import ContractorFindings from 'components/pages/rodent-audit/contractor-findings';
import ContractorCorrespondence from 'components/pages/rodent-audit/contractor-correspondence';
import Audit from 'components/pages/rodent-audit/audit';
import ShowCauseRecommendation from 'components/pages/rodent-audit/show-cause-recommendation';

import { getAuditTaskDetailService, supportLDService } from 'services/rodent-audit';
import { actionTryCatchCreator } from 'utils';
import GoBackButton from 'components/ui/go-back-button';

const SupportLDAmountDetail = (props) => {
  const {
    history,
    location: { state },
  } = props;

  const [activeTabNav, toggleTabNav] = useState('0');
  const [detail, setDetail] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [modalState, setModalState] = useState(false);
  const [rejectionRemark, setRejectionRemark] = useState();

  const supportLDAction = (support) => {
    actionTryCatchCreator(
      supportLDService({ taskIds: [state?.id], remarks: rejectionRemark, support }),
      () => setIsLoading(true),
      () => {
        setModalState({ open: false });
        setRejectionRemark(undefined);
        setIsLoading(false);
        history.goBack();
      },
      () => setIsLoading(false),
    );
  };

  const getDetailAction = (params) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setDetail(data.detailListing);
      setIsLoading(false);
    };
    const onError = () => setIsLoading(false);
    actionTryCatchCreator(getAuditTaskDetailService(params), onPending, onSuccess, onError);
  };

  useState(() => {
    document.title = `NEA | ${WEB_ROUTES.RODENT_AUDIT.SUPPORT_LD_AMOUNT.name}`;
    const id = state?.auditId || state?.id;
    if (id) {
      getDetailAction({ id, vcs2TaskType: state?.taskType });
    } else {
      // history.goBack();
    }
  }, []);
  const isLateSubmissionTask = detail?.submissionInfoVO;
  const tabNavMenu = isLateSubmissionTask
    ? [
        {
          title: 'Submission Info',
          component: (
            <>
              <SubmissionInfo submissionInfo={detail?.submissionInfoVO} />
              {detail?.submissionInfoVO?.taskAssignments && <Assignment assignments={detail?.submissionInfoVO?.taskAssignments} />}
            </>
          ),
        },
        { title: "Contractor's Correspondence", component: <ContractorCorrespondence correspondence={detail?.contractorCorrespondanceVO} action={state?.action} isLateSubmissionTask /> },
      ]
    : [
        {
          title: 'Overview',
          component: (
            <>
              <Overview type={state?.taskType} taskOverview={detail?.overviewResponseVO} />
              {detail?.overviewResponseVO?.taskAssignments && <Assignment assignments={detail?.overviewResponseVO?.taskAssignments} />}
            </>
          ),
        },
        { title: "Contractor's Findings", component: <ContractorFindings type={state?.taskType} contractorsFindings={detail?.contractorFindingResponseVO} /> },
        { title: 'Audit', component: <Audit type={state?.taskType} audit={detail?.auditDetailResponseVO} /> },
        { title: 'Show Cause Recommendation', component: <ShowCauseRecommendation type={state?.taskType} showCause={detail?.recommendationResponseVO} /> },
        { title: "Contractor's Correspondence", component: <ContractorCorrespondence correspondence={detail?.contractorCorrespondanceVO} action={state?.action} /> },
      ];
  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.RODENT_AUDIT, WEB_ROUTES.RODENT_AUDIT.SUPPORT_LD_AMOUNT]} />
          <GoBackButton onClick={() => history.goBack()} title={`Task ID: ${state?.taskID || state?.taskId}`}>
            <div className="ml-auto">
              {/* <button type="button" className="btn btn-pri m-2" onClick={() => setModalState({ open: true, type: 'support' })}>
                Support
              </button> */}
              <button type="button" className="btn btn-sec m-2" onClick={() => setModalState({ open: true, type: 'reject' })}>
                Reject
              </button>
            </div>
          </GoBackButton>
          {detail && (
            <nav className="tab__main">
              <div className="tabsContainer">
                <div>
                  <TabNav onToggleTab={toggleTabNav} activeTab={activeTabNav} menu={tabNavMenu.map((item) => item.title)} />
                  <TabContent activeTab={activeTabNav}>
                    {tabNavMenu.map((menu, index) => (
                      <TabPane key={`audit_task_detail_tabs_${index + 1}`} tabId={`${index}`}>
                        {menu.component}
                      </TabPane>
                    ))}
                  </TabContent>
                </div>
              </div>
            </nav>
          )}

          <InPageLoading isLoading={isLoading} />
          <Footer />
          <CustomModal
            isOpen={modalState.open && modalState.type === 'support'}
            type="system-modal"
            headerTitle="Confirm to support LD amount ?"
            cancelTitle="No"
            onCancel={() => setModalState({ open: false })}
            confirmTitle="Yes"
            onConfirm={() => {
              setModalState({ open: false });
              supportLDAction(true);
            }}
          />
          <CustomModal
            headerTitle={'Remarks for Rejection'}
            confirmTitle={'Reject'}
            cancelTitle={'Cancel'}
            isOpen={modalState.open && modalState.type === 'reject'}
            onConfirm={() => {
              if (!rejectionRemark) {
                toast.error('Please enter Remarks for Rejection');
                return;
              }
              supportLDAction(false);
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
    </>
  );
};

const mapStateToProps = ({ global }) => ({
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SupportLDAmountDetail);
