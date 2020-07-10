import React from 'react';
import { connect } from 'react-redux';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

const GravitrapAuditLapses = props => {
  const data = [
    {
      name: 'Missed Samples',
      value: 4,
    },
    {
      name: 'Wire mesh not faces upwards',
      value: 5,
    },
    {
      name: 'Missing hay',
      value: 8,
    },
    {
      name: 'Missing sticky lining',
      value: 3,
    },
    {
      name: 'Water not top up',
      value: 2,
    },
    {
      name: 'Non Samples',
      value: 5,
    },
    {
      name: 'Filthy trap',
      value: 4,
    },
    {
      name: 'Filthy sticky lining',
      value: 8,
    },
    {
      name: 'Filthy solution',
      value: 9,
    },
    {
      name: 'Missing trap',
      value: 3,
    },
    {
      name: 'Trap damaged',
      value: 1,
    },
    {
      name: 'Trap overturned',
      value: 6,
    },
  ];
  return (
    <div className="col-lg-6 mb-4">
      <div className="dCont">
        <div className="secHeader">
          <div className="row">
            <div className="col-md-12">Gravitrap site audit lapses in recent 7 days</div>
          </div>
        </div>
        <div className="dCardDetails">
          <div className="row">
            <div className="col-md-12 paddingTop20">
              <ResponsiveContainer width="100%" height={600}>
                <BarChart barCategoryGap={5} barSize={20} data={data} layout="vertical">
                  <YAxis width={165} dataKey="name" type="category" axisLine={false} tickLine={false} />
                  <XAxis hide={true} type="number" />
                  <Tooltip />
                  <Bar dataKey="value" maxBarSize={6} radius={[12, 12, 12, 12]} fill="#1b8dc6">
                    <LabelList dataKey="value" position="right" />
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

export default connect(mapStateToProps, mapDispatchToProps)(GravitrapAuditLapses);
