import React, { useEffect, useState, useRef, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import NewBreadCrumb from 'components/ui/breadcrumb';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import InPageLoading from 'components/common/inPageLoading';
import Checkbox from 'components/common/checkbox';

import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { filterListAction, getListAction, defaultFilterValue, submitListAction } from './action';

const dateSelectData = [
  {
    label: 'Expected Date',
    value: 'deadlineDateTime',
    useExactField: true,
  },
  {
    label: 'Submitted Date',
    value: 'updatedDate',
    useExactField: true,
  },
];

const QueryLateSubmission = (props) => {
  const {
    history,
    getListAction,
    filterListAction,
    submitListAction,

    functionNameList,
    ui: { isLoading },
    data: { filteredList, list },
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

  const [fileIds, setfileIds] = useState([]);
  const isSelectAll = fileIds.length > 0 && fileIds.length === filteredList.length;

  const onCheckSample = (fileId) => {
    const index = fileIds.findIndex((id) => id === fileId);
    if (index > -1) {
      fileIds.splice(index, 1);
    } else {
      fileIds.push(fileId);
    }
    setfileIds([...fileIds]);
  };

  const onCheckAllSample = () => {
    if (isSelectAll) {
      filteredList.forEach((file) => {
        const index = fileIds.findIndex((id) => id === file.fileId);
        if (index > -1) fileIds.splice(index, 1);
      });
      setfileIds([...fileIds]);
    } else {
      filteredList.forEach((file) => {
        const index = fileIds.findIndex((id) => id === file.fileId);
        if (index < 0) fileIds.push(file.fileId);
      });
      setfileIds([...fileIds]);
    }
  };

  const columns = [
    // {
    //   fixed: 'left',
    //   minWidth: tableColumnWidth.xs,
    //   Cell: (cellInfo) => {
    //     const { fileId } = cellInfo.row._original;
    //     return (
    //       <div onClick={(e) => e.stopPropagation()}>
    //         <Checkbox checked={fileIds.includes(fileId)} onChange={() => onCheckSample(fileId)} />
    //       </div>
    //     );
    //   },
    //   Header: () => (
    //     <div style={{ textAlign: 'center' }}>
    //       <div className="custom-control custom-checkbox">
    //         <input type="checkbox" className="custom-control-input" id="custom_search_check_all" checked={isSelectAll} onChange={() => onCheckAllSample()} />
    //         <label className="custom-control-label" htmlFor="custom_search_check_all" />
    //       </div>
    //     </div>
    //   ),
    // },
    {
      Header: 'RO',
      accessor: 'ro',
      minWidth: tableColumnWidth.md,
    },
    // {
    //   Header: 'GRC',
    //   accessor: 'grc',
    //   minWidth: tableColumnWidth.lg,
    // },
    // {
    //   Header: 'Division',
    //   accessor: 'division',
    //   minWidth: tableColumnWidth.md,
    // },
    {
      Header: 'Report Type',
      accessor: 'fileType',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'File Name',
      accessor: 'fileName',
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: 'Expected Date',
      accessor: 'deadlineDateTime',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Submitted Date',
      accessor: 'updatedDate',
      minWidth: tableColumnWidth.md,
    },
  ];

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'ro',
        title: 'RO',
      },
      {
        type: FilterType.SELECT,
        id: 'fileType',
        title: 'Report Type',
      },
    ],
    [],
  );

  if (functionNameList.some((fun) => fun === 'submitLateSubmissionsForShowcause')) {
    columns.unshift({
      fixed: 'left',
      minWidth: tableColumnWidth.xs,
      Cell: (cellInfo) => {
        const { fileId } = cellInfo.row._original;
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox checked={fileIds.includes(fileId)} onChange={() => onCheckSample(fileId)} />
          </div>
        );
      },
      Header: () => (
        <div style={{ textAlign: 'center' }}>
          <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input" id="custom_search_check_all" checked={isSelectAll} onChange={() => onCheckAllSample()} />
            <label className="custom-control-label" htmlFor="custom_search_check_all" />
          </div>
        </div>
      ),
    });
  }

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.RODENT_AUDIT.QUERY_LATE_SUBMISSION.name}`;
    getListAction().then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
  }, [getListAction]);

  useEffect(() => {
    filterListAction({
      sortValue,
      searchType,
      searchText,
      filterValue,
      datePickerValue,
    });
  }, [searchText, searchType, sortValue, filterValue, datePickerValue, filterListAction]);

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.RODENT_AUDIT.QUERY_LATE_SUBMISSION.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.RODENT_AUDIT, WEB_ROUTES.RODENT_AUDIT.QUERY_LATE_SUBMISSION]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.RODENT_AUDIT.QUERY_LATE_SUBMISSION.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Search by report file name" onChangeText={setSearchTextValue} searchTypes={[]} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={list} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="tabsContainer">
            <DataTable data={filteredList} columns={columns} />
            {functionNameList.some((fun) => fun === 'submitLateSubmissionsForShowcause') && (
              <div className="text-center mt-3 mb-3">
                <button
                  type="button"
                  className={`btn btn-pri m-2 ${fileIds.length === 0 ? 'cursor-default' : 'cursor-pointer'}`}
                  disabled={fileIds.length === 0}
                  onClick={() =>
                    submitListAction({ lateSubmissionShowCauseList: fileIds }, () => {
                      toast.success('Show cause submitted');
                      setfileIds([]);
                      // getListAction();

                      history.push('/my-workspace', { module: { label: 'Rodent Audit', value: 'Rodent Audit' }, tab: '2' });
                    })
                  }>
                  Submit the Selected Submissions for Show Cause
                </button>
              </div>
            )}
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global, rodentAuditReducers: { queryLateSubmission } }, ownProps) => ({
  ...ownProps,
  ...queryLateSubmission,
  functionNameList: global.data.functionNameList,
});

const mapDispatchToProps = {
  getListAction,
  filterListAction,
  submitListAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QueryLateSubmission));
