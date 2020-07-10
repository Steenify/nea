import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import DataTable from 'components/common/data-table';
import Select from 'components/common/select';

import { getOfficerlapsesService } from 'services/site-paper-gravitrap-audit';
import { WEB_ROUTES, tableColumnWidth, weekNumberLOVs, yearNumberLOVs } from 'constants/index';
import { exportExcel, actionTryCatchCreator } from 'utils';

const QueryOfficerLapses = () => {
  const thisYear = yearNumberLOVs[yearNumberLOVs.length - 1];

  const [eweekFrom, setEweekFrom] = useState(weekNumberLOVs[0]);
  const [eyearFrom, setEyearFrom] = useState(thisYear);
  const [eweekTo, setEweekTo] = useState(weekNumberLOVs[weekNumberLOVs.length - 1]);
  const [eyearTo, setEyearTo] = useState(thisYear);
  const [threshold, setLapseThreshold] = useState(undefined);

  const [tableData, setTableData] = useState([]);

  const [isLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_OFFICER_WITH_LOW_LAPSE.name}`;
  }, []);

  const onSearch = (e) => {
    e.preventDefault();

    const params = {
      yearFrom: String(eyearFrom.value),
      yearTo: String(eyearTo.value),
      weekFrom: String(eweekFrom.value),
      weekTo: String(eweekTo.value),
      threshold: Number(threshold),
    };
    const onPending = () => setLocalLoading(true);
    const onSuccess = (data) => {
      setTableData(data.GraviTrapSitePaperAuditVO || []);
      setLocalLoading(false);
    };
    const onError = (error) => {
      setLocalLoading(false);
    };
    actionTryCatchCreator(getOfficerlapsesService(params), onPending, onSuccess, onError);
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
      Header: 'RO',
      accessor: 'ro',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'GRC',
      accessor: 'grc',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Division',
      accessor: 'division',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Officer Name',
      accessor: 'officerName',
      minWidth: tableColumnWidth.lg,
    },
  ];

  const isMandatory = eyearFrom && eyearTo && eweekFrom && eweekTo && threshold;
  return (
    <>
      <Header />
      <div className="main-content">
        <NavBar active={WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_OFFICER_WITH_LOW_LAPSE.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.EHI_GRAVITRAP_AUDIT, WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_OFFICER_WITH_LOW_LAPSE]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_OFFICER_WITH_LOW_LAPSE.name}</h1>
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
                  <div className="form-group form-group__stacked flex-column">
                    <b className="text-body wf-200">Lapse Threshold (*)</b>
                    <input className="textfield form-control wf-150" type="number" min="0" onChange={(e) => setLapseThreshold(e.target.value)} />
                  </div>
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
                        <button onClick={() => exportExcel(tableData, WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_OFFICER_WITH_LOW_LAPSE.name, columns)} type="button" className="btn btn-pri">
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

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryOfficerLapses));
