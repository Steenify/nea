import React, { useState, useEffect } from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import SingleDatePickerV2 from 'components/common/single-date-picker';
import { actionTryCatchCreator, dateStringFromDate, exportExcel } from 'utils';
import InPageLoading from 'components/common/inPageLoading';
import DataTable from 'components/common/data-table';

import { queryTaskAuditedService } from 'services/ehi-gravitrap-audit';
import { WEB_ROUTES, tableColumnWidth } from 'constants/index';
import moment from 'moment';

const QueryTaskAudited = () => {
  const [submissionFrom, setSubmissionFrom] = useState(moment().add(-1, 'days'));
  const [submissionTo, setSubmissionTo] = useState(moment());
  const [tableData, setTableData] = useState([]);

  const [columns, setColumns] = useState([]);

  const [isLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_TASK_AUDITED_EHI.name}`;
  }, []);

  const onSearch = (e) => {
    e.preventDefault();

    const params = {
      submissionDateFrom: dateStringFromDate(submissionFrom),
      submissionDateTo: dateStringFromDate(submissionTo),
    };

    const onPending = () => {
      setColumns([]);
      setTableData([]);
      setLocalLoading(true);
    };
    const onSuccess = (data) => {
      const list = data.tasksAuditedList || [];
      const mappedList = list.length > 0 ? [...list, { tasksAudited: data?.totalTasksAudited || '', auditedBy: 'Total' }] : [];
      const c = mappedList.map(({ auditedBy }, index) => ({
        Header: auditedBy,
        accessor: index.toString(),
        minWidth: tableColumnWidth.lg,
      }));
      const d = {};
      mappedList.forEach(({ tasksAudited }, index) => {
        d[index.toString()] = tasksAudited;
      });
      setTableData(c.length > 0 ? [d] : []);
      setColumns(c.length > 0 ? c : [{ Header: '', accessor: 'temp' }]);
      setLocalLoading(false);
    };
    const onError = () => setLocalLoading(false);
    actionTryCatchCreator(queryTaskAuditedService(params), onPending, onSuccess, onError);
  };

  const canGenerate = submissionFrom && submissionTo;
  return (
    <>
      <Header />
      <div className="main-content">
        <NavBar active={WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_TASK_AUDITED_EHI.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.EHI_GRAVITRAP_AUDIT, WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_TASK_AUDITED_EHI]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_TASK_AUDITED_EHI.name}</h1>
          </div>
          <div className="paddingLeft30">
            <h2>Selection Criteria</h2>
          </div>
          <div className="block-summary filterMainWrapper tabsContainer" style={{ padding: '30px' }}>
            <div className="tab-pane__group bg-white">
              <div className="card">
                <div className="form-inline mb-4">
                  <div className="mr-3">
                    <b className="text-body">Submission Date From (*)</b>
                    <SingleDatePickerV2
                      className="mt-2 mr-2 xs-paddingBottom15"
                      date={submissionFrom}
                      onChangeDate={setSubmissionFrom}
                      minDate={moment().add(-process.env.REACT_APP_REPORT_PAST_YEAR, 'years')}
                      maxDate={submissionTo}
                    />
                  </div>
                  <div>
                    <b className="text-body">Submission Date To (*)</b>
                    <SingleDatePickerV2
                      className="mt-2 mr-2 xs-paddingBottom15"
                      date={submissionTo}
                      onChangeDate={setSubmissionTo}
                      minDate={submissionFrom || moment().add(-process.env.REACT_APP_REPORT_PAST_YEAR, 'years')}
                    />
                  </div>
                </div>
                <div className="d-flex marginBottom30">
                  <button type="submit" className="btn btn-pri" onClick={onSearch} disabled={!canGenerate}>
                    Generate
                  </button>
                </div>
                {columns.length > 0 && (
                  <DataTable
                    data={tableData}
                    columns={columns}
                    pageSize={1}
                    defaultPageSize={1}
                    // showListHidden
                    rightHeaderContent={
                      <div className="align-items-center d-flex">
                        {tableData.length ? (
                          <button type="submit" className="btn btn-pri ml-3" onClick={() => exportExcel(tableData, WEB_ROUTES.EHI_GRAVITRAP_AUDIT.QUERY_TASK_AUDITED_EHI.name, columns)}>
                            Download
                          </button>
                        ) : null}
                      </div>
                    }
                  />
                )}
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

const mapStateToProps = (_reducer, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryTaskAudited));
