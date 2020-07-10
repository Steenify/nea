/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';

import { WEB_ROUTES, tableColumnWidth, FUNCTION_NAMES } from 'constants/index';

import { getFilterArrayOfListForKey } from 'utils';

const FilterTab = (props) => {
  const { history, data, reportType, specialColumns } = props;

  const [sortValue, setSortValue] = useState({
    id: 'address',
    label: 'Address',
    desc: false,
  });
  const [searchType, setSearchTypeValue] = useState('taskId');
  const [searchText, setSearchTextValue] = useState('');
  const [datePickerValue, setDatePickerValue] = useState();
  const [filterValue, setFilterValue] = useState();
  const filterRef = useRef(null);

  const [debounceSearchText] = useDebounce(searchText, 1000);

  const searchData = [
    {
      label: 'Address',
      value: 'address',
    },
  ];

  const dateSelectData = [
    {
      label: 'Date of Finding',
      value: 'findingDate',
      useExactField: true,
    },
  ];

  const columns = [
    {
      Header: 'Address',
      accessor: 'address',
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: 'Postal Code',
      accessor: 'postalCode',
      minWidth: tableColumnWidth.md,
      sortType: 'number',
    },
    {
      Header: reportType === 'NTC' ? 'GRC/SMC' : reportType === 'Vacant' ? 'Town Council/GRC/SMC' : 'Town Council',
      accessor: 'townCouncil',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Date of Finding',
      accessor: 'findingDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Number of Active Burrows',
      accessor: 'noOfActiveBurrows',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Number of Defects',
      accessor: 'noOfDefects',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Habitat',
      accessor: 'habitat',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Probable Cause',
      accessor: 'probableCause',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Action Taken',
      accessor: 'actionTaken',
      minWidth: tableColumnWidth.lg,
    },
  ];

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        onClick: () => {
          history.push(WEB_ROUTES.RODENT_AUDIT.QUERY_AUDIT_TASK_DETAIL.url, {
            rodentQueryAuditDetail: rowInfo.row._original,
          });
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  // useEffect(() => {}, [debounceSearchText, searchType, sortValue, filterValue, datePickerValue]);

  return (
    <>
      <div className="navbar navbar-expand filterMainWrapper">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <SearchBox name="barcode" placeholder="Search for" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
          <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
          <Sort className="navbar-nav sortWrapper xs-paddingBottom15" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
        </div>
      </div>
      <div className="tabsContainer">
        <DataTable data={data || []} columns={specialColumns || columns} getTrProps={getTrProps} />
      </div>
    </>
  );
};

export default withRouter(FilterTab);
