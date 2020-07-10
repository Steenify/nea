import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getMastercodeAction, MASTER_CODE } from 'store/actions';

import { getDashboardDetailAction } from '../action';

import SamplesCollectedDashboard from './samples-collected';
import SamplesIdentifiedPeriodDashboard from './samples-identified-period';
import SamplesIdentifiedDashboard from './samples-identified';
import ActiveDengueDashboard from './active-dengue';
import ActiveDenguePreviousDay from './active-dengue-previous-day';
import ActiveDengueCurrentEweekComparison from './active-dengue-current-eweek-comparison';
import ActiveDenguePriorTwoEweekComparison from './active-dengue-prior-two-eweek-comparison';

import '../style.scss';

const DashboardDetail = (props) => {
  const {
    getDashboardDetailAction,
    getMastercodeAction,
    data: {
      sampleCollectedDashboardVoList,
      sampleIdentifiedPeriodDashboardVoList,
      sampleIdentifiedDashboardVoList,
      activeDengueDashboardVoList,
      activeDenguePreviousDayDashboardRequestVO,
      activeDengueCurrentEweekComparisonDashboardRequestVO,
      activeDenguePriorTwoEweekComparisonDashboardRequestVO,
    },
  } = props;

  const [sampleIdentifiedDasboardRequestVO, setSampleIdentifiedDasboardRequestVO] = useState({ ro: 'All' });
  const [sampleCollectedDasboardRequestVO, setSampleCollectedDasboardRequestVO] = useState({ ro: 'All' });
  const [sampleIdentifiedPeriodDashboardRequestVO, setSampleIdentifiedPeriodDashboardRequestVO] = useState({
    ro: 'All',
    vectorType: '',
  });
  const [activeDengueDashboardRequestVO, setActiveDengueDashboardRequestVO] = useState({
    caseType: 'dengue',
    cluster: 'SG',
  });
  const [activeDenguePreviousDayDashboardRequestVOFilter, setActiveDenguePreviousDayDashboardRequestVO] = useState({
    caseType: 'dengue',
  });
  const [activeDengueCurrentEweekComparisonDashboardRequestVOFilter, setActiveDengueCurrentEweekComparisonDashboardRequestVO] = useState({
    caseType: 'dengue',
  });
  const [activeDenguePriorTwoEweekComparisonDashboardRequestVOFilter, setActiveDenguePriorTwoEweekComparisonDashboardRequestVO] = useState({
    caseType: 'dengue',
  });

  useEffect(() => {
    getMastercodeAction([MASTER_CODE.SPECIMEN_CODE, MASTER_CODE.CDC_CODE]);
  }, [getMastercodeAction]);

  useEffect(() => {
    getDashboardDetailAction({
      sampleCollectedDasboardRequestVO,
      sampleIdentifiedPeriodDashboardRequestVO,
      // sampleIdentifiedDasboardRequestVO,
      activeDengueDashboardRequestVO,
      activeDenguePreviousDayDashboardRequestVO: activeDenguePreviousDayDashboardRequestVOFilter,
      activeDengueCurrentEweekComparisonDashboardRequestVO: activeDengueCurrentEweekComparisonDashboardRequestVOFilter,
      activeDenguePriorTwoEweekComparisonDashboardRequestVO: activeDenguePriorTwoEweekComparisonDashboardRequestVOFilter,
    });
  }, [
    getDashboardDetailAction,
    sampleCollectedDasboardRequestVO,
    sampleIdentifiedPeriodDashboardRequestVO,
    // sampleIdentifiedDasboardRequestVO,
    activeDengueDashboardRequestVO,
    activeDenguePreviousDayDashboardRequestVOFilter,
    activeDengueCurrentEweekComparisonDashboardRequestVOFilter,
    activeDenguePriorTwoEweekComparisonDashboardRequestVOFilter,
  ]);

  return (
    <>
      {sampleIdentifiedDashboardVoList && <SamplesIdentifiedDashboard filterValue={sampleIdentifiedDasboardRequestVO} onChangeFilter={setSampleIdentifiedDasboardRequestVO} />}
      {sampleCollectedDashboardVoList && <SamplesCollectedDashboard filterValue={sampleCollectedDasboardRequestVO} onChangeFilter={setSampleCollectedDasboardRequestVO} />}
      {sampleIdentifiedPeriodDashboardVoList && (
        <SamplesIdentifiedPeriodDashboard filterValue={sampleIdentifiedPeriodDashboardRequestVO} onChangeFilter={setSampleIdentifiedPeriodDashboardRequestVO} />
      )}
      {activeDengueDashboardVoList && <ActiveDengueDashboard filterValue={activeDengueDashboardRequestVO} onChangeFilter={setActiveDengueDashboardRequestVO} />}
      {activeDenguePreviousDayDashboardRequestVO && (
        <ActiveDenguePreviousDay filterValue={activeDenguePreviousDayDashboardRequestVOFilter} onChangeFilter={setActiveDenguePreviousDayDashboardRequestVO} />
      )}
      {activeDengueCurrentEweekComparisonDashboardRequestVO && (
        <ActiveDengueCurrentEweekComparison filterValue={activeDengueCurrentEweekComparisonDashboardRequestVOFilter} onChangeFilter={setActiveDengueCurrentEweekComparisonDashboardRequestVO} />
      )}
      {activeDenguePriorTwoEweekComparisonDashboardRequestVO && (
        <ActiveDenguePriorTwoEweekComparison filterValue={activeDenguePriorTwoEweekComparisonDashboardRequestVOFilter} onChangeFilter={setActiveDenguePriorTwoEweekComparisonDashboardRequestVO} />
      )}
    </>
  );
};

const mapStateToProps = ({ dashboardReducers: { userDashboard } }) => ({
  ...userDashboard,
});

const mapDispatchToProps = {
  getDashboardDetailAction,
  getMastercodeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DashboardDetail));
