import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

import { MASTER_CODE } from 'store/actions';
import { divisionListingService } from 'services/administration-configuration/division';
import { actionTryCatchCreator } from 'utils';
import Select from 'components/common/select';

const ActiveDengueDashboard = (props) => {
  const {
    data: { activeDengueDashboardVoList },
    onChangeFilter,
    filterValue,
    masterCodes,
  } = props;

  const getDivisionLOV = () => {
    const onPending = () => {};
    const onSuccess = (data) => {
      const list = (data.divisionCdVoList || []).map((item) => ({
        ...item,
        label: item.divDescription,
        value: item.divCode,
      }));
      setDivisionLOV(list);
    };
    const onError = (error) => {};
    actionTryCatchCreator(divisionListingService(), onPending, onSuccess, onError);
  };

  useEffect(() => {
    getDivisionLOV();
  }, []);

  const data = [
    {
      name: '2-9',
      value: activeDengueDashboardVoList?.twoToNine,
    },
    {
      name: '10-19',
      value: activeDengueDashboardVoList?.tenToNineteen,
    },
    {
      name: '20-29',
      value: activeDengueDashboardVoList?.twentyToTwentyNine,
    },
    {
      name: '30-39',
      value: activeDengueDashboardVoList?.thirtyToThirtyNine,
    },
    {
      name: '40-49',
      value: activeDengueDashboardVoList?.fourtyToFourtyNine,
    },
    {
      name: '>=50',
      value: activeDengueDashboardVoList?.moreThanFifty,
    },
  ];

  const diseaseLOV = [
    { label: 'Dengue', value: 'dengue' },
    { label: 'Zika', value: 'zika' },
  ];

  const selectedDisease = diseaseLOV.find((item) => item.value === filterValue.caseType);
  const cdcLOV = [{ label: 'Singapore', value: 'SG' }, ...(masterCodes[MASTER_CODE.CDC_CODE] || [])];
  const selectedCDC = cdcLOV.find((item) => item.value === filterValue.cluster);
  const [divisionLOV, setDivisionLOV] = useState([]);
  const filteredDivisionLOV = divisionLOV.filter((division) => division.divDistrict === selectedCDC.value || selectedCDC.value === 'SG');

  const selectedDivision = filteredDivisionLOV.find((division) => division.divCode === filterValue.division);

  return (
    <div className="col-lg-6 mb-4">
      <div className="dCont">
        <div className="secHeader">
          <div className="row">
            <div className="col-md-12">
              <div className="row paddingBottom5 paddingTop5">
                <div className="col-md-12">
                  <div className="displayInline paddingTop5 paddingRight15">Number of</div>
                  <Select className="wf-150 d-inline-block" options={diseaseLOV} value={selectedDisease} onChange={(item) => onChangeFilter({ ...filterValue, caseType: item.value })} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 ">
                  <div className="displayInline paddingTop5 paddingRight15">Active clusters in</div>
                  <Select className="wf-200 d-inline-block paddingRight15" options={cdcLOV} value={selectedCDC} onChange={(item) => onChangeFilter({ ...filterValue, cluster: item.value })} />
                  <div className="displayInline paddingRight15 paddingBottom15">in</div>
                  <Select
                    className="wf-200 d-inline-block paddingRight15"
                    options={filteredDivisionLOV}
                    value={selectedDivision}
                    onChange={(item) => onChangeFilter({ ...filterValue, division: item.value })}
                  />
                  <div className="displayInline paddingRight15">on {activeDengueDashboardVoList?.date}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dCardDetails">
          <div className="row">
            <div className="col-md-12 bold-font">Top 3 largest clusters</div>
          </div>
          <div className="row">
            <div className="col-md-12 paddingTop20 paddingBottom30">
              <div className="row paddingBottom15">
                <div className="col-md-5 text-right">{activeDengueDashboardVoList?.topOneRoadName}</div>
                <div className="col-md-4">Cluster ID {activeDengueDashboardVoList?.topOneClusterId}</div>
                <div className="col-md-3">({activeDengueDashboardVoList?.topOneNoOfCases} cases)</div>
              </div>
              <div className="row paddingBottom15">
                <div className="col-md-5 text-right">{activeDengueDashboardVoList?.topTwoRoadName}</div>
                <div className="col-md-4">Cluster ID {activeDengueDashboardVoList?.topTwoClusterId}</div>
                <div className="col-md-3">({activeDengueDashboardVoList?.topTwoNoOfCases} cases)</div>
              </div>
              <div className="row paddingBottom15">
                <div className="col-md-5 text-right">{activeDengueDashboardVoList?.topThreeRoadName}</div>
                <div className="col-md-4">Cluster ID {activeDengueDashboardVoList?.topThreeClusterId}</div>
                <div className="col-md-3">({activeDengueDashboardVoList?.topThreeNoOfCases} cases)</div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 bold-font">Cluster distribution</div>
          </div>
          <div className="row">
            <div className="col-md-12 paddingTop10">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
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

const mapStateToProps = ({ global, dashboardReducers: { userDashboard } }, ownProp) => ({
  ...ownProp,
  ...userDashboard,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveDengueDashboard);
