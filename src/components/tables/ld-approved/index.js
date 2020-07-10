import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';

import { WEB_ROUTES, tableColumnWidth, SITE_PAPER_STATUS } from 'constants/index';

import { queryLdRemarksByMonthAndYearService } from 'services/site-paper-gravitrap-audit';
import { actionTryCatchCreator } from 'utils';

const LDApproved = ({ title = '', showListHidden = false, pageSize = null, history: { push } }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const getSOFPendingListing = () => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setIsLoading(false);
      setTableData(data?.graviTrapLapsesList || []);
    };
    const onError = (error) => {
      setIsLoading(false);
      console.log('TCL: onPending -> error', error);
    };
    actionTryCatchCreator(queryLdRemarksByMonthAndYearService(), onPending, onSuccess, onError);
  };

  useEffect(() => {
    getSOFPendingListing();
  }, []);

  const columns = [
    {
      Header: 'Month / Year',
      accessor: 'monthyear',
      minWidth: tableColumnWidth.lg,
      maxWidth: 300,
    },
    {
      Header: 'Total Liquidated Damage Amount',
      accessor: 'totalLDAmount',
      minWidth: tableColumnWidth.lg,
      Cell: (cellInfo) => {
        const status = SITE_PAPER_STATUS.LD_APPROVED;
        const caseInfo = cellInfo?.row?._original || {};
        return (
          <span
            className="text-blue cursor-pointer"
            onClick={() => {
              if (cellInfo && cellInfo.row) {
                push(WEB_ROUTES.SITE_PAPER_GRAVITRAP_AUDIT.LD_APPROVAL.url, {
                  caseInfo: { ...caseInfo, status },
                });
              }
            }}>
            {cellInfo.row.totalLDAmount}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <DataTable data={tableData} columns={columns} title={title} showListHidden={showListHidden} pageSize={pageSize} showListPosition="end" />
      <InPageLoading isLoading={isLoading} />
    </>
  );
};

export default withRouter(LDApproved);
