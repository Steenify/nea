import React, { useState, useEffect } from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import SearchableCheckList from 'components/common/searchable-check-list';
import { actionTryCatchCreator } from 'utils';
import InPageLoading from 'components/common/inPageLoading';
import DataTable from 'components/common/data-table';
import { getMastercodeAction, MASTER_CODE } from 'store/actions';

import { getOutstandingauditService } from 'services/site-paper-gravitrap-audit';
import { WEB_ROUTES, tableColumnWidth } from 'constants/index';
import { exportExcel } from 'utils';

const QueryOutstandingAuditTask = (props) => {
  const { getMastercodeAction, masterCodes } = props;
  const [roList, setROList] = useState([]);
  const [grcList, setGRCList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [isLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_OUTSTANDING_AUDIT_TASK.name}`;
    getMastercodeAction([MASTER_CODE.RO_CODE, MASTER_CODE.GRC_CODE, MASTER_CODE.DIVISION_CODE], undefined, true);
  }, [getMastercodeAction]);

  const onSearch = (e) => {
    e.preventDefault();

    const params = {
      roCode: roList[0]?.value,
      grcCode: grcList[0]?.value,
      divCode: divisionList[0]?.value,
    };

    const onPending = () => setLocalLoading(true);
    const onSuccess = (data) => {
      setTableData(data.GraviTrapSitePaperAuditVO || []);
      setLocalLoading(false);
    };
    const onError = (error) => {
      setLocalLoading(false);
    };
    actionTryCatchCreator(getOutstandingauditService(params), onPending, onSuccess, onError);
  };

  const columns = [
    {
      Header: 'Task ID',
      accessor: 'taskId',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'RO',
      accessor: 'ro',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'GRC',
      accessor: 'grc',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Division',
      accessor: 'division',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Road',
      accessor: 'roadName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Block',
      accessor: 'blockNo',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Level',
      accessor: 'levelNo',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Unit',
      accessor: 'unitNo',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Postal Code',
      accessor: 'postalCode',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Label',
      accessor: 'trapCode',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'eWeek',
      accessor: 'eweek',
      minWidth: tableColumnWidth.md,
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content">
        <NavBar active={WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_OUTSTANDING_AUDIT_TASK.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.EHI_GRAVITRAP_AUDIT, WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_OUTSTANDING_AUDIT_TASK]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_OUTSTANDING_AUDIT_TASK.name}</h1>
          </div>
          <div className="paddingLeft30">
            <h2>Selection Criteria</h2>
          </div>
          <div className="block-summary filterMainWrapper tabsContainer" style={{ padding: '30px' }}>
            <div className="tab-pane__group bg-white">
              <div className="card">
                <div className="form-inline mb-4">
                  <div className="form-group form-group__stacked mb-4">
                    <SearchableCheckList title="RO" options={masterCodes[MASTER_CODE.RO_CODE]} onChange={(list) => setROList(list)} singleChoice />
                  </div>
                  <div className="form-group form-group__stacked mb-4">
                    <SearchableCheckList title="GRC" options={masterCodes[MASTER_CODE.GRC_CODE]} onChange={(list) => setGRCList(list)} singleChoice />
                  </div>
                  <div className="form-group form-group__stacked mb-4">
                    <SearchableCheckList title="Division" options={masterCodes[MASTER_CODE.DIVISION_CODE]} onChange={(list) => setDivisionList(list)} singleChoice />
                  </div>
                </div>
                <div className="d-flex mb-4">
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
                        <button onClick={() => exportExcel(tableData, WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_OUTSTANDING_AUDIT_TASK.name, columns)} type="button" className="btn btn-pri">
                          Download
                        </button>
                      ) : null}
                    </div>
                  }
                />
              </div>
            </div>
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

const mapDispatchToProps = { getMastercodeAction };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryOutstandingAuditTask));
