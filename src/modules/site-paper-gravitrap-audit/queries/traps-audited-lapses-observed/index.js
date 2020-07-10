import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import SearchableCheckList from 'components/common/searchable-check-list';
import InPageLoading from 'components/common/inPageLoading';
import DataTable from 'components/common/data-table';
import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import Select from 'components/common/select';

import { getTrapandLapsesService } from 'services/site-paper-gravitrap-audit';
import { WEB_ROUTES, tableColumnWidth, weekNumberLOVs, yearNumberLOVs } from 'constants/index';
import { exportExcel, actionTryCatchCreator } from 'utils';
import { getUserRolesLovService } from 'services/non-functional';

const QueryTrapsAuditedLapsesObserved = (props) => {
  const { getMastercodeAction, masterCodes } = props;
  const thisYear = yearNumberLOVs[yearNumberLOVs.length - 1];

  const [eweekFrom, setEweekFrom] = useState(weekNumberLOVs[0]);
  const [eyearFrom, setEyearFrom] = useState(thisYear);
  const [eweekTo, setEweekTo] = useState(weekNumberLOVs[weekNumberLOVs.length - 1]);
  const [eyearTo, setEyearTo] = useState(thisYear);
  const [roList, setROList] = useState([]);
  const [grcList, setGRCList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [surveyor, setSurveyor] = useState();
  const [surveyLOV, setSurveyLOV] = useState([]);

  const [tableData, setTableData] = useState([]);

  const [isLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_TRAPS_AUDITED_LAPSES_OBSERVED.name}`;
    getMastercodeAction([MASTER_CODE.RO_CODE, MASTER_CODE.GRC_CODE, MASTER_CODE.DIVISION_CODE], undefined, true);
    getSurveyorLOV();
  }, [getMastercodeAction]);

  const onSearch = (e) => {
    e.preventDefault();

    const params = {
      yearFrom: String(eyearFrom.value),
      yearTo: String(eyearTo.value),
      weekFrom: String(eweekFrom.value),
      weekTo: String(eweekTo.value),
      roCode: roList[0]?.value,
      grcCode: grcList[0]?.value,
      divCode: divisionList[0]?.value,
      auditor: surveyor?.value,
    };

    const onPending = () => setLocalLoading(true);
    const onSuccess = (data) => {
      setTableData(data.GraviTrapSitePaperAuditVO || []);
      setLocalLoading(false);
    };
    const onError = (error) => {
      setLocalLoading(false);
    };
    actionTryCatchCreator(getTrapandLapsesService(params), onPending, onSuccess, onError);
  };

  const getSurveyorLOV = () => {
    const onPending = () => {
      setLocalLoading(true);
    };
    const onSuccess = (data) => {
      const lov = (data?.rolesWithUsersVOList.map((item) => item.anaUserVOList || []).reduce((total, current) => [...total, ...current]) || []).map((role) => ({
        label: role.fullName,
        value: role.soeId,
      }));
      setSurveyLOV(lov);
      setLocalLoading(false);
    };
    const onError = (error) => {
      setLocalLoading(false);
    };
    actionTryCatchCreator(getUserRolesLovService({ roles: ['Auditor'] }), onPending, onSuccess, onError);
  };

  const columns = [
    {
      Header: 'eYear',
      accessor: 'year',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'eWeek',
      accessor: 'eweek',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Number of Traps Audited',
      accessor: 'trapsAudited',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Number of Lapses Observed',
      accessor: 'lapse',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Number of Lapses / Number of Traps Audited (%)',
      accessor: 'percentaudited',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'Number of Traps Completed Final Lapse Assessment',
      accessor: 'trapsfinallapsecompleted',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'Number of Lapses (Final)',
      accessor: 'finallapse',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Number of Lapses (Final) / Number of Traps Completed Final Lapse Assessment (%)',
      accessor: 'finalpercentcompleted',
      minWidth: tableColumnWidth.xl,
    },
  ];

  const isMandatory = eweekFrom && eweekTo && eyearFrom && eyearTo;
  return (
    <>
      <Header />
      <div className="main-content">
        <NavBar active={WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_TRAPS_AUDITED_LAPSES_OBSERVED.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.EHI_GRAVITRAP_AUDIT, WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_TRAPS_AUDITED_LAPSES_OBSERVED]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_TRAPS_AUDITED_LAPSES_OBSERVED.name}</h1>
          </div>
          <div className="paddingLeft30">
            <h2>Selection Criteria</h2>
          </div>
          <div className="block-summary filterMainWrapper tabsContainer" style={{ padding: '30px' }}>
            <div className="tab-pane__group bg-white">
              <div className="card">
                <div className="d-flex align-items-center mb-4 rptDetailsCont">
                  <b className="text-body wf-200">EWeek - EYear From (*)</b>
                  <Select className="m-1 wf-150" options={weekNumberLOVs} value={eweekFrom} onChange={setEweekFrom} />
                  <Select className="m-1 wf-150" options={yearNumberLOVs} value={eyearFrom} onChange={setEyearFrom} />
                </div>
                <div className="d-flex align-items-center mb-4 rptDetailsCont">
                  <b className="text-body wf-200">EWeek - EYear To (*)</b>
                  <Select className="m-1 wf-150" options={weekNumberLOVs} value={eweekTo} onChange={setEweekTo} />
                  <Select className="m-1 wf-150" options={yearNumberLOVs} value={eyearTo} onChange={setEyearTo} />
                </div>
                <div className="form-inline mb-4">
                  <div className="form-group form-group__stacked mb-4">
                    <SearchableCheckList title="RO" options={masterCodes[MASTER_CODE.RO_CODE]} onChange={(list) => setROList(list)} singleChoice />
                  </div>
                  <div className="form-group form-group__stacked mb-4">
                    <SearchableCheckList title="GRC" options={masterCodes[MASTER_CODE.GRC_CODE]} onChange={(list) => setGRCList(list)} singleChoice />
                  </div>
                  <div className="form-group form-group__stacked mb-4">
                    <SearchableCheckList title="Division" options={masterCodes[MASTER_CODE.DIVISION_CODE]} onChange={(list) => setDivisionList(list)} singleChoice />
                  </div>
                </div>
                <div className="form-group form-group__stacked mb-4">
                  <b className="text-body">Auditor</b>
                  <Select className="wf-300 d-block" options={surveyLOV} value={surveyor} onChange={setSurveyor} isClearable />
                </div>
                <div className="d-flex mb-4">
                  <button type="submit" className="btn btn-pri" onClick={onSearch} disabled={!isMandatory}>
                    Generate
                  </button>
                </div>
                <DataTable
                  data={tableData}
                  columns={columns}
                  rightHeaderContent={
                    <div className="align-items-center d-flex">
                      {tableData.length ? (
                        <button onClick={() => exportExcel(tableData, WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_TRAPS_AUDITED_LAPSES_OBSERVED.name, columns)} type="button" className="btn btn-pri">
                          Download
                        </button>
                      ) : null}
                    </div>
                  }
                />
              </div>
            </div>
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global }, ownProps) => ({
  ...ownProps,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = { getMastercodeAction };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryTrapsAuditedLapsesObserved));
