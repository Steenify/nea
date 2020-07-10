import React from 'react';
import { connect } from 'react-redux';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

const TotalGravitrap = props => {
  const data = [
    {
      name: 'Collected by Officers',
      value: 2,
    },
    {
      name: 'Deposited by Officers',
      value: 5,
    },
    {
      name: 'Sent to EHI',
      value: 3,
    },
  ];
  const data2 = [
    {
      name: 'Collected by Officers',
      value: 2,
    },
    {
      name: 'Deposited by Officers',
      value: 5,
    },
    {
      name: 'Sent to EHI',
      value: 3,
    },
  ];

  return (
    <div className="col-lg-6 mb-4">
      <div className="dCont">
        <div className="secHeader">
          <div className="row">
            <div className="col-md-12">Total gravitraps audited in recent 7 days : 500</div>
          </div>
        </div>
        <div className="dCardDetails">
          <div className="row">
            <div className="col-md-12 paddingTop20">
              <h3>Paper audit lapses</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart id="paper" barCategoryGap={5} barSize={20} data={data} layout="vertical">
                  <YAxis hide={true} s dataKey="name" type="category" axisLine={false} tickLine={false} />
                  <XAxis hide={true} type="number" />
                  <Tooltip />
                  <Bar dataKey="value" maxBarSize={6} radius={[12, 12, 12, 12]} fill="#1b8dc6">
                    <LabelList dataKey="name" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <h3>EHI audit lapses</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart id="ehi" barCategoryGap={5} barSize={20} data={data2} layout="vertical">
                  <YAxis hide={true} dataKey="name" type="category" axisLine={false} tickLine={false} />
                  <XAxis hide={true} type="number" />
                  <Tooltip />
                  <Bar dataKey="value" maxBarSize={6} radius={[12, 12, 12, 12]} fill="#1b8dc6">
                    <LabelList dataKey="name" position="top" />
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

export default connect(mapStateToProps, mapDispatchToProps)(TotalGravitrap);
