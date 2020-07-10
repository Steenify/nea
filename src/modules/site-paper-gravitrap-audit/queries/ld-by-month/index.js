import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import DataTable from 'components/common/data-table';
import MonthYearPicker from 'components/common/monthYearPicker';

import { WEB_ROUTES, tableColumnWidth } from 'constants/index';
import { exportExcel, actionTryCatchCreator } from 'utils';

import { getLDAmountByMonthService } from 'services/site-paper-gravitrap-audit';

const QueryLDByMonth = () => {
  const [startDate, setStartDate] = useState(moment().subtract(1, 'month').startOf('month').toDate());
  const [endDate, setEndDate] = useState(moment().toDate());
  const [tableData, setTableData] = useState([]);

  const [isLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_LD_AMOUNT_BY_MONTH.name}`;
  }, []);

  const onSearch = (e) => {
    e.preventDefault();

    const params = {
      yearFrom: moment(startDate).format('YYYY'),
      monthFrom: moment(startDate).format('MM'),
      yearTo: moment(endDate).format('YYYY'),
      monthTo: moment(endDate).format('MM'),
    };

    // const from = moment(startDate).format('YYYY_MM');
    // const to = moment(endDate).format('YYYY_MM');

    const onPending = () => {
      setLocalLoading(true);
    };
    const onSuccess = (data) => {
      const list = (data.sitePaperList || []).map((item) => item.gravitrapSitePaperVo);
      setTableData(list);
      setLocalLoading(false);
    };
    const onError = (error) => {
      setLocalLoading(false);
    };
    actionTryCatchCreator(getLDAmountByMonthService(params), onPending, onSuccess, onError);
  };

  const columns = [
    {
      Header: 'Year/Month',
      accessor: 'year',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Liquidated Damages Amount for ERO',
      accessor: 'erold',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'LD Amount for CRO',
      accessor: 'crold',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'LD Amount for WRO',
      accessor: 'wrold',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'LD Amount for COB1',
      accessor: 'cob1ld',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'LD Amount for EHI',
      accessor: 'ehild',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Total LD Amount (System-calculated)',
      accessor: 'totalLDAmount',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Revised LD Amount for Specific Year/Month (Total)',
      accessor: 'revisedLd',
      minWidth: tableColumnWidth.lg,
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content">
        <NavBar active={WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_LD_AMOUNT_BY_MONTH.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.EHI_GRAVITRAP_AUDIT, WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_LD_AMOUNT_BY_MONTH]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_LD_AMOUNT_BY_MONTH.name}</h1>
          </div>
          <div className="paddingLeft30">
            <h2>Selection Criteria</h2>
          </div>
          <div className="block-summary filterMainWrapper tabsContainer" style={{ padding: '30px' }}>
            <div className="tab-pane__group bg-white">
              <div className="card">
                <div className="form-inline marginBottom30">
                  <div className="paddingRight25 xs-paddingBottom15">
                    <MonthYearPicker label="Month - Year From (*)" selected={startDate} onChange={setStartDate} dateFormat="MMMM, yyyy" maxDate={endDate} />
                  </div>
                  <div>
                    <MonthYearPicker label="Month - Year To (*)" selected={endDate} onChange={setEndDate} dateFormat="MMMM, yyyy" minDate={startDate} />
                  </div>
                </div>
              </div>
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
                    <button onClick={() => exportExcel(tableData, WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_LD_AMOUNT_BY_MONTH.name, columns)} type="button" className="btn btn-pri">
                      Download
                    </button>
                  ) : null}
                </div>
              }
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryLDByMonth));
