import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';

import DataTable from 'components/common/data-table';
import moment from 'moment';
import InPageLoading from 'components/common/inPageLoading';
import MonthYearPicker from 'components/common/monthYearPicker';
import { WEB_ROUTES, tableColumnWidth } from 'constants/index';

import { exportExcel } from 'utils';
import { generateSampleKPIMonthlyAction } from './action';

function firstDayInPreviousMonth(yourDate) {
  return new Date(yourDate.getFullYear(), yourDate.getMonth() - 1, 1);
}

const SamplesIdentifiedByMonth = ({
  // history,
  generateSampleKPIMonthlyAction,
  ui: { isLoading = false },
  data = [],
}) => {
  const [startDate, setStartDate] = useState(firstDayInPreviousMonth(new Date()));
  const [endDate, setEndDate] = useState(new Date());
  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_KPI_MONTHLY.name}`;
  }, []);

  useEffect(() => {
    const [fromMonth, fromYear] = moment(startDate).format('M/YYYY').split('/');
    const [toMonth, toYear] = moment(endDate).format('M/YYYY').split('/');
    generateSampleKPIMonthlyAction({
      fromMonth,
      fromYear,
      toMonth,
      toYear,
    });
  }, [startDate, endDate, generateSampleKPIMonthlyAction]);

  const columns = [
    {
      Header: 'Month',
      accessor: 'month',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'RO',
      accessor: 'ro',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'No. of ID Keyed in Within 2 working days after sample received',
      accessor: 'withinTwoDays',
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: 'No. of ID Keyed in Within 3-4 working days after sample received',
      accessor: 'withinFourDays',
      minWidth: tableColumnWidth.xxl,
      Cell: ({ row: { _original } }) =>
        (_original?.withinFourDays === 0 ? (
          0
        ) : (
          <Link
            to={{
              pathname: WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_KPI_MONTHLY_DETAIL.url,
              state: { data: { ..._original, index: 2 } },
            }}
            className="text-blue cursor-pointer">
            {_original.withinFourDays}
          </Link>
        )),
    },
    {
      Header: 'No. of ID Keyed in More Than 4 working days after sample received',
      accessor: 'moreThanFourDays',
      minWidth: tableColumnWidth.xxl,
      Cell: ({ row: { _original } }) =>
        (_original?.moreThanFourDays === 0 ? (
          0
        ) : (
          <Link
            to={{
              pathname: WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_KPI_MONTHLY_DETAIL.url,
              state: { data: { ..._original, index: 3 } },
            }}
            className="text-blue cursor-pointer">
            {_original.moreThanFourDays}
          </Link>
        )),
    },
    {
      Header: 'Total Number of ID Keyed In',
      accessor: 'totalNumberOfSamples',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: '% of ID Keyed in Within 2 working days after sample received',
      accessor: 'withinTwoDaysPercentage',
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: '% of ID Keyed in Within 3-4 working days after sample received',
      accessor: 'withinFourDaysPercentage',
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: '% of ID Keyed in More Than 4 working days after sample received',
      accessor: 'moreThanFourDaysPercentage',
      minWidth: tableColumnWidth.xxl,
    },
  ];

  const handleExport = () => {
    exportExcel(data, 'query-sample-kpi', columns);
  };

  return (
    <>
      <Header />
      <div className="main-content">
        <NavBar active={WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_KPI_MONTHLY.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.SAMPLE_IDENTIFICATION, WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_KPI_MONTHLY]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_KPI_MONTHLY.name}</h1>
          </div>
          <div className="block-summary filterMainWrapper tabsContainer" style={{ padding: '30px' }}>
            <div className="tab-pane__group bg-white">
              <div className="card">
                <div className="form-inline">
                  <div className="paddingRight25 xs-paddingBottom15">
                    <MonthYearPicker label="Sample Received From (*)" selected={startDate} onChange={setStartDate} dateFormat="MMMM, yyyy" maxDate={endDate} />
                  </div>

                  <div>
                    <MonthYearPicker label="Sample Received To (*)" selected={endDate} onChange={setEndDate} dateFormat="MMMM, yyyy" minDate={startDate} />
                  </div>
                </div>
              </div>
            </div>

            <DataTable
              data={data}
              columns={columns}
              rightHeaderContent={
                <div className="align-items-center d-flex">
                  {data.length ? (
                    <button onClick={handleExport} type="button" className="btn btn-pri">
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

const mapStateToProps = ({ sampleIdentificationReducers: { querySampleKPIMonthly } }, ownProps) => ({
  ...ownProps,
  ...querySampleKPIMonthly,
});

const mapDispatchToProps = { generateSampleKPIMonthlyAction };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SamplesIdentifiedByMonth));
