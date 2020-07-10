import React, { useState, useEffect, useRef, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import Filter, { FilterType } from 'components/common/filter';
import TabNav from 'components/ui/tabnav';
import CustomModal from 'components/common/modal';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';

import { WEB_ROUTES, tableColumnWidth } from 'constants/index';

import { getWorkSpaceListingService } from 'services/epi-investigation/case';

import { actionTryCatchCreator, getFilterArrayOfListForKey, filterFunc, sortFunc, EPI_COB1_FILTER_FUNC } from 'utils';

import ArcgisMap from 'components/common/arcgis-map';

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

const EPIWorkspaceTable = (props) => {
  const { history, showExtraFilter } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);

  const [sortValue, setSortValue] = useState({
    id: 'residentialAddress',
    label: 'Residential Address',
    desc: false,
  });
  const [searchText, setSearchTextValue] = useState('');
  const [searchType, setSearchType] = useState('clusterId');
  const [filterValue, setFilterValue] = useState(null);
  const [datePickerValue, setDatePickerValue] = useState(null);
  const filterRef = useRef(null);
  const [debounceSearchText] = useDebounce(searchText, 1000);
  const [tabItem, setTabItem] = useState({ index: '0', func: EPI_COB1_FILTER_FUNC.OUTSIDE_CLUSTER });
  const [tabCount, setTabCount] = useState([0, 0, 0, 0, 0, 0]);

  const [modalData, setModalData] = useState({ isOpen: false, clusterId: '', clusterLocality: '', postalCode: '' });

  const filterListingAction = useCallback(
    (list) => {
      const filterData = { sortValue, searchText: debounceSearchText, searchType, filterValue, tabItem, datePickerValue };
      const filteredList = list
        .filter((item) => (showExtraFilter ? filterData.tabItem.func(item) : true))
        .filter((item) => filterFunc(item, filterData))
        .sort((a, b) => sortFunc(a, b, filterData.sortValue));
      setFilteredTableData(filteredList);
    },
    [sortValue, filterValue, debounceSearchText, searchType, tabItem, datePickerValue, showExtraFilter],
  );

  const getListingAction = useCallback(() => {
    const onPending = () => {
      setIsLoading(true);
    };
    const onSuccess = (data) => {
      setIsLoading(false);
      const list = data?.caseManagementVOs || [];
      const tabCount = [
        EPI_COB1_FILTER_FUNC.OUTSIDE_CLUSTER,
        EPI_COB1_FILTER_FUNC.WITHOUT_ADDRESS,
        EPI_COB1_FILTER_FUNC.WITHOUT_CONTACT,
        EPI_COB1_FILTER_FUNC.WITHOUT_ADDRESS_AND_CONTACT,
        EPI_COB1_FILTER_FUNC.IN_CLUSTER,
        EPI_COB1_FILTER_FUNC.IMPORTED,
      ].map((item) => list.filter(item).length);
      setTableData(list);
      setTabCount(tabCount);
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(getWorkSpaceListingService(), onPending, onSuccess, onError);
  }, []);

  useEffect(() => {
    getListingAction();
  }, [getListingAction]);

  useEffect(() => {
    filterListingAction(tableData);
  }, [filterListingAction, tableData]);

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo) {
      const caseId = rowInfo?.row?.caseId || '';
      const clusterId = rowInfo?.row?.clusterId || '';
      const caseType = rowInfo?.row?.caseType || '';
      return {
        onClick: () => history.push(WEB_ROUTES.EPI_INVESTIGATION.CASE_DETAIL.url, { showMoh: showExtraFilter, caseType, caseId, clusterId }),
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  const columns = [
    {
      Header: 'Disease',
      accessor: 'caseType',
      headerClassName: 'header-right',
      minWidth: tableColumnWidth.md,
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
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: 'NEA Onset Date',
      accessor: 'neaOnsetDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Division',
      accessor: 'division',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Town Council',
      accessor: 'townCouncil',
      minWidth: tableColumnWidth.md,
    },
  ];

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'caseType',
      title: 'Disease',
      values: getFilterArrayOfListForKey(tableData, 'caseType'),
    },
    {
      type: FilterType.SEARCH,
      id: 'division',
      title: 'Division',
      values: getFilterArrayOfListForKey(tableData, 'division'),
    },
    {
      type: FilterType.SEARCH,
      id: 'townCouncil',
      title: 'Town Council',
      values: getFilterArrayOfListForKey(tableData, 'townCouncil'),
    },
  ];

  const tabNavMenu = [
    `Outside Cluster (${tabCount[0]})`,
    `Without Address (${tabCount[1]})`,
    `Without Contact No. (${tabCount[2]})`,
    `Without Address & Contact No. (${tabCount[3]})`,
    `In Cluster (${tabCount[4]})`,
    `Imported Cases (${tabCount[5]})`,
  ];

  const onChangeTab = (index) => {
    let func = null;
    switch (index) {
      case '0':
        func = EPI_COB1_FILTER_FUNC.OUTSIDE_CLUSTER;
        break;
      case '1':
        func = EPI_COB1_FILTER_FUNC.WITHOUT_ADDRESS;
        break;
      case '2':
        func = EPI_COB1_FILTER_FUNC.WITHOUT_CONTACT;
        break;
      case '3':
        func = EPI_COB1_FILTER_FUNC.WITHOUT_ADDRESS_AND_CONTACT;
        break;
      case '4':
        func = EPI_COB1_FILTER_FUNC.IN_CLUSTER;
        break;
      case '5':
        func = EPI_COB1_FILTER_FUNC.IMPORTED;
        break;
      default:
        break;
    }
    setTabItem({ index, func });
  };

  return (
    <>
      <div className="navbar navbar-expand filterMainWrapper">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <SearchBox placeholder="Enter keyword to search" value={searchText} onChangeText={setSearchTextValue} searchTypes={searchData} onChangeSearchType={setSearchType} />
          <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
          <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} />
          <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
        </div>
      </div>
      {showExtraFilter && (
        <nav className="tab__main">
          <div className="tabsContainer">
            <TabNav onToggleTab={onChangeTab} activeTab={tabItem.index} menu={tabNavMenu} />
          </div>
        </nav>
      )}
      <div className="paddingBottom50 tabsContainer">
        <DataTable data={filteredTableData} columns={columns} getTrProps={getTrProps} />
      </div>

      <InPageLoading isLoading={isLoading} />
      <CustomModal
        isOpen={modalData.isOpen}
        onCancel={() => setModalData({ isOpen: false })}
        size="lg"
        className="wf-800"
        content={
          <div className="p-4">
            <div className="text-left mb-2">Cluster ID: {modalData.clusterId}</div>
            <div className="text-left mb-2">Cluster Locality: {modalData.clusterLocality}</div>
            <ArcgisMap postalCode={modalData.postalCode} />
          </div>
        }
      />
    </>
  );
};

export default withRouter(EPIWorkspaceTable);
