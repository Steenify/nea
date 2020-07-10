import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Filter, { FilterType } from 'components/common/filter';
import CustomModal from 'components/common/modal';
import Checkbox from 'components/common/checkbox';
import { connect } from 'react-redux';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { getFilterArrayOfListForKey } from 'utils';

import { form3CommonPoolAction, sampleMyWorkspaceFilter, defaultFilterValue, form3ClaimAction } from './action';

const searchData = [
  { label: 'Address', value: 'address' },
  { label: 'Form 3 ID', value: 'form3Id' },
];

const ClaimTask = (props) => {
  const {
    history,
    ui: { isLoading },
    data: { filteredTaskList, taskList },

    history: { push },
    form3CommonPoolAction,
    sampleMyWorkspaceFilterAction,
    form3ClaimAction,
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const filterRef = useRef(null);
  const [debounceSearchText] = useDebounce(searchText, 1000);

  const [selectedTask, setSelectedTasks] = useState([]);

  const onCheckTaskId = (form3Id) => {
    const tasks = new Set(selectedTask);
    if (tasks.has(form3Id)) {
      tasks.delete(form3Id);
    } else {
      tasks.add(form3Id);
    }
    setSelectedTasks(Array.from(tasks));
  };
  const onCheckAllTask = () => {
    const result = filteredTaskList.length === selectedTask.length ? [] : filteredTaskList.map((item) => item?.form3Id || '');
    setSelectedTasks(result);
  };

  const onClaimTasks = () => {
    form3ClaimAction(selectedTask).then(() => {
      setIsShowConfirmModal(true);
    });
  };

  const columns = [
    {
      minWidth: tableColumnWidth.xs,
      Cell: (cellInfo) => <Checkbox checked={selectedTask.includes(cellInfo?.row?.form3Id || '')} onChange={() => onCheckTaskId(cellInfo.row?.form3Id || '')} />,
      Header: () => <Checkbox checked={filteredTaskList.length === selectedTask.length && filteredTaskList.length !== 0} onChange={() => onCheckAllTask()} />,
    },
    {
      Header: 'Breeding Detection Date',
      accessor: 'breedingDate',
      headerClassName: 'header-right',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'RO',
      accessor: 'regionOfficeCode',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Address',
      accessor: 'address',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Form 3 ID',
      accessor: 'form3Id',
      minWidth: tableColumnWidth.lg,
      Cell: (cellInfo) => (
        <span className="text-blue cursor-pointer" onClick={() => push(WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_DETAIL.url, { form3Id: cellInfo.row.form3Id })}>
          {cellInfo.row.form3Id}
        </span>
      ),
    },
  ];

  const dateSelectData = [
    {
      label: 'Breeding Date',
      value: 'breedingDate',
      useExactField: true,
    },
  ];

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'regionOfficeCode',
      title: 'RO',
      values: getFilterArrayOfListForKey(taskList, 'regionOfficeCode'),
    },
  ];

  useEffect(() => {
    document.title = 'NEA | Claim Tasks';
    form3CommonPoolAction().then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
  }, [form3CommonPoolAction]);

  useEffect(() => {
    sampleMyWorkspaceFilterAction({
      sortValue,
      searchText: debounceSearchText,
      filterValue,
      datePickerValue,
      searchType,
    });
  }, [sampleMyWorkspaceFilterAction, sortValue, debounceSearchText, datePickerValue, filterValue, searchType]);

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active="Claim Tasks" />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.CLAIM_TASK]} />
          <div className="main-title">
            <h1>Claim Tasks</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Enter keyword to search" value={searchText} onChangeText={setSearchTextValue} searchTypes={searchData} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="paddingBottom50 tabsContainer">
            <div>
              <DataTable data={filteredTaskList} columns={columns} />
              {filteredTaskList.length > 0 && (
                <div className="workspace__claim_button_container text-center">
                  <button className="btn btn-pri" onClick={onClaimTasks} disabled={selectedTask.length === 0} type="button">
                    Claim Tasks
                  </button>
                </div>
              )}
            </div>
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
          <CustomModal
            isOpen={isShowConfirmModal}
            headerTitle="Tasks Claimed. Go to My Workspace?"
            onCancel={() => {
              setIsShowConfirmModal(false);
            }}
            type="system-modal"
            cancelTitle="No"
            confirmTitle="Yes"
            onConfirm={() => history.push(WEB_ROUTES.MY_WORKSPACE.url)}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ claimTaskReducers: { ieuOfficer } }, ownProps) => ({
  ...ownProps,
  ...ieuOfficer,
});

const mapDispatchToProps = {
  form3CommonPoolAction,
  sampleMyWorkspaceFilterAction: sampleMyWorkspaceFilter,
  form3ClaimAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ClaimTask));
