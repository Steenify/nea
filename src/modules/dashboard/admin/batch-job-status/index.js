import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { WEB_ROUTES, tableColumnWidth } from 'constants/index';

import DataTable from 'components/common/data-table';

import { viewBatchJobStatusAction } from '../action';

const BatchJobStatus = (props) => {
  const {
    data: { batchJobStatus },
    viewBatchJobStatusAction,
    history,
  } = props;

  useEffect(() => {
    viewBatchJobStatusAction();
  }, [viewBatchJobStatusAction]);

  return (
    <div className="tab-pane__group bg-white">
      <p className="tab-pane__title text-bold">Batch Job Status</p>
      <div className="card p-0">
        <div className="card-body">
          <DataTable
            data={batchJobStatus}
            // showListPosition="end"
            tableClassName="header-white"
            columns={[
              {
                Header: 'Job Name',
                accessor: 'jobName',
                minWidth: tableColumnWidth.xxl,
              },
              {
                Header: 'Status',
                accessor: 'status',
                minWidth: tableColumnWidth.md,
              },
              {
                Header: 'Last Run',
                accessor: 'lastRun',
                minWidth: tableColumnWidth.lg,
              },
            ]}
            getTrProps={(_state, rowInfo) => {
              if (rowInfo && rowInfo.row) {
                return {
                  onClick: () => {
                    history.push(WEB_ROUTES.BATCH_JOB_MANAGEMENT.BATCH_JOB_STATUS_DETAIL_LISTING.url, rowInfo.row._original);
                  },
                  className: 'cursor-pointer',
                };
              }
              return {};
            }}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ global, dashboardReducers: { adminDashboard } }, ownProps) => ({
  ...ownProps,
  ...adminDashboard,
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {
  viewBatchJobStatusAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BatchJobStatus));
