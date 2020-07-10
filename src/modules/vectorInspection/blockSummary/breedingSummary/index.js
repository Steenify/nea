import React, { useEffect } from 'react';
import { withRouter, Redirect } from 'react-router-dom';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import DataTable from 'components/common/data-table';
import { connect } from 'react-redux';
import InPageLoading from 'components/common/inPageLoading';
import Breadcrumb from 'components/ui/breadcrumb';
import { WEB_ROUTES } from 'constants/index';
import GoBackButton from 'components/ui/go-back-button';
import { getBreedingSummaryAction } from './action';

const columns = [
  {
    Header: 'Inspection as at Date',
    accessor: 'inspectionDate',
  },
  {
    Header: 'Inspection as at Time',
    accessor: 'inspectionTime',
  },
  {
    Header: 'Unit',
    accessor: 'unit',
    // minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Specimen Type',
    accessor: 'specimenType',
    // minWidth: tableColumnWidth.xl,
  },
  {
    Header: 'Officer Name',
    accessor: 'inspector',
  },
];

const BreedingSummary = ({
  history: { goBack },
  location: { state, pathname },

  ui: { isLoading },
  getBreedingSummaryAction,
  data: { blockHouseNo = 'BLK', roadName = '', postalCode = '', inspectionDateFrom = '', inspectionDateTo = '', breedingSummary = [] },
}) => {
  const block = state?.block;
  const parent = state?.parent;
  const fromLatest = state?.fromLatest || false;
  useEffect(() => {
    document.title = 'NEA | Breeding Summary';
    if (!block) return;
    const { inspectionDateFrom, inspectionDateTo, postalCode, blockHouseNo } = block;
    getBreedingSummaryAction(
      {
        inspectionDateFrom,
        inspectionDateTo,
        postalCode,
        blockHouseNo,
      },
      fromLatest,
    );
  }, [getBreedingSummaryAction, block, fromLatest]);

  if (!block) {
    return <Redirect to={pathname.slice(0, pathname.lastIndexOf('/'))} />;
  }

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={parent} />
        <div className="contentWrapper">
          <Breadcrumb
            page={[
              WEB_ROUTES.INSPECTION_MANAGEMENT,
              fromLatest ? WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION : WEB_ROUTES.INSPECTION_MANAGEMENT.BLOCK_SUMMARY,
              fromLatest ? WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION_BREEDING_SUMMARY : WEB_ROUTES.INSPECTION_MANAGEMENT.BLOCK_SUMMARY_BREEDING_SUMMARY,
            ]}
          />
          <GoBackButton onClick={goBack} title={`Back to ${[blockHouseNo, roadName, postalCode].filter((i) => i).join(', ')}`} />

          {/* <div className="paddingLeft30">{`Inspection Date: ${inspectionDateFrom} to ${inspectionDateTo}`}</div> */}
          <div className="tabsContainer">
            <DataTable data={breedingSummary} columns={columns} title={fromLatest ? '' : `Inspection Date: ${inspectionDateFrom} to ${inspectionDateTo}`} />
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ vectorInspectionReducers: { blockBreedingSummary } }, ownProps) => ({
  ...ownProps,
  ...blockBreedingSummary,
});

const mapDispatchToProps = {
  getBreedingSummaryAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BreedingSummary));
