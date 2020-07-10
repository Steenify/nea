/* eslint-disable import/no-webpack-loader-syntax */
import React, { Component } from 'react';
// import _ from 'lodash';

import withFixedColumns from 'react-table-hoc-fixed-columns';
import ReactTable from 'react-table';

import Paging from 'components/common/pagination';
import ShowList from 'components/common/showlist';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      pageSize: props.pageSize || 5,
      data: props.data || [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    // const check = !_.isEqual(props.data, state.data);
    const check = props.data !== state.data;
    if (check) {
      return {
        page: 0,
        data: props.data || [],
      };
    }
    return null;
  }

  onChangePageSize = (size) => {
    this.setState({
      pageSize: size.value,
      page: 0,
    });
  };

  onChangePage = (number) => {
    this.setState({
      page: number,
    });
  };

  render() {
    const { page, pageSize, data } = this.state;
    const { columns, getTrProps, getTdProps, showListHidden, title, rightTitle, tableClassName, showListPosition, containerClassName, rightHeaderContent, defaultPageSize } = this.props;
    const finalPageSize = Math.max(Math.min(pageSize, data.length), defaultPageSize || 3);
    const finalData = data.slice(page * finalPageSize, (page + 1) * finalPageSize);

    return (
      <div className={containerClassName}>
        {(!showListHidden || title) && (
          <ShowList
            pageSize={pageSize}
            totalItems={data.length}
            onChangePageSize={this.onChangePageSize}
            showListHidden={showListHidden}
            title={title}
            rightTitle={rightTitle}
            showListPosition={showListPosition}
            rightHeaderContent={rightHeaderContent}
          />
        )}
        <ReactTableFixedColumns
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
        <Paging number={page} totalPages={data.length / pageSize} onClickPager={this.onChangePage} />
      </div>
    );
  }
}

export default DataTable;
