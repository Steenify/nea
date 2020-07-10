import React, { useState, useEffect } from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import { actionTryCatchCreator, exportExcel } from 'utils';
import InPageLoading from 'components/common/inPageLoading';
import DataTable from 'components/common/data-table';
import Select from 'components/common/select';

import { queryLapseObservedService } from 'services/ehi-gravitrap-audit';
import { WEB_ROUTES, weekNumberLOVs, yearNumberLOVs, tableColumnWidth } from 'constants/index';

const QueryLapseObserved = () => {
  const thisYear = yearNumberLOVs[yearNumberLOVs.length - 1];

  const [eweekFrom, setEweekFrom] = useState(weekNumberLOVs[0]);
  const [eyearFrom, setEyearFrom] = useState(thisYear);
  const [eweekTo, setEweekTo] = useState(weekNumberLOVs[weekNumberLOVs.length - 1]);
  const [eyearTo, setEyearTo] = useState(thisYear);
  const [tableData, setTableData] = useState([]);

  const [isLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_LAPSE_OBSERVED_EHI.name}`;
  }, []);

  const onSearch = (e) => {
    e.preventDefault();

    const params = {
      eYeareWeekFrom: [eyearFrom.value, eweekFrom.value].join('_'),
      eYeareWeekTo: [eyearTo.value, eweekTo.value].join('_'),
    };

    const onPending = () => {
      setLocalLoading(true);
    };
    const onSuccess = (data) => {
      const l = data.lapseObservedList || [];

      setTableData(l.map((item) => ({ ...item, monthYear: `${item?.eYear || ''} - ${item?.eWeek || ''}` })));
      setLocalLoading(false);
    };
    const onError = () => {
      setLocalLoading(false);
    };
    actionTryCatchCreator(queryLapseObservedService(params), onPending, onSuccess, onError);
  };

  const columns = [
    {
      Header: 'EY/EW',
      accessor: 'monthYear',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Tasks Audited',
      accessor: 'totalCount',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Failure to Identify Samples Correctly',
      accessor: 'failCount',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Failure to Submit Samples on Time',
      accessor: 'submitCount',
      minWidth: tableColumnWidth.md,
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content">
        <NavBar active={WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_LAPSE_OBSERVED_EHI.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.EHI_GRAVITRAP_AUDIT, WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_LAPSE_OBSERVED_EHI]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_LAPSE_OBSERVED_EHI.name}</h1>
          </div>
          <div className="paddingLeft30">
            <h2>Selection Criteria</h2>
          </div>
          <div className="block-summary filterMainWrapper tabsContainer" style={{ padding: '30px' }}>
            <div className="tab-pane__group bg-white">
              <div className="card">
                <div className="d-flex align-items-center mb-4 rptDetailsCont">
                  <b className="text-body wf-200">EWeek - EYear From</b>
                  <Select className="m-1 wf-150" options={weekNumberLOVs} value={eweekFrom} onChange={setEweekFrom} />
                  <Select className="m-1 wf-150" options={yearNumberLOVs} value={eyearFrom} onChange={setEyearFrom} />
                </div>
                <div className="d-flex align-items-center mb-4 rptDetailsCont">
                  <b className="text-body wf-200">EWeek - EYear To</b>
                  <Select className="m-1 wf-150" options={weekNumberLOVs} value={eweekTo} onChange={setEweekTo} />
                  <Select className="m-1 wf-150" options={yearNumberLOVs} value={eyearTo} onChange={setEyearTo} />
                </div>
                <div className="d-flex">
                  <button type="submit" className="btn btn-pri" onClick={onSearch}>
                    Generate
                  </button>
                </div>
                <DataTable
                  data={tableData}
                  columns={columns}
                  rightHeaderContent={
                    <div className="align-items-center d-flex">
                      {tableData.length ? (
                        <button onClick={() => exportExcel(tableData, WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_LAPSE_OBSERVED_EHI.name, columns)} type="button" className="btn btn-pri">
                          Download
                        </button>
                      ) : null}
                    </div>
                  }
                  // title={title}
                  // showListHidden={showListHidden}
                  // pageSize={pageSize}
                  // getTrProps={getTrProps}
                  // showListPosition="end"
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

const mapStateToProps = (_reducer, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryLapseObserved));
