import React from 'react';
import { connect } from 'react-redux';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

import Select from 'components/common/select';

const ActiveDenguePreviousDay = props => {
  const {
    data: { activeDenguePreviousDayDashboardRequestVO },
    onChangeFilter,
    filterValue,
  } = props;

  const data = [
    {
      name: 'C',
      value: activeDenguePreviousDayDashboardRequestVO?.centNo,
    },
    {
      name: 'NE',
      value: activeDenguePreviousDayDashboardRequestVO?.neNo,
    },
    {
      name: 'SE',
      value: activeDenguePreviousDayDashboardRequestVO?.seNo,
    },
    {
      name: 'NW',
      value: activeDenguePreviousDayDashboardRequestVO?.nwNo,
    },
    {
      name: 'SW',
      value: activeDenguePreviousDayDashboardRequestVO?.swNo,
    },
  ];

  const diseaseLOV = [
    { label: 'Dengue', value: 'dengue' },
    { label: 'Zika', value: 'zika' },
  ];

  const selectedDisease = diseaseLOV.find(item => item.value === filterValue.caseType);

  return (
    <div className="col-lg-6 mb-4">
      <div className="dCont">
        <div className="secHeader">
          <div className="row">
            <div className="col-md-12">Repored Dengue / ZIka Epi Cases</div>
          </div>
        </div>
        <div className="dCardDetails">
          <div className="row paddingBottom15">
            <div className="col-md-3 paddingTop5">Select type</div>
            <div className="col-md-8">
              <Select
                className="wf-150 d-inline-block"
                options={diseaseLOV}
                value={selectedDisease}
                onChange={item => onChangeFilter({ ...filterValue, caseType: item.value })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              In SG: Dengue ({activeDenguePreviousDayDashboardRequestVO?.dengueNo}), Zika (
              {activeDenguePreviousDayDashboardRequestVO?.zikaNo})
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 paddingTop20">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <YAxis hide={true} dataKey="value" axisLine={false} tickLine={false} />
                  <XAxis type="category" dataKey="name" axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar maxBarSize={40} dataKey="value" fill="#1b8dc6">
                    <LabelList dataKey="value" position="top" />
                  </Bar>
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

export default connect(mapStateToProps, mapDispatchToProps)(ActiveDenguePreviousDay);
