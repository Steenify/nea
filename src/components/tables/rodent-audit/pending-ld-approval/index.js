import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import DataTable from 'components/common/data-table';
import SearchBox from 'components/common/searchBox';
import Sort from 'components/common/sort';

import { WEB_ROUTES, tableColumnWidth } from 'constants/index';
import { filterFunc, sortFunc } from 'utils';

const RodentPendingLDApprovalTable = (props) => {
  const {
    history: { push },
    data,
    // getListingAction,
  } = props;

  // const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      Header: 'Month / Year',
      accessor: 'monthYear',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Contractor',
      accessor: 'contractor',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Total Liquidated Damage Amount',
      accessor: 'totalLDAmount',
      minWidth: tableColumnWidth.xxl,
    },
  ];

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        onClick: () => {
          push(WEB_ROUTES.RODENT_AUDIT.APPROVE_LD_AMOUNT.url, rowInfo.original);
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  const searchData = [
    {
      label: 'Month / Year',
      value: 'monthYear',
    },
    {
      label: 'Contractor',
      value: 'contractor',
    },
    {
      label: 'Total Liquidated Damage Amount',
      value: 'totalLDAmount',
    },
  ];

  const [sortValue, setSortValue] = useState({ id: 'contractor', label: 'Contractor', desc: false });
  const [searchType, setSearchTypeValue] = useState('contractor');
  const [searchText, setSearchTextValue] = useState('');

  const filteredData = data.filter((item) => filterFunc(item, { sortValue, searchText, searchType })).sort((a, b) => sortFunc(a, b, sortValue));

  return (
    <>
      <div className="navbar navbar-expand filterMainWrapper">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <SearchBox placeholder="Search by keyword" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
          <Sort className="navbar-nav sortWrapper xs-paddingBottom20 ml-auto" data={columns.filter((item) => !item.hiddenInSort)} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
        </div>
      </div>
      <div className="tabsContainer">
        <DataTable
          // data={expiredTasks}
          data={filteredData}
          columns={columns}
          getTrProps={getTrProps}
        />
      </div>
      {/* <InPageLoading isLoading={isLoading} /> */}
    </>
  );
};

const mapStateToProps = ({ global }) => ({
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RodentPendingLDApprovalTable));
