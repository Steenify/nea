/* eslint-disable react/no-danger */
/* eslint-disable no-confusing-arrow */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';

import { ReactComponent as LevelUpIcon } from 'assets/svg/level-up.svg';

import { WEB_ROUTES, tableColumnWidth, FUNCTION_NAMES } from 'constants/index';
import { getOpsDataTableService } from 'services/ops-area';
import { actionTryCatchCreator } from 'utils';

const OpsDataTable = (props) => {
  const {
    history: { push },
    // data,
    opsId,
    functionNameList,
  } = props;

  const [drillLevel, setDrillLevel] = useState('');
  const [selectedPremiseType, setPremiseType] = useState();
  const [selectedRoadName, setRoadName] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [detail, setDetail] = useState();

  const getOpsDataTableAction = (params) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = (data) => {
      setIsLoading(false);
      setDetail(data);
    };
    const onError = () => setIsLoading(false);

    actionTryCatchCreator(getOpsDataTableService(params), onPending, onSuccess, onError);
  };

  const premisesColumns = [
    {
      Header: 'Premises Type',
      accessor: 'premisesType',
      minWidth: tableColumnWidth.lg,
      Cell: (cellInfo) => (
        <span
          className="text-blue cursor-pointer"
          onClick={() => {
            setDrillLevel('premisesType');
            setPremiseType(cellInfo.row.premisesType);
          }}>
          {cellInfo.row.premisesType}
        </span>
      ),
    },
    {
      Header: 'iFOS Task Reference Type',
      accessor: 'taskReferenceType',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Road Name',
      accessor: 'roadName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Number of Blocks',
      accessor: 'noOfBlocks',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Total Number of Units',
      accessor: 'totalUnits',
      minWidth: tableColumnWidth.lg,
    },

    {
      Header: 'Inspection Summary',
      accessor: 'inspectionSummary',
      minWidth: tableColumnWidth.xl,
      Cell: (cellInfo) => <div dangerouslySetInnerHTML={{ __html: cellInfo.original?.inspectionSummary }} />,
    },
    {
      Header: 'No. of Call Letters Served',
      accessor: 'noOfCallLettersServed',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Notices',
      accessor: 'notices',
      minWidth: tableColumnWidth.lg,
      Cell: (cellInfo) => <div dangerouslySetInnerHTML={{ __html: cellInfo.original?.notices }} />,
    },
    {
      Header: 'No. of SWOs',
      accessor: 'swo',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'No. of Cases',
      accessor: 'caseSize',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Breeding Summary',
      accessor: 'breedingSummary',
      minWidth: tableColumnWidth.xl,
      Cell: (cellInfo) => <div dangerouslySetInnerHTML={{ __html: cellInfo.original?.breedingSummary }} />,
    },
    {
      Header: 'No. of Gravitrap Triggers in the Latest Cycle',
      accessor: 'noofGravitrapcycle',
      minWidth: tableColumnWidth.xl,
    },
  ];

  const roadColumns = [
    {
      Header: 'Road Name',
      accessor: 'roadName',
      minWidth: tableColumnWidth.lg,
      Cell: (cellInfo) => (
        <span
          className="text-blue cursor-pointer"
          onClick={() => {
            setDrillLevel('roadName');
            setRoadName(cellInfo.row.roadName);
          }}>
          {cellInfo.row.roadName}
        </span>
      ),
    },
    {
      Header: 'No. of Blocks',
      accessor: 'noOfBlocks',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Total No. of Units',
      accessor: 'totalUnits',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Inspection Summary',
      accessor: 'inspectionSummary',
      minWidth: tableColumnWidth.xl,
      Cell: (cellInfo) => <div dangerouslySetInnerHTML={{ __html: cellInfo.original?.inspectionSummary }} />,
    },
    {
      Header: 'No. of Call Letters Served',
      accessor: 'noOfCallLettersServed',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Notices',
      accessor: 'notices',
      minWidth: tableColumnWidth.lg,
      Cell: (cellInfo) => <div dangerouslySetInnerHTML={{ __html: cellInfo.original?.notices }} />,
    },
    {
      Header: 'No. of SWOs',
      accessor: 'swo',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'No. of Cases',
      accessor: 'caseSize',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Breeding Summary',
      accessor: 'breedingSummary',
      minWidth: tableColumnWidth.xl,
      Cell: (cellInfo) => <div dangerouslySetInnerHTML={{ __html: cellInfo.original?.breedingSummary }} />,
    },
    {
      Header: 'No. of Gravitrap Triggers in the Latest Cycle',
      accessor: 'noofGravitrapcycle',
      minWidth: tableColumnWidth.xl,
    },
  ];

  const canViewBlockSummary = functionNameList.includes(FUNCTION_NAMES.getLatestBlockChart) || functionNameList.includes(FUNCTION_NAMES.getLatestLandedInspectionDetail);

  const blockColumns = [
    {
      Header: 'Block',
      accessor: 'block',
      minWidth: tableColumnWidth.md,
      Cell: (cellInfo) =>
        drillLevel === 'roadName' ? (
          <span
            className={canViewBlockSummary && (detail?.isBlock || detail?.isLanded) && detail?.dataSummaryBlockAccess ? 'text-blue cursor-pointer' : ''}
            onClick={() => {
              if (!canViewBlockSummary || !detail?.dataSummaryBlockAccess) return;
              const block = {
                blockHouseNo: cellInfo.original.block,
                postalCode: cellInfo.original.postalcode,
              };
              if (detail?.isBlock) {
                push(WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION_BLOCK_CHART.url, { block, fromLatest: true });
              }
              if (detail?.isLanded) {
                push(WEB_ROUTES.INSPECTION_MANAGEMENT.LATEST_INSPECTION_LANDED_DETAIL.url, { block });
              }
            }}>
            {cellInfo.row.block}
          </span>
        ) : (
          cellInfo.row.block || ''
        ),
    },
    {
      Header: 'Inspection Summary',
      accessor: 'inspectionSummary',
      minWidth: tableColumnWidth.xl,
      Cell: (cellInfo) => <div dangerouslySetInnerHTML={{ __html: cellInfo.original?.inspectionSummary }} />,
    },
    {
      Header: 'No. of Call Letters Served',
      accessor: 'noOfCallLettersServed',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Notices',
      accessor: 'notices',
      minWidth: tableColumnWidth.lg,
      Cell: (cellInfo) => <div dangerouslySetInnerHTML={{ __html: cellInfo.original?.notices }} />,
    },
    {
      Header: 'No. of SWOs',
      accessor: 'swo',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'No. of Cases',
      accessor: 'caseSize',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Breeding Summary',
      accessor: 'breedingSummary',
      minWidth: tableColumnWidth.xl,
      Cell: (cellInfo) => <div dangerouslySetInnerHTML={{ __html: cellInfo.original?.breedingSummary }} />,
    },
    {
      Header: 'No. of Gravitrap Triggers in the Latest Cycle',
      accessor: 'noofGravitrapcycle',
      minWidth: tableColumnWidth.xl,
    },
  ];

  const columns = drillLevel === 'premisesType' ? roadColumns : drillLevel === 'roadName' ? blockColumns : premisesColumns;

  useEffect(() => {
    if (drillLevel === 'premisesType') {
      getOpsDataTableAction({ opsId, premisesType: selectedPremiseType });
      return;
    }
    if (drillLevel === 'roadName') {
      getOpsDataTableAction({ opsId, road: selectedRoadName, premisesType: selectedPremiseType });
      return;
    }
    getOpsDataTableAction({ opsId });
  }, [drillLevel, opsId, selectedPremiseType, selectedRoadName]);

  return (
    <>
      {!drillLevel && <div className="font-weight-bold">Click on the Premises Type to drilldown</div>}
      {(drillLevel === 'premisesType' || drillLevel === 'roadName') && (
        <div className="font-weight-bold cursor-pointer p-1 pl-2 mb-0 bg-light-blue" onClick={() => setDrillLevel('')}>
          <LevelUpIcon width={36} height={36} />
          Premises Type: {selectedPremiseType}
        </div>
      )}
      {drillLevel === 'roadName' && (
        <div className="font-weight-bold cursor-pointer p-1 pl-4 mb-0 bg-light-blue" onClick={() => setDrillLevel('premisesType')}>
          <LevelUpIcon width={36} height={36} />
          Road Name: {selectedRoadName}
        </div>
      )}
      <DataTable data={detail?.operationsSummaryVO || []} columns={columns} showListHidden />
      <InPageLoading isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = ({ global }, ownProps) => ({
  ...ownProps,
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OpsDataTable));
