import React, { useState, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import TabNav from 'components/ui/tabnav';
import InPageLoading from 'components/common/inPageLoading';

import { rodentAuditWorkspaceListingService } from 'services/rodent-audit';

import { actionTryCatchCreator } from 'utils';

import RodentExpiredTaskTable from 'components/tables/rodent-audit/expired-task';
import RodentBurrowCountLapsesTable from 'components/tables/rodent-audit/burrow-count-lapses';
import RodentPendingLDSupportTable from 'components/tables/rodent-audit/pending-ld-support';
import RodentPendingLDApprovalTable from 'components/tables/rodent-audit/pending-ld-approval';
import RodentPendingContractorExplanationTable from 'components/tables/rodent-audit/pending-contractor-explanation';
import RejectedLDTable from 'components/tables/rodent-audit/rejected-ld';

import { FUNCTION_NAMES } from 'constants/index';

let previousTab = '0';

const RodentAuditWorkspaceTables = (props) => {
  const { functionNameList, sendTab } = props;
  const [tabNavMenu, setTabNavMenu] = useState([]);
  const [activeTabNav, toggleTabNav] = useState(sendTab || previousTab);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();

  const getListingAction = useCallback(() => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setIsLoading(false);
      setData(data);
    };
    const onError = () => setIsLoading(false);
    actionTryCatchCreator(rodentAuditWorkspaceListingService(), onPending, onSuccess, onError);
  }, []);

  const setMenu = useCallback(
    (data) => {
      const menus = [];
      if (data?.expiredAuditTaskList) {
        menus.push({
          // title: 'Expired Tasks',
          title: 'Expired Tasks – Explanation Pending Approval',
          component: <RodentExpiredTaskTable data={data.expiredAuditTaskList || []} getListingAction={getListingAction} />,
        });
      }
      if (data?.showCause) {
        const hasApproveRejectRights = functionNameList.includes(FUNCTION_NAMES.submitManagerRecommendation);
        menus.push({
          title: hasApproveRejectRights ? 'Pending Show Cause Approval' : 'Recommend Show Cause',
          component: <RodentBurrowCountLapsesTable data={data.showCause || []} getListingAction={getListingAction} />,
        });
      }
      if (data?.contractorExplanations) {
        menus.push({
          title: 'Pending Contractor’s Explanation',
          component: <RodentPendingContractorExplanationTable data={data.contractorExplanations || []} getListingAction={getListingAction} />,
        });
      }
      if (data?.ldPendingSupports) {
        menus.push({
          title: 'Pending LD Support',
          component: <RodentPendingLDSupportTable data={data.ldPendingSupports || []} getListingAction={getListingAction} />,
        });
      }
      if (data?.ldPendingApprovals) {
        menus.push({
          title: 'Pending LD Approval',
          component: <RodentPendingLDApprovalTable data={data.ldPendingApprovals || []} getListingAction={getListingAction} />,
        });
      }
      if (data?.ldRejected) {
        menus.push({
          title: 'Rejected LD',
          component: <RejectedLDTable data={data.ldRejected || []} getListingAction={getListingAction} />,
        });
      }

      setTabNavMenu(menus);
      toggleTabNav(menus.length > Number(previousTab) ? previousTab : '0');
    },
    [getListingAction, functionNameList],
  );

  useEffect(() => {
    setMenu(data);
  }, [setMenu, data]);

  useEffect(() => {
    getListingAction();
    if (sendTab) {
      previousTab = sendTab;
    }
  }, [sendTab, getListingAction]);

  return (
    <>
      <nav className="tab__main">
        <div className="tabsContainer">
          <TabNav
            onToggleTab={(tab) => {
              toggleTabNav(tab);
              previousTab = tab;
            }}
            activeTab={activeTabNav}
            menu={tabNavMenu.map((item) => item.title)}
          />
        </div>
      </nav>
      {tabNavMenu.map((menu, index) => (
        <div key={`rodent_workspace_tab_${index + 1}`} className={Number(activeTabNav) === index ? '' : 'd-none'}>
          {menu.component || <></>}
        </div>
      ))}
      {/* <div>{tabNavMenu[Number(activeTabNav)]?.component || <></>}</div> */}
      <InPageLoading isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = ({ global }) => ({
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RodentAuditWorkspaceTables));
