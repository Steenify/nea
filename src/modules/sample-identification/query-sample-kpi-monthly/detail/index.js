import React, { useEffect, useCallback } from 'react';

import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';

import DataTable from 'components/common/data-table';
import { getMonthFromString } from 'utils';
import InPageLoading from 'components/common/inPageLoading';
import { WEB_ROUTES } from 'constants/index';
import GoBackButton from 'components/ui/go-back-button';
import { getSampleKPIMonthlyDetailAction } from '../action';

const SamplesIdentifiedByMonth = ({ getSampleKPIMonthlyDetailAction, ui: { isLoading = false }, data = [], location: { pathname, state }, history }) => {
  const inputData = state?.data;

  const getData = useCallback(() => {
    const [month, year] = inputData?.month?.split('-') || ['', ''];
    getSampleKPIMonthlyDetailAction({
      year: year || '',
      month: `${getMonthFromString(month || '')}`,
      ro: inputData?.ro || '',
      index: inputData?.index || '0',
    });
  }, [inputData, getSampleKPIMonthlyDetailAction]);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_KPI_MONTHLY_DETAIL.name}`;
    getData();
  }, [getData]);

  const columns = [
    {
      Header: 'RO',
      accessor: 'ro',
      width: 100,
    },
    {
      Header: 'Sample ID',
      accessor: 'sampleid',
      minWidth: 150,
    },
    {
      Header: 'Sample Received Date',
      accessor: 'sampleReceivedDate',
      minWidth: 250,
    },
    {
      Header: 'Sample Identified Date',
      accessor: 'sampleTestedDate',
      minWidth: 250,
    },
    {
      Header: 'Analyst',
      accessor: 'analyst',
      minWidth: 200,
    },
    {
      Header: 'Remarks',
      accessor: 'remarks',
      minWidth: 200,
    },
  ];

  if (!inputData) {
    return <Redirect to={pathname.slice(0, pathname.lastIndexOf('/'))} />;
  }

  return (
    <>
      <Header />
      <div className="main-content">
        <NavBar active={WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_KPI_MONTHLY.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.SAMPLE_IDENTIFICATION, WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_KPI_MONTHLY, WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_KPI_MONTHLY_DETAIL]} />
          <GoBackButton title={WEB_ROUTES.SAMPLE_IDENTIFICATION.QUERY_SAMPLE_KPI_MONTHLY_DETAIL.name} onClick={history.goBack} />

          <div className="block-summary filterMainWrapper tabsContainer" style={{ padding: '30px' }}>
            <DataTable data={data} columns={columns} title="" />

            <div className="justify-content-center d-flex" />
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ sampleIdentificationReducers: { querySampleKPIMonthlyDetail } }, ownProps) => ({
  ...ownProps,
  ...querySampleKPIMonthlyDetail,
});

const mapDispatchToProps = { getSampleKPIMonthlyDetailAction };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SamplesIdentifiedByMonth));
