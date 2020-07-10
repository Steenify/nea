import React, { useState, useRef, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import DataTable from 'components/common/data-table';
import SearchBox from 'components/common/searchBox';
import Sort from 'components/common/sort';
import Filter, { FilterType } from 'components/common/filter';
// import InPageLoading from 'components/common/inPageLoading';

import { WEB_ROUTES, tableColumnWidth } from 'constants/index';

import { filterFunc, sortFunc } from 'utils';

const RodentPendingContractorExplanationTable = (props) => {
  const {
    history: { push },
    data,
    // getListingAction,
  } = props;

  // const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      Header: 'Task Type',
      accessor: 'taskTypeToBeDisplayed',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Task ID',
      accessor: 'taskId',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Location',
      accessor: 'location',
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: 'Postal Code',
      accessor: 'postalCode',
      minWidth: tableColumnWidth.md,
      sortType: 'number',
    },
    {
      Header: 'Type of Lapses',
      accessor: 'lapseType',
      minWidth: tableColumnWidth.xxl,
    },
  ];

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        onClick: () => {
          push(WEB_ROUTES.RODENT_AUDIT.PENDING_CONTRACTOR_EXPLANATION_DETAIL.url, { ...rowInfo.row._original, action: 'submit' });
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  const searchData = [
    {
      label: 'Task ID',
      value: 'taskId',
    },
    {
      label: 'Location',
      value: 'location',
    },
    {
      label: 'Postal Code',
      value: 'postalCode',
    },
  ];

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'taskTypeToBeDisplayed',
        title: 'Task Type',
      },
      {
        type: FilterType.SELECT,
        id: 'lapseType',
        title: 'Type of Lapses',
      },
    ],
    [],
  );

  const [sortValue, setSortValue] = useState({ id: 'taskId', label: 'Task ID', desc: false });
  const [searchType, setSearchTypeValue] = useState('taskId');
  const [searchText, setSearchTextValue] = useState('');
  const [filterValue, setFilterValue] = useState(null);
  const filterRef = useRef(null);

  const filteredData = data.filter((item) => filterFunc(item, { sortValue, searchText, searchType, filterValue })).sort((a, b) => sortFunc(a, b, sortValue));

  return (
    <>
      <div className="navbar navbar-expand filterMainWrapper">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <SearchBox placeholder="Search by keyword" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
          <Filter ref={filterRef} className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={data} />
          <Sort className="navbar-nav sortWrapper xs-paddingBottom20" data={columns.filter((item) => !item.hiddenInSort)} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
        </div>
      </div>
      <div className="tabsContainer">
        <DataTable data={filteredData} columns={columns} getTrProps={getTrProps} />
      </div>
      {/* <InPageLoading isLoading={isLoading} /> */}
    </>
  );
};

const mapStateToProps = ({ global }) => ({
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RodentPendingContractorExplanationTable));
