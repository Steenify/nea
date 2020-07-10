import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import Sort from 'components/common/sort';
import GoBackButton from 'components/ui/go-back-button';

import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { exportExcel } from 'utils';

import { defaultFilterValue, filterListAction, queryOperationalSchedulesInfoAction } from './action';

const SurveillanceActivitiesListed = (props) => {
  const {
    history,
    location: {
      state: { operationalSchedule },
    },
    operationalScheduleInfo: {
      ui: { isLoading },
      data: { filteredList = [] },
    },
    filterListAction,
    queryOperationalSchedulesInfoAction,
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);

  useEffect(() => {
    queryOperationalSchedulesInfoAction({
      opsScheduleId: operationalSchedule?.opsScheduleId,
    });
  }, [operationalSchedule, queryOperationalSchedulesInfoAction]);

  useEffect(() => {
    filterListAction({ sortValue });
  }, [sortValue, filterListAction]);

  const columns = [
    {
      Header: 'Week',
      accessor: 'week',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Day',
      accessor: 'day',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Date',
      accessor: 'operationDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Division',
      accessor: 'division',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Zones',
      accessor: 'zones',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'No. of Zones',
      accessor: 'noOfZones',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Status',
      accessor: 'opsStatus',
      minWidth: tableColumnWidth.md,
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.RODENT_AUDIT.OPERATIONAL_SCHEDULE.name} />

        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.RODENT_AUDIT, WEB_ROUTES.RODENT_AUDIT.OPERATIONAL_SCHEDULE, WEB_ROUTES.RODENT_AUDIT.SURVEILLANCE_ACTIVITIES_LISTED]} />
          <GoBackButton onClick={() => history.goBack()} title={`CRO ${operationalSchedule.periodFrom} to ${operationalSchedule.periodTo}`} />
          {/* <div className="main-title">
            <h1>{WEB_ROUTES.RODENT_AUDIT.SURVEILLANCE_ACTIVITIES_LISTED.name}</h1>

            <button className="btn btn-sec ml-auto" onClick={() => setShowUploadModal(true)}>
              Upload
            </button>

            <button className="btn btn-sec ml-2" onClick={() => exportExcel(filteredList, WEB_ROUTES.RODENT_AUDIT.OPERATIONAL_SCHEDULE.name, columns)}>
              Download
            </button>
          </div> */}
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <Sort className="navbar-nav sortWrapper ml-auto" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="tabsContainer">
            <DataTable
              data={filteredList}
              columns={columns}
              getTdProps={(state, rowInfo) => {
                if (rowInfo && rowInfo.row && (rowInfo.row.isPublicHoliday || rowInfo.row.opsStatus === 'Public Holiday')) {
                  return {
                    className: 'cursor-default',
                    style: { backgroundColor: '#f5f5f5' },
                  };
                }

                return {
                  onClick: () => {
                    if (rowInfo.original.reportFileId && rowInfo.original.isClickable) {
                      history.push(WEB_ROUTES.RODENT_AUDIT.DAILY_REPORT_DETAIL.url, { fileId: rowInfo.original.reportFileId });
                    }
                  },
                  className: 'cursor-pointer',
                };
              }}
              rightHeaderContent={
                <div className="d-flex align-items-center">
                  <button type="button" className="btn btn-sec m-1" onClick={() => exportExcel(filteredList, WEB_ROUTES.RODENT_AUDIT.SURVEILLANCE_ACTIVITIES_LISTED.name, columns)}>
                    Download
                  </button>
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

const mapStateToProps = ({ rodentAuditReducers: { operationalScheduleInfo } }, onwProps) => ({ ...onwProps, operationalScheduleInfo });

const mapDispatchToProps = {
  filterListAction,
  queryOperationalSchedulesInfoAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveillanceActivitiesListed);
