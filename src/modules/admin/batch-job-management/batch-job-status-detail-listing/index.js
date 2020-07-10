import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Sort from 'components/common/sort';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import GoBackButton from 'components/ui/go-back-button';

import { exportExcel } from 'utils';

import { filterListingAction, getListingAction, defaultFilterValue } from './action';

const BatchJobStatus = (props) => {
  const {
    getListingAction,
    filterListingAction,
    history,
    location: { state },
    ui: { isLoading },
    data: { filteredList },
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS_DETAIL_LISTING.name}`;
    getListingAction({ batchName: state?.jobName });
  }, [getListingAction, state]);

  useEffect(() => {
    filterListingAction({
      sortValue,
    });
  }, [sortValue, filterListingAction]);

  const columns = [
    {
      Header: 'Job Name',
      accessor: 'jobName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Status',
      accessor: 'status',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Active Status',
      accessor: 'activeStatus',
      minWidth: tableColumnWidth.md,
      Cell: (cellInfo) => (cellInfo.original?.activeStatus ? 'Yes' : 'No'),
    },
    {
      Header: 'Last Run',
      accessor: 'lastRun',
      minWidth: tableColumnWidth.lg,
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS_DETAIL_LISTING.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.BATCH_JOB_MANAGEMENT, WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS_DETAIL_LISTING]} />
          <GoBackButton title={WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS_DETAIL_LISTING.name} onClick={history.goBack} />
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <Sort className="navbar-nav sortWrapper ml-auto" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="paddingBottom50 tabsContainer">
            <div>
              <DataTable
                data={filteredList}
                columns={columns}
                rightHeaderContent={
                  <div className="d-flex align-items-center">
                    <button type="button" className="btn btn-sec m-1" onClick={() => exportExcel(filteredList, WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS_DETAIL_LISTING.name, columns)}>
                      Download
                    </button>
                  </div>
                }
              />
            </div>
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ adminReducers: { batchJobStatusDetailListing } }, ownProps) => ({
  ...ownProps,
  ...batchJobStatusDetailListing,
});

const mapDispatchToProps = {
  getListingAction,
  filterListingAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BatchJobStatus));
