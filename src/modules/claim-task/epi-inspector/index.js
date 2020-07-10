import React, { useState, useEffect, useRef, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import Filter, { FilterType } from 'components/common/filter';
import InPageLoading from 'components/common/inPageLoading';
import CustomModal from 'components/common/modal';
import FloatingNumber from 'components/common/floating-number';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import ArcgisMap from 'components/common/arcgis-map';

import Checkbox from 'components/common/checkbox';
import { claimTaskFilterAction, claimTaskSearchAction, defaultFilterValue, caseClaimAction } from './action';

const searchData = [
  {
    label: 'Cluster ID',
    value: 'clusterId',
  },
  {
    label: 'Case ID',
    value: 'caseId',
  },
  {
    label: 'Cluster locality',
    value: 'clusterLocality',
  },
  {
    label: 'Residential address',
    value: 'residentialAddress',
  },
];

const dateSelectData = [
  {
    label: 'NEA Onset Date',
    value: 'neaOnsetDate',
    useExactField: true,
  },
];

const ClaimTask = (props) => {
  const {
    claimTaskSearchAction,
    claimTaskFilterAction,
    caseClaimAction,
    history,
    ui: { isLoading },
    data: { filteredList, list },
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const filterRef = useRef(null);

  const [caseIds, setCaseIds] = useState([]);
  const isSelectAll = caseIds.length > 0 && caseIds.length === filteredList.length;

  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [modalData, setModalData] = useState({ isOpen: false, clusterId: '', clusterLocality: '', postalCode: '' });

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.CLAIM_TASK.name}`;
    claimTaskSearchAction().then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
  }, [claimTaskSearchAction]);

  useEffect(() => {
    claimTaskFilterAction({
      sortValue,
      searchType,
      searchText,
      filterValue,
      datePickerValue,
    });
  }, [searchText, searchType, sortValue, filterValue, datePickerValue, claimTaskFilterAction]);

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo) {
      return {
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  const claimTasks = () => {
    const selectedTasks = list.filter(({ caseId = '' }) => caseIds.includes(caseId)).map(({ caseId, caseType }) => ({ caseId, caseType }));
    caseClaimAction(selectedTasks, () => {
      setIsShowConfirmModal(true);
      setCaseIds([]);
      claimTaskSearchAction();
    });
    setCaseIds([]);
  };

  const onCheckSample = (caseId) => {
    const index = caseIds.findIndex((id) => id === caseId);
    if (index > -1) {
      caseIds.splice(index, 1);
    } else {
      caseIds.push(caseId);
    }
    setCaseIds([...caseIds]);
  };

  const onCheckAllSample = () => {
    if (isSelectAll) {
      filteredList.forEach((cluster) => {
        const index = caseIds.findIndex((id) => id === cluster.caseId);
        if (index > -1) caseIds.splice(index, 1);
      });
      setCaseIds([...caseIds]);
    } else {
      filteredList.forEach((cluster) => {
        const index = caseIds.findIndex((id) => id === cluster.caseId);
        if (index < 0) caseIds.push(cluster.caseId);
      });
      setCaseIds([...caseIds]);
    }
  };

  const columns = [
    {
      fixed: 'left',
      minWidth: tableColumnWidth.xs,
      Cell: (cellInfo) => <Checkbox checked={caseIds.includes(cellInfo.row.caseId)} onChange={() => onCheckSample(cellInfo.row.caseId)} />,
      Header: () => <Checkbox checked={isSelectAll} onChange={() => onCheckAllSample()} />,
    },
    {
      Header: 'Disease',
      accessor: 'caseType',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Cluster ID',
      accessor: 'clusterId',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Case ID',
      accessor: 'caseId',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Cluster Locality',
      accessor: 'clusterLocality',
      minWidth: tableColumnWidth.lg,
      Cell: (cellInfo) => (
        <span
          className="text-blue cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setModalData({ isOpen: true, clusterId: cellInfo?.row?.clusterId, clusterLocality: cellInfo?.row?.clusterLocality, postalCode: cellInfo?.original?.postalCode });
          }}>
          {cellInfo.row.clusterLocality}
        </span>
      ),
    },
    {
      Header: 'Residential Address',
      accessor: 'residentialAddress',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'NEA Onset Date',
      accessor: 'neaOnsetDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Division',
      accessor: 'division',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Town Council',
      accessor: 'townCouncil',
      minWidth: tableColumnWidth.lg,
    },
  ];

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'caseType',
        title: 'Disease',
      },
      {
        type: FilterType.SEARCH,
        id: 'division',
        title: 'Division',
      },
      {
        type: FilterType.SEARCH,
        id: 'townCouncil',
        title: 'Town Council',
      },
    ],
    [],
  );

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.CLAIM_TASK.name} />
        <div className="contentWrapper">
          <div className="main-title">
            <h1>{WEB_ROUTES.CLAIM_TASK.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Enter keywords" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={list} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="paddingBottom50 tabsContainer">
            {caseIds.length > 0 && (
              <div className="d-flex mt-3 mb-3">
                <div className="receive__numbers">
                  <FloatingNumber title="Tasks Selected:" number={caseIds.length} />
                </div>
                <div className="d-flex align-items-center ml-auto">
                  <button type="button" className="btn btn-pri" onClick={claimTasks}>
                    Claim Tasks
                  </button>
                </div>
              </div>
            )}
            <div>
              <DataTable data={filteredList} columns={columns} getTrProps={getTrProps} />
            </div>
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
          <CustomModal
            isOpen={modalData.isOpen}
            onCancel={() => setModalData({ isOpen: false })}
            size="lg"
            className="wf-800"
            content={
              <div className="p-4">
                <div className="text-left mb-2">Cluster ID: {modalData.clusterId}</div>
                <div className="text-left mb-2">Cluster Locality: {modalData.clusterLocality}</div>
                <ArcgisMap postalCode={modalData.postalCode} selectedLayer={1} />
              </div>
            }
          />
          <CustomModal
            isOpen={isShowConfirmModal}
            headerTitle="Tasks Claimed. Go to My Workspace?"
            onCancel={() => {
              setIsShowConfirmModal(false);
            }}
            type="system-modal"
            cancelTitle="No"
            confirmTitle="Yes"
            onConfirm={() => history.push(WEB_ROUTES.MY_WORKSPACE.url)}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ claimTaskReducers: { epiInspector } }, ownProps) => ({
  ...ownProps,
  ...epiInspector,
});

const mapDispatchToProps = {
  claimTaskSearchAction,
  claimTaskFilterAction,
  caseClaimAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ClaimTask));
