import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import InPageLoading from 'components/common/inPageLoading';
import NewBreadCrumb from 'components/ui/breadcrumb';
import { connect } from 'react-redux';
import DataTable from 'components/common/data-table';
import { tableColumnWidth, WEB_ROUTES, FUNCTION_NAMES } from 'constants/index';
import { debounce } from 'lodash';
import { getGroundSurveillanceListingAction, groundSurveillanceListingFilterAction, defaultFilterValue } from './action';

class GroundSurveillanceListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...defaultFilterValue,
    };

    this.filterCluster = debounce(this.filterCluster, 500);
  }

  componentDidMount() {
    document.title = `NEA | ${WEB_ROUTES.RODENT_AUDIT.MONITORING_OF_INSPECTION_RESULTS.name}`;
    const { getGroundSurveillanceListingAction } = this.props;
    getGroundSurveillanceListingAction();
  }

  filterCluster = () => {
    const { groundSurveillanceListingFilterAction } = this.props;
    const { sortValue, searchType, searchText } = this.state;
    groundSurveillanceListingFilterAction({
      sortValue,
      searchType,
      searchText,
    });
  };

  onChangeSearchText = (text) => {
    this.setState(
      {
        searchText: text,
      },
      () => {
        this.filterCluster();
      },
    );
  };

  onChangeSort = (sortValue) => {
    this.setState(
      {
        sortValue,
      },
      () => {
        this.filterCluster();
      },
    );
  };

  navigateToDetail = (rccId) => {
    const { history } = this.props;
    history.push(`/inspection-management/ground-surveillance-for-rcc/detail?rccId=${rccId}`);
  };

  getTrProps = (_state, rowInfo) => {
    const { functionNameList } = this.props;

    if (rowInfo && rowInfo.row && functionNameList.includes(FUNCTION_NAMES.getSurveillanceForRedClusterDetail)) {
      return {
        onClick: () => {
          this.navigateToDetail(rowInfo.row.rccId);
        },
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  getTdProps = (_state, rowInfo, column) => {
    if (rowInfo && rowInfo.row && column.needCheck) {
      const info = rowInfo?.row?._original || {};
      const isHighlight = info[column.needCheck] || false;
      if (isHighlight) {
        return {
          className: 'background-pink-highlight',
        };
      }
    }
    return {};
  };

  render() {
    const { sortValue, searchText } = this.state;
    const {
      ui: { isLoading },
      data: { filteredClusters, lastThirdMonth, lastSecondMonth, lastMonth },
    } = this.props;

    const sortData = [
      {
        Header: 'RCC ID',
        accessor: 'rccId',
      },
      {
        Header: 'Verification by RCU',
        accessor: 'dateOfInspection',
      },
    ];

    const columns = [
      {
        Header: 'RCC ID',
        accessor: 'rccId',
        minWidth: tableColumnWidth.md,
      },
      {
        Header: 'Verification by RCU',
        minWidth: tableColumnWidth.xl,
        Cell: (cellInfo) => {
          const { dateOfInspection, noOfBurrows } = cellInfo.row._original;
          return (
            <div>
              <p>{dateOfInspection}</p>
              <p className="mb-0">No. of Burrows:</p>
              <p>Actual - {noOfBurrows}</p>
            </div>
          );
        },
      },
      {
        Header: lastThirdMonth,
        minWidth: tableColumnWidth.xl,
        Cell: (cellInfo) => {
          const {
            firstMonthDate,
            firstMonthTargetNo,
            firstMonthActualNo,
            targetFirstFlag,
            // multipleRecordFirstFlag,
            firstExistFlag,
          } = cellInfo.row._original;
          if (!firstExistFlag) return <></>;
          return (
            <div>
              <p>{firstMonthDate}</p>
              <p className="mb-0">No. of Burrows:</p>
              <p className="mb-0">Target - {firstMonthTargetNo}</p>
              <strong>
                Actual - <span className={targetFirstFlag ? 'text-green' : 'text-red'}>{firstMonthActualNo}</span>
              </strong>
            </div>
          );
        },
        needCheck: 'firstNoInspectionFlag',
      },
      {
        Header: lastSecondMonth,
        minWidth: tableColumnWidth.xl,
        Cell: (cellInfo) => {
          const {
            secondMonthDate,
            secondMonthTargetNo,
            secondMonthActualNo,
            targetSecondFlag,
            // multipleRecordSecondFlag,
            secondExistFlag,
          } = cellInfo.row._original;
          if (!secondExistFlag) return <></>;
          return (
            <div>
              <p>{secondMonthDate}</p>
              <p className="mb-0">No. of Burrows:</p>
              <p className="mb-0">Target - {secondMonthTargetNo}</p>
              <strong>
                Actual - <span className={targetSecondFlag ? 'text-green' : 'text-red'}>{secondMonthActualNo}</span>
              </strong>
            </div>
          );
        },
        needCheck: 'secondNoInspectionFlag',
      },
      {
        Header: lastMonth,
        minWidth: tableColumnWidth.xl,
        Cell: (cellInfo) => {
          const {
            thirdMonthDate,
            thirdMonthTargetNo,
            thirdMonthActualNo,
            targetThirdFlag,
            // multipleRecordThirdFlag,
            thirdExistFlag,
          } = cellInfo.row._original;
          if (!thirdExistFlag) return <></>;
          return (
            <div>
              <p>{thirdMonthDate}</p>
              <p className="mb-0">No. of Burrows:</p>
              <p className="mb-0">Target - {thirdMonthTargetNo}</p>
              <strong>
                Actual - <span className={targetThirdFlag ? 'text-green' : 'text-red'}>{thirdMonthActualNo}</span>
              </strong>
            </div>
          );
        },
        needCheck: 'thirdNoInspectionFlag',
      },
    ];
    return (
      <>
        <Header />
        <div className="main-content workspace__main">
          <NavBar active={WEB_ROUTES.RODENT_AUDIT.MONITORING_OF_INSPECTION_RESULTS.name} />
          <div className="contentWrapper">
            <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.RODENT_AUDIT.MONITORING_OF_INSPECTION_RESULTS]} />
            <div className="main-title">
              <h1>{WEB_ROUTES.RODENT_AUDIT.MONITORING_OF_INSPECTION_RESULTS.name}</h1>
            </div>
            <div className="navbar navbar-expand filterMainWrapper">
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <SearchBox name="barcode" placeholder="Search by RCC ID" searchTypes={[{ label: 'RCC ID', value: 'rccId' }]} onChangeText={this.onChangeSearchText} value={searchText} />
                <Sort className="navbar-nav sortWrapper ml-auto" data={sortData} value={sortValue} desc={sortValue.desc} onChange={this.onChangeSort} />
              </div>
            </div>
            <div className="paddingBottom50 tabsContainer">
              <div>
                <DataTable data={filteredClusters} columns={columns} getTrProps={this.getTrProps} getTdProps={this.getTdProps} />
              </div>
            </div>
            <InPageLoading isLoading={isLoading} />
            <Footer />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ global, vectorInspectionReducers: { groundSurveillanceListing } }, ownProps) => ({
  ...ownProps,
  ...groundSurveillanceListing,
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {
  getGroundSurveillanceListingAction,
  groundSurveillanceListingFilterAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GroundSurveillanceListing));
