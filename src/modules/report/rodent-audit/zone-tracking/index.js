import React, { useState, useEffect, useRef } from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import DataTable from 'components/common/data-table';
import Sort from 'components/common/sort';
import CheckForEncryption from 'modules/checkForEncryption';

import { zoneTrackingService } from 'services/report/rodent-audit';
import { WEB_ROUTES, tableColumnWidth, FUNCTION_NAMES } from 'constants/index';
import { sortFunc, exportExcel, actionTryCatchCreator } from 'utils';

const ZoneTracking = () => {
  const [tableData, setTableData] = useState([]);
  const [sortValue, setSortValue] = useState({ id: 'uploadedDate', label: 'Date', desc: false });

  const [isLoading, setLocalLoading] = useState(false);
  const passwordModalRef = useRef(null);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.REPORT.ZONE_TRACKING.name}`;
    if (passwordModalRef.current) {
      passwordModalRef.current.showPasswordModal();
    }
  }, [passwordModalRef]);

  const onSearch = (password) => {
    const onPending = () => {
      setLocalLoading(true);
    };
    const onSuccess = (data) => {
      setTableData(data.zoneTrackingList || []);
      setLocalLoading(false);
    };
    const onError = (error) => {
      setLocalLoading(false);
    };
    return actionTryCatchCreator(zoneTrackingService({ password }), onPending, onSuccess, onError);
  };

  const columns = [
    {
      Header: 'Week',
      accessor: 'week',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Date',
      accessor: 'uploadedDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Zones',
      accessor: 'zones',
      minWidth: tableColumnWidth.lg,
    },
  ];

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        className: rowInfo.row._original.isAudited ? 'bg-light-grey' : '',
      };
    }
    return {};
  };

  const filteredTableData = tableData.sort((a, b) => sortFunc(a, b, sortValue));

  return (
    <>
      <Header />
      <div className="main-content">
        <NavBar active={WEB_ROUTES.REPORT.ZONE_TRACKING.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.REPORT, WEB_ROUTES.REPORT.ZONE_TRACKING]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.REPORT.ZONE_TRACKING.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <Sort className="navbar-nav sortWrapper ml-auto" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="block-summary filterMainWrapper tabsContainer" style={{ padding: '30px' }}>
            <DataTable
              data={filteredTableData}
              columns={columns}
              getTrProps={getTrProps}
              rightHeaderContent={
                <div className="align-items-center d-flex">
                  {filteredTableData.length ? (
                    <button onClick={() => exportExcel(filteredTableData, WEB_ROUTES.REPORT.ZONE_TRACKING.name, columns)} type="button" className="btn btn-pri">
                      Download
                    </button>
                  ) : null}
                </div>
              }
            />
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
          <CheckForEncryption functionName={FUNCTION_NAMES.zoneTracking} ref={passwordModalRef} onGenerate={onSearch} />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (_reducer, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ZoneTracking));
