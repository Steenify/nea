import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import NewBreadCrumb from 'components/ui/breadcrumb';
import DataTable from 'components/common/data-table';

import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { getListEmailHistory } from './action';

const EmailHistoryDetail = (props) => {
  const { getListEmailHistoryAcion, data } = props;

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.DASHBOARD.EMAIL_HISTORY_DETAIL.name}`;
    getListEmailHistoryAcion();
  }, [getListEmailHistoryAcion]);

  const list = data?.emailHostory?.listOfEmails || [];

  const columns = [
    {
      Header: 'Send Date',
      accessor: 'sendDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Email Addresses',
      accessor: 'emailAddressee',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Module Name',
      accessor: 'moduleName',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Function Name',
      accessor: 'functionName',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Status',
      accessor: 'status',
      minWidth: tableColumnWidth.md,
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.DASHBOARD.EMAIL_HISTORY_DETAIL.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.DASHBOARD, WEB_ROUTES.DASHBOARD.EMAIL_HISTORY_DETAIL]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.DASHBOARD.EMAIL_HISTORY_DETAIL.name}</h1>
          </div>
          <div className="paddingBottom50 tabsContainer">
            <div>
              <DataTable data={list} columns={columns} />
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ adminReducers: { emailHistory } }, ownProps) => ({
  ...ownProps,
  ...emailHistory,
});

const mapDispatchToProps = {
  getListEmailHistoryAcion: getListEmailHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailHistoryDetail);
