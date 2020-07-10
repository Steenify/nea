import React from 'react';
import { connect } from 'react-redux';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Legend } from 'recharts';

import Select from 'components/common/select';

const ActiveDenguePriorTwoEweekComparison = (props) => {
  const {
    data: { activeDenguePriorTwoEweekComparisonDashboardRequestVO },
    onChangeFilter,
    filterValue,
  } = props;

  const firstEweek = activeDenguePriorTwoEweekComparisonDashboardRequestVO?.firstEweek || 'First Eweek';
  const secondEweek = activeDenguePriorTwoEweekComparisonDashboardRequestVO?.secondEweek || 'Second Eweek';

  const data = [
    {
      name: 'C',
      [firstEweek]: activeDenguePriorTwoEweekComparisonDashboardRequestVO?.centralFirstEweek,
      [secondEweek]: activeDenguePriorTwoEweekComparisonDashboardRequestVO?.centralSecondEweek,
    },
    {
      name: 'NE',
      [firstEweek]: activeDenguePriorTwoEweekComparisonDashboardRequestVO?.neFirstEweek,
      [secondEweek]: activeDenguePriorTwoEweekComparisonDashboardRequestVO?.neSecondEweek,
    },
    {
      name: 'SE',
      [firstEweek]: activeDenguePriorTwoEweekComparisonDashboardRequestVO?.seFirstEweek,
      [secondEweek]: activeDenguePriorTwoEweekComparisonDashboardRequestVO?.seSecondEweek,
    },
    {
      name: 'NW',
      [firstEweek]: activeDenguePriorTwoEweekComparisonDashboardRequestVO?.nwFirstEweek,
      [secondEweek]: activeDenguePriorTwoEweekComparisonDashboardRequestVO?.nwSecondEweek,
    },
    {
      name: 'SW',
      [firstEweek]: activeDenguePriorTwoEweekComparisonDashboardRequestVO?.swFirstEweek,
      [secondEweek]: activeDenguePriorTwoEweekComparisonDashboardRequestVO?.swSecondEweek,
    },
  ];

  const diseaseLOV = [
    { label: 'Dengue', value: 'dengue' },
    { label: 'Zika', value: 'zika' },
  ];

  const selectedDisease = diseaseLOV.find((item) => item.value === filterValue.caseType);

  return (
    <div className="col-lg-6 mb-4">
      <div className="dCont">
        <div className="secHeader">
          <div className="row">
            <div className="col-md-12">
              Comparison of the number of cases between {firstEweek} and {secondEweek}
            </div>
          </div>
        </div>
        <div className="dCardDetails">
          <div className="row">
            <div className="col-md-3 paddingTop5">Select type</div>
            <div className="col-md-8">
              <Select className="wf-150 d-inline-block" options={diseaseLOV} value={selectedDisease} onChange={(item) => onChangeFilter({ ...filterValue, caseType: item.value })} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 paddingTop20">
              In SG: {firstEweek} : {activeDenguePriorTwoEweekComparisonDashboardRequestVO?.firstEweekTotal} , {secondEweek} : {activeDenguePriorTwoEweekComparisonDashboardRequestVO?.secondEweekTotal}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 paddingTop20">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <YAxis hide dataKey={firstEweek} axisLine={false} tickLine={false} />
                  <XAxis type="category" dataKey="name" axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar maxBarSize={40} dataKey={firstEweek} fill="#1b8dc6">
                    <LabelList dataKey={firstEweek} position="top" />
                  </Bar>
                  <Bar maxBarSize={40} dataKey={secondEweek} fill="#dcdcdc">
                    <LabelList dataKey={secondEweek} position="top" />
                  </Bar>

                  <Legend iconSize={30} align="left" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ dashboardReducers: { userDashboard } }, ownProp) => ({
  ...ownProp,
  ...userDashboard,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveDenguePriorTwoEweekComparison);
