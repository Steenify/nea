import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import prettySize from 'prettysize';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import InPageLoading from 'components/common/inPageLoading';
import Checkbox from 'components/common/checkbox';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { filterListAction, getListAction, downloadListAction, defaultFilterValue, getSysConfigAction } from './action';

const SystemAuditLog = (props) => {
  const {
    getListAction,
    filterListAction,
    downloadListAction,
    getSysConfigAction,
    // history,
    ui: { isLoading },
    data: { filteredList, list, sysConfig = {} },
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);

  const [selectedLogFiles, setLogFiles] = useState([]);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.AUDIT_TRAILS_REPORT.SYSTEM_AUDIT_LOG.name}`;
    getListAction();
    getSysConfigAction({ submissionType: 'ADMIN_SYSTEMAUDITLOG' });
  }, [getListAction, getSysConfigAction]);

  useEffect(() => {
    filterListAction({
      sortValue,
      searchType,
      searchText,
      filterValue,
      datePickerValue,
    });
  }, [searchText, searchType, sortValue, datePickerValue, filterValue, filterListAction]);

  const onCheckRow = (logFile) => {
    const index = selectedLogFiles.findIndex((item) => item.logFileName === logFile.logFileName);
    if (index >= 0) {
      selectedLogFiles.splice(index, 1);
    } else {
      selectedLogFiles.push(logFile);
    }
    setLogFiles(selectedLogFiles);
  };

  const onDownload = () => {
    const totalSize = selectedLogFiles.reduce((total, current) => total + Number(current.sizeInKB), 0) * 1024;
    if (sysConfig && totalSize > sysConfig.maxGroupFileSize) {
      toast.error(`Exceeded the maximum size. Maximum file size allowed: ${prettySize(sysConfig.maxGroupFileSize)}.`);
    } else {
      downloadListAction({ logFilesName: selectedLogFiles.map((item) => item.logFileName) });
    }
  };

  const searchData = [
    {
      label: 'Log File Name',
      value: 'logFileName',
    },
    {
      label: 'Log File Type',
      value: 'logFileType',
    },
  ];

  const dateSelectData = [
    {
      label: 'Modified On',
      value: 'modifiedOn',
      useExactField: true,
    },
  ];

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'logFileType',
        title: 'Log File Type',
        values: ['microservices logs', 'common event logs'],
      },
    ],
    [],
  );

  const columns = [
    {
      minWidth: tableColumnWidth.xs,
      Cell: (cellInfo) => <Checkbox checked={selectedLogFiles.find((item) => cellInfo?.row?.logFileName === item.logFileName)} onChange={() => onCheckRow(cellInfo.original)} />,
    },
    {
      Header: 'Log File Name',
      accessor: 'logFileName',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Modified On',
      accessor: 'modifiedOn',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Size',
      accessor: 'size',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Log File Type',
      accessor: 'logFileType',
      minWidth: tableColumnWidth.md,
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.AUDIT_TRAILS_REPORT.SYSTEM_AUDIT_LOG.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.AUDIT_TRAILS_REPORT, WEB_ROUTES.AUDIT_TRAILS_REPORT.SYSTEM_AUDIT_LOG]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.AUDIT_TRAILS_REPORT.SYSTEM_AUDIT_LOG.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Enter keywords" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} timePicker />
              <Filter className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={list} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="paddingBottom50 tabsContainer">
            <div>
              <DataTable
                data={filteredList}
                columns={columns}
                rightHeaderContent={
                  <div className="d-flex align-items-center">
                    <button type="button" className="btn btn-sec m-1" onClick={onDownload}>
                      Download
                    </button>
                  </div>
                }
              />
            </div>
          </div>

          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ adminReducers: { systemAuditLog } }, ownProps) => ({
  ...ownProps,
  ...systemAuditLog,
});

const mapDispatchToProps = {
  getListAction,
  filterListAction,
  downloadListAction,
  getSysConfigAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SystemAuditLog));
