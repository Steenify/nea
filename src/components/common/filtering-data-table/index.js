import React, { useState, useEffect, useCallback } from 'react';

import withFixedColumns from 'react-table-hoc-fixed-columns';
import ReactTable from 'react-table';
import _ from 'lodash';

import Paging from 'components/common/pagination';
import ShowList from 'components/common/showlist';

import 'components/common/inPageLoading/style.scss';

import Worker from 'utils/filter.worker';
import { dateTimeStringFromDate } from 'utils';

const worker = new Worker();
let prevFilterData = {};
let prevData = [];
const ReactTableFixedColumns = withFixedColumns(ReactTable);

const FilteringDataTable = (props) => {
  const {
    data,
    pageSize,
    columns,
    getTrProps,
    getTdProps,
    showListHidden,
    title,
    rightTitle,
    tableClassName,
    showListPosition,
    containerClassName,
    rightHeaderContent,
    defaultPageSize,
    filterData,
  } = props;

  const [state, setState] = useState({ page: 0, pageSize: pageSize || 5, isFiltering: false, filteredList: data || [] });

  const onChangePageSize = useCallback((size) => {
    setState((prev) => ({ ...prev, page: 0, pageSize: size.value }));
  }, []);

  const onChangePage = (page) => {
    setState((prev) => ({ ...prev, page }));
  };

  useEffect(() => {
    if (!_.isEqual(filterData, prevFilterData) || !_.isEqual(prevData, data)) {
      setState((prev) => ({ ...prev, isFiltering: true }));
      if (filterData.datePickerValue) {
        const { startDate, endDate } = filterData.datePickerValue;
        if (startDate) {
          filterData.datePickerValue.startDate = dateTimeStringFromDate(startDate);
        }
        if (endDate) {
          filterData.datePickerValue.endDate = dateTimeStringFromDate(endDate);
        }
      }
      console.log('FilteringDataTable -> filterData', filterData);
      worker.postMessage({ list: data, filterData });
    }
    prevFilterData = filterData;
    prevData = data;
  }, [data, filterData]);

  useEffect(() => {
    const setList = (e) => {
      setState((prev) => ({ ...prev, isFiltering: false, filteredList: e.data, page: 0 }));
    };
    worker.addEventListener('message', setList);

    // return worker.removeEventListener('message', setList);
  }, []);

  const finalPageSize = Math.max(Math.min(state.pageSize, data.length), defaultPageSize || 3);
  const finalData = state.filteredList.slice(state.page * finalPageSize, (state.page + 1) * finalPageSize);

  return (
    <>
      <div className={containerClassName} style={{ position: 'relative' }}>
        {(!showListHidden || title) && (
          <ShowList
            pageSize={state.pageSize}
            totalItems={state.filteredList.length}
            onChangePageSize={onChangePageSize}
            showListHidden={showListHidden}
            title={title}
            rightTitle={rightTitle}
            showListPosition={showListPosition}
            rightHeaderContent={rightHeaderContent}
            disabled={state.isFiltering}
          />
        )}
        <ReactTableFixedColumns
          loading={state.isFiltering}
          loadingText="Filtering & Sorting ..."
          className={`react__table ${tableClassName}`}
          columns={columns}
          data={finalData}
          // data={data}
          // page={page}
          pageSize={finalPageSize}
          showPagination={false}
          sortable={false}
          getTrProps={getTrProps}
          resizable={false}
          getTdProps={getTdProps}
        />
        <Paging number={state.page} totalPages={state.filteredList.length / state.pageSize} onClickPager={onChangePage} disabled={state.isFiltering} />
      </div>
    </>
  );
};

export default FilteringDataTable;
