import React from 'react';
import { connect } from 'react-redux';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

const SampleCollectedDashboard = (props) => {
  const {
    data: { sampleCollectedDashboardVoList },
    onChangeFilter,
    filterValue,
  } = props;

  if (!sampleCollectedDashboardVoList || sampleCollectedDashboardVoList.length === 0) {
    return <></>;
  }

  const data = [
    {
      name: 'Collected by Officers',
      value: sampleCollectedDashboardVoList[0]?.collectedByOfficers,
    },
    {
      name: 'Deposited by Officers',
      value: sampleCollectedDashboardVoList[0]?.depositedByOfficers,
    },
    {
      name: 'Sent to EHI',
      value: sampleCollectedDashboardVoList[0]?.sentToEhi,
    },
    {
      name: 'Received by EHI',
      value: sampleCollectedDashboardVoList[0]?.receivedByEhi,
    },
    {
      name: 'Identified by EHI',
      value: sampleCollectedDashboardVoList[0]?.identifiedByEhi,
    },
    {
      name: 'Enforceable',
      value: sampleCollectedDashboardVoList[0]?.enforceable,
    },
    {
      name: 'Pending Certification',
      value: sampleCollectedDashboardVoList[0]?.pendingCertification,
    },
    {
      name: 'Rejected By EhiAnalyst',
      value: sampleCollectedDashboardVoList[0]?.rejectedByEhiAnalyst,
    },
    {
      name: 'Rejected By EhiAdmin',
      value: sampleCollectedDashboardVoList[0]?.rejectedByEhiAdmin,
    },
    {
      name: 'Rejected By Ro',
      value: sampleCollectedDashboardVoList[0]?.rejectedByRo,
    },
    {
      name: 'Certified Vector',
      value: sampleCollectedDashboardVoList[0]?.certifiedVector,
    },
    {
      name: 'Certified Non Vector',
      value: sampleCollectedDashboardVoList[0]?.certifiedNonVector,
    },
  ];

  return (
    <div className="col-lg-6 mb-4 ">
      <div className="dCont">
        <div className="secHeader">
          <div className="row">
            <div className="col-md-12 clearfix">
              <div className="fLeft paddingRight25">Sample Status</div>
              <div className="fLeft">{sampleCollectedDashboardVoList[0]?.dateRange}</div>
            </div>
          </div>
        </div>
        <div className="dCardDetails">
          <div className="row paddingBottom15">
            <div className="col-md-12 paddingTop5 paddingBottom10">
              <div className="btn-group regionBtns" role="group" aria-label="Basic example">
                <button type="button" className={`btn btn-secondary ${filterValue.ro === 'All' && 'active'}`} onClick={() => onChangeFilter({ ro: 'All' })}>
                  All
                </button>
                <button type="button" className={`btn btn-secondary ${filterValue.ro === 'CRO' && 'active'}`} onClick={() => onChangeFilter({ ro: 'CRO' })}>
                  CRO
                </button>
                <button type="button" className={`btn btn-secondary ${filterValue.ro === 'ERO' && 'active'}`} onClick={() => onChangeFilter({ ro: 'ERO' })}>
                  ERO
                </button>
                <button type="button" className={`btn btn-secondary ${filterValue.ro === 'WRO' && 'active'}`} onClick={() => onChangeFilter({ ro: 'WRO' })}>
                  WRO
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart barCategoryGap={5} barSize={20} data={data} layout="vertical">
                  <YAxis width={165} dataKey="name" type="category" axisLine={false} tickLine={false} />
                  <XAxis hide type="number" />
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

export default connect(mapStateToProps, mapDispatchToProps)(SampleCollectedDashboard);
