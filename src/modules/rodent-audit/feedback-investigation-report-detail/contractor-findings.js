/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { useDebounce } from 'use-debounce';

import DataTable from 'components/common/data-table';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';

import { tableColumnWidth } from 'constants/index';

const Audit = (props) => {
  const { data } = props;

  const [sortValue, setSortValue] = useState({
    id: 'location',
    label: 'Location',
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
      label: 'Location',
      value: 'location',
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
      Header: 'Location',
      accessor: 'location',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Findings',
      accessor: 'findings',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Bin Centre, CRC, Refuse Chute, NA',
      accessor: 'findingsType',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'No of Burrows',
      accessor: 'noOfBurrows',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'No of Defects',
      accessor: 'noOfDefects',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Habitat/Location of findings',
      accessor: 'habitat',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Remarks/Action Taken',
      accessor: 'remarks',
      minWidth: tableColumnWidth.md,
    },
  ];

  return (
    <>
      <div className="tabsContainer">
        <div className="row">
          <div className="col col-6">
            <div className="row">
              <div className="col col-6">
                <b>
                  <p>Regional Office</p>
                </b>
              </div>
              <div className="col col-6">
                <p>{data?.regionalOffice}</p>
              </div>
            </div>

            <div className="row">
              <div className="col col-6">
                <b>
                  <p>Recorded By</p>
                </b>
              </div>
              <div className="col col-6">
                <p>{data?.recordedBy}</p>
              </div>
            </div>
          </div>

          <div className="col col-6">
            <div className="row">
              <div className="col col-6">
                <b>
                  <p>Ref</p>
                </b>
              </div>
              <div className="col col-6">
                <p>{data?.ref}</p>
              </div>
            </div>

            <div className="row">
              <div className="col col-6">
                <b>
                  <p>Date</p>
                </b>
              </div>
              <div className="col col-6">
                <p>{data?.date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="navbar navbar-expand filterMainWrapper">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <SearchBox name="barcode" placeholder="Search for" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
          {/* <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} /> */}
          {/* <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} /> */}
          <Sort className="navbar-nav sortWrapper xs-paddingBottom15 ml-auto" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
        </div>
      </div>
      <div className="tabsContainer">
        <DataTable data={data?.findingsList || []} columns={columns} />
      </div>
    </>
  );
};

export default Audit;
