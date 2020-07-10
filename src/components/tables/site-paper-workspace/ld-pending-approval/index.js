import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';

import { WEB_ROUTES, tableColumnWidth } from 'constants/index';

import { viewLDSummaryService, collateApproveLDService } from 'services/site-paper-gravitrap-audit';

import { actionTryCatchCreator, monthIntToString } from 'utils';

const Table = (props) => {
  const {
    history: { push },
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const getListingAction = () => {
    const onPending = () => {
      setIsLoading(true);
    };
    const onSuccess = (data) => {
      setIsLoading(false);
      const list = data?.graviTrapLapsesList || [];
      const mappedList = list.map((item) => {
        const monthYear = item?.monthyear || '';
        const [month = 0, year = 0] = monthYear.split('/');
        const monthInt = Number(month) || 0;
        const mappedMonth = monthIntToString(monthInt - 1, true);
        const displayAmount = `$${item?.totalLDAmount || 0}`;
        return { ...item, month, year, displayAmount, mappedMonth };
      });
      setTableData(mappedList);
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(viewLDSummaryService(), onPending, onSuccess, onError);
  };

  useEffect(() => {
    getListingAction();
  }, []);

  const columns = [
    {
      Header: 'Year',
      accessor: 'year',
      minWidth: tableColumnWidth.lg,
      maxWidth: 300,
    },
    {
      Header: 'Month',
      accessor: 'mappedMonth',
      minWidth: tableColumnWidth.lg,
      maxWidth: 300,
    },
    {
      Header: 'Total Liquidated Damage Amount',
      accessor: 'displayAmount',
      minWidth: tableColumnWidth.lg,
    },
  ];

  const getTemplateAction = (params = { year: 0, month: 0 }) => {
    const onPending = () => {
      setIsLoading(true);
    };
    const onSuccess = (template) => {
      setIsLoading(false);
      push(WEB_ROUTES.SITE_PAPER_GRAVITRAP_AUDIT.LD_APPROVAL.url, {
        ...params,
        template,
      });
    };
    const onError = (error) => {
      setIsLoading(false);
    };
    actionTryCatchCreator(collateApproveLDService(params), onPending, onSuccess, onError);
  };

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        onClick: () => {
          const { month = 0, year = 0 } = rowInfo?.row?._original;
          getTemplateAction({ month, year, workspace: true });
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  return (
    <>
      <div className="paddingBottom50 tabsContainer">
        <DataTable data={tableData} columns={columns} getTrProps={getTrProps} />
      </div>

      <InPageLoading isLoading={isLoading} />
    </>
  );
};

export default withRouter(Table);
