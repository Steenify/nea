import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { getRodentInspectionDetailAction } from './action';

const columns = [
  {
    Header: 'S/No.',
    accessor: 'sNo',
    minWidth: tableColumnWidth.sm,
  },
  {
    Header: 'Street Name',
    accessor: 'streetName',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Postal Code',
    accessor: 'postalCode',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Location of Burrows',
    accessor: 'burrowLocation',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Defects',
    accessor: 'defects',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Burrows',
    accessor: 'burrows',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Dead Rats',
    accessor: 'deadRats',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Droppings',
    minWidth: tableColumnWidth.md,
    Cell: (cellInfo) => <div> {cellInfo.row.something ? 'X' : ''}</div>,
  },
  {
    Header: 'Soil dug-out',
    minWidth: tableColumnWidth.md,
    Cell: (cellInfo) => <div> {cellInfo.row.something ? 'X' : ''}</div>,
  },
  {
    Header: 'Rub marks',
    minWidth: tableColumnWidth.md,
    Cell: (cellInfo) => <div> {cellInfo.row.something ? 'X' : ''}</div>,
  },
  {
    Header: 'Gnaw marks',
    minWidth: tableColumnWidth.md,
    Cell: (cellInfo) => <div> {cellInfo.row.something ? 'X' : ''}</div>,
  },
  {
    Header: 'Poor housekeeping',
    minWidth: tableColumnWidth.md,
    Cell: (cellInfo) => <div> {cellInfo.row.something ? 'X' : ''}</div>,
  },
  {
    Header: 'Poor waste management',
    minWidth: tableColumnWidth.md,
    Cell: (cellInfo) => <div> {cellInfo.row.something ? 'X' : ''}</div>,
  },
  {
    Header: 'Remarks',
    accessor: 'remarks',
    minWidth: tableColumnWidth.xxl,
  },
];

const QueryRodentInspectionDetail = (props) => {
  const {
    getRodentInspectionDetailAction,

    history,
    location: { search },
    ui: { isLoading },
    data: { filteredList },
  } = props;

  const { rccId } = queryString.parse(search);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_RODENT_INSPECTION_DETAIL.name}`;
    if (rccId) {
      getRodentInspectionDetailAction({ rccId });
    }
  }, [getRodentInspectionDetailAction, rccId]);

  const handleBack = () => {
    history.goBack();
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_RODENT_INSPECTION_DETAIL.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_RODENT_INSPECTION, WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_RODENT_INSPECTION_DETAIL]} />
          <div className="paddingBottom50">
            <div className="go-back">
              <span onClick={handleBack}>RCCID: {rccId}</span>
            </div>
            <div className="tabsContainer">
              <DataTable data={filteredList || []} columns={columns} />
            </div>
          </div>

          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ vectorInspectionReducers: { queryRodentInspectionDetail } }, ownProps) => ({
  ...ownProps,
  ...queryRodentInspectionDetail,
});

const mapDispatchToProps = {
  getRodentInspectionDetailAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryRodentInspectionDetail));
