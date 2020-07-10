import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';

import { WEB_ROUTES, tableColumnWidth } from 'constants/index';

import { sofListingService } from 'services/inspection-management/sof';

import { actionTryCatchCreator } from 'utils';

const SOFPendingTable = ({ title = 'Pending SOF', showListHidden = false, pageSize = null, history: { push } }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const getSOFPendingListing = () => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setIsLoading(false);
      setTableData(data.inspections || []);
    };
    const onError = (error) => {
      setIsLoading(false);
      console.log('TCL: getSOFPendingListing -> error', error);
    };
    actionTryCatchCreator(sofListingService(), onPending, onSuccess, onError);
  };

  useEffect(() => {
    getSOFPendingListing();
  }, []);

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        onClick: () => {
          push(`${WEB_ROUTES.DETAILS.url}/sof`, { showAction: true, isEditing: true, id: rowInfo.row.inspectionId });
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  const columns = [
    {
      Header: 'Breeding Detection Date',
      accessor: 'breedingDetectionDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Breeding Detection Date',
      accessor: 'breedingDetectionTime',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'RO',
      accessor: 'regionOfficeCode',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Address',
      accessor: 'address',
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: 'Inspection ID',
      accessor: 'inspectionId',
      minWidth: tableColumnWidth.md,
      Cell: (cellInfo) => <span className="text-blue cursor-pointer">{cellInfo.row.inspectionId}</span>,
    },
  ];

  return (
    <>
      <DataTable data={tableData} columns={columns} title={title} showListHidden={showListHidden} pageSize={pageSize} getTrProps={getTrProps} showListPosition="end" />
      <InPageLoading isLoading={isLoading} />
    </>
  );
};

export default withRouter(SOFPendingTable);
