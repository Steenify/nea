import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import NewBreadCrumb from 'components/ui/breadcrumb';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';

import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { getApprovedTcForm3ListAction, sentToEEMSAction } from './action';

const SendTCApprovedForm3ToEEMS2 = (props) => {
  const {
    getApprovedTcForm3ListAction,
    sentToEEMSAction,
    // userRole,

    // history,
    ui: { isLoading },
    data: { list },
  } = props;

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.SEND_TC_FORM3_TO_EEMS2.name}`;
    getApprovedTcForm3ListAction();
  }, [getApprovedTcForm3ListAction]);

  const columns = [
    {
      Header: 'Form 3 ID',
      accessor: 'form3Id',
      minWidth: tableColumnWidth.md,
      Cell: (cellInfo) => (
        <span className="text-blue cursor-pointer" onClick={() => {}}>
          {cellInfo.row.form3Id}
        </span>
      ),
    },
    {
      Header: 'Classification',
      accessor: 'classification',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Cluster ID',
      accessor: 'clusterId',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Habitat',
      accessor: 'habitat',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'PCO Schedule Date',
      accessor: 'pcoScheduleDate',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'Density',
      accessor: 'density',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Action',
      accessor: 'action',
      minWidth: tableColumnWidth.md,
      Cell: (cellInfo) => (
        <button
          type="button"
          className="btn btn-sec"
          onClick={() =>
            sentToEEMSAction({ tcRegimeDetailVOList: [{ id: cellInfo.row._original.id }] }, () => {
              toast.success('Sent to EEMS2.');
              getApprovedTcForm3ListAction();
            })
          }>
          Send To EEMS2
        </button>
      ),
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.INSPECTION_MANAGEMENT.SEND_TC_FORM3_TO_EEMS2.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.SEND_TC_FORM3_TO_EEMS2]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.INSPECTION_MANAGEMENT.SEND_TC_FORM3_TO_EEMS2.name}</h1>
          </div>
          <div className="tabsContainer">
            <DataTable data={list} columns={columns} />
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global, vectorInspectionReducers: { sendTCApprovedForm3ToEEMS2 } }, ownProps) => ({
  ...ownProps,
  ...sendTCApprovedForm3ToEEMS2,
  userRole: global.ui.userRole,
});

const mapDispatchToProps = {
  getApprovedTcForm3ListAction,
  sentToEEMSAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SendTCApprovedForm3ToEEMS2));
