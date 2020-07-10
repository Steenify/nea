import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { MASTER_CODE } from 'store/actions';

import Select from 'components/common/select';
import { dateStringFromDate } from 'utils';

const SamplesIdentifiedPeriodDashboard = (props) => {
  const {
    data: { sampleIdentifiedPeriodDashboardVoList = [] },
    onChangeFilter,
    filterValue,
    masterCodes,
  } = props;

  const data = sampleIdentifiedPeriodDashboardVoList.map((item) => ({ name: item.date, value: item.noOfSamples }));

  const vectorTypeLOV = masterCodes[MASTER_CODE.SPECIMEN_CODE] || [];
  const selectedVectorType = vectorTypeLOV.find((item) => item.value === filterValue.vectorType);

  return (
    <div className="col-lg-6 mb-4">
      <div className="dCont">
        <div className="secHeader">
          <div className="row">
            <div className="col-md-12">Samples identified over a period of time</div>
          </div>
        </div>
        <div className="dCardDetails">
          <div className="row paddingBottom15">
            <div className="col-md-12 paddingTop5 paddingBottom10">
              <div className="btn-group regionBtns" role="group" aria-label="Basic example">
                <button type="button" className={`btn btn-secondary ${filterValue.ro === 'All' && 'active'}`} onClick={() => onChangeFilter({ ...filterValue, ro: 'All' })}>
                  All
                </button>
                <button type="button" className={`btn btn-secondary ${filterValue.ro === 'CRO' && 'active'}`} onClick={() => onChangeFilter({ ...filterValue, ro: 'CRO' })}>
                  CRO
                </button>
                <button type="button" className={`btn btn-secondary ${filterValue.ro === 'ERO' && 'active'}`} onClick={() => onChangeFilter({ ...filterValue, ro: 'ERO' })}>
                  ERO
                </button>
                <button type="button" className={`btn btn-secondary ${filterValue.ro === 'WRO' && 'active'}`} onClick={() => onChangeFilter({ ...filterValue, ro: 'WRO' })}>
                  WRO
                </button>
              </div>
            </div>
          </div>
          <div className="row paddingBottom15">
            <div className="col-md-3 paddingTop5">Vector Type</div>
            <div className="col-md-8">
              <Select
                //className="wf-250"
                options={vectorTypeLOV}
                value={selectedVectorType}
                onChange={(item) => onChangeFilter({ ...filterValue, vectorType: item.value })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 paddingTop5">Date</div>
            <div className="col-md-9">
              <span className="bold-font">{dateStringFromDate(moment().add(-30, 'days'))}</span> to <span className="bold-font">{dateStringFromDate(moment())}</span>{' '}
              <span className="text-bondi-blue bold-font">(T-30days)</span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 paddingTop20">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 30 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false}></YAxis>
                  <Tooltip />
                  <Line type="natural" dataKey="value" dot={false} strokeWidth={3} stroke="#1b8dc6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ global, dashboardReducers: { userDashboard } }, ownProp) => ({
  ...ownProp,
  ...userDashboard,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SamplesIdentifiedPeriodDashboard);
