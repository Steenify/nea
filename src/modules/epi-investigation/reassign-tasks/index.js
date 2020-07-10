import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import Filter, { FilterType } from 'components/common/filter';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Checkbox from 'components/common/checkbox';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { getFilterArrayOfListForKey } from 'utils';
import FloatingNumber from 'components/common/floating-number';
import Select from 'components/common/select';
import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import CustomModal from 'components/common/modal';
import { defaultFilterValue, caseReassignListAction, taskFilterAction, assignTaskToGroupAction, caseReassignAction } from './action';

const searchData = [
  {
    label: 'Cluster ID',
    value: 'clusterId',
  },
  {
    label: 'Case ID',
    value: 'caseId',
  },
  {
    label: 'Residential Address',
    value: 'residentialAddress',
  },
  {
    label: 'Office Address',
    value: 'officeAddress',
  },
];
const dateSelectData = [
  {
    label: 'NEA Onset Date',
    value: 'neaOnset',
  },
  {
    label: 'Received Date',
    value: 'received',
  },
];

const EPIReassignTasks = (props) => {
  const {
    caseReassignListAction,
    taskFilterAction,
    // assignTaskToGroupAction,
    caseReassignAction,
    getMastercodeAction,
    // history,
    // location: { search },
    ui: { isLoading },
    data: { filteredList, list },
    groupLOV,
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const filterRef = useRef(null);

  const [debounceSearchText] = useDebounce(searchText, 1000);

  const [caseIds, setCaseIds] = useState([]);

  const isSelectAll = caseIds.length > 0 && caseIds.length === filteredList.length;

  const [isShowModal, setShowModal] = useState(false);

  useEffect(() => {
    document.title = 'NEA | Reassign Task';
    caseReassignListAction().then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
    getMastercodeAction([MASTER_CODE.ASSIGNED_GROUP]);
  }, [caseReassignListAction, getMastercodeAction]);

  useEffect(() => {
    setCaseIds([]);
    taskFilterAction({ sortValue, searchType, searchText: debounceSearchText, filterValue, datePickerValue });
  }, [debounceSearchText, searchText, sortValue, filterValue, taskFilterAction, datePickerValue, searchType]);

  const columns = [
    {
      fixed: 'left',
      minWidth: tableColumnWidth.xs,
      Cell: (cellInfo) => {
        const caseId = cellInfo?.row?.caseId;
        const label = cellInfo?.original?.assignedGroup;
        const caseType = cellInfo?.original?.caseType;
        const value = cellInfo?.original?.assignedGroupCode;
        const obj = { id: caseId, selection: { value, label }, caseType };
        return (
          <Checkbox
            checked={caseIds.map(({ id }) => id).includes(caseId)}
            onChange={() => {
              if (caseIds.map(({ id }) => id).includes(caseId)) {
                setCaseIds(caseIds.filter((item) => item.id !== caseId));
              } else {
                setCaseIds([...caseIds, obj]);
              }
            }}
          />
        );
      },
      Header: () => (
        <Checkbox
          checked={isSelectAll}
          onChange={() =>
            setCaseIds(isSelectAll ? [] : filteredList.map((item) => ({ id: item?.caseId, caseType: item?.caseType, selection: { value: item?.assignedGroupCode, label: item?.assignedGroup } })))
          }
        />
      ),
    },
    {
      Header: 'Disease',
      accessor: 'caseType',
      headerClassName: 'header-right',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Cluster ID',
      accessor: 'clusterId',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Case ID',
      accessor: 'caseId',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'NEA Onset Date',
      accessor: 'neaOnsetDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'CDC',
      accessor: 'cdc',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Premises Type',
      accessor: 'premiseType',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Residential Address',
      accessor: 'residentialAddress',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'Office Address',
      accessor: 'officeAddress',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'Received Date',
      accessor: 'receivedDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Assigned Group',
      accessor: 'assignedGroup',
      Cell: (cellInfo) => {
        const caseId = cellInfo?.row?.caseId;
        const assignedGroup = cellInfo?.row?.assignedGroup || '';
        // const assignedGroupCode = cellInfo?.original?.assignedGroupCode || '';
        // const selectedValue = groupLOV.find((option) => option.value === assignedGroupCode) || '';
        const findItem = caseIds.find((item) => item.id === caseId);
        return findItem ? (
          <Select
            value={findItem?.selection}
            options={groupLOV}
            className="d-inline-block wf-300"
            isClearable
            onChange={(selection) => {
              setCaseIds(caseIds.map((item) => (item.id === caseId ? { ...item, selection } : item)));
            }}
          />
        ) : (
          assignedGroup
        );
      },
      minWidth: tableColumnWidth.xl,
    },
  ];

  const filterData = [
    {
      type: FilterType.SELECT,
      id: 'caseType',
      title: 'Disease',
      values: getFilterArrayOfListForKey(list, 'caseType'),
    },

    {
      type: FilterType.SELECT,
      id: 'cdc',
      title: 'CDC',
      values: getFilterArrayOfListForKey(list, 'cdc'),
    },
    {
      type: FilterType.SELECT,
      id: 'premiseType',
      title: 'Premises Type',
      values: getFilterArrayOfListForKey(list, 'premiseType'),
    },
    {
      type: FilterType.SELECT,
      id: 'assignedGroup',
      title: 'Assigned Group',
      values: getFilterArrayOfListForKey(list, 'assignedGroup'),
    },
  ];

  const reassignTask = () => {
    // const selectedTasks1 = list.filter(({ caseId = '' }) => caseIds.includes(caseId)).map(({ caseId, caseType, assignedGroupCode }) => ({ caseId, caseType, assignedGroup: assignedGroupCode }));
    const selectedTasks = caseIds.map(({ id, caseType, selection }) => ({ caseId: id, caseType, assignedGroup: selection?.value }));

    caseReassignAction(selectedTasks, () => {
      setCaseIds([]);
      caseReassignListAction();
      setShowModal(true);
    });
  };

  const reassignEnable = caseIds.map(({ selection }) => selection).reduce((acc, curr) => acc && !!curr?.value, true);

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active="Reassign Tasks" />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.EPI_INVESTIGATION, WEB_ROUTES.EPI_INVESTIGATION.REASSIGN_TASK]} />
          <div className="paddingBottom50">
            <div className="main-title">
              <h1>Reassign Tasks</h1>
            </div>
            <div className="navbar navbar-expand filterMainWrapper">
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <SearchBox placeholder="Enter keywords" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
                <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
                <Filter ref={filterRef} className="navbar-nav filterWrapper" onChange={setFilterValue} data={filterData.filter(({ values }) => values?.length > 0)} />
                <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
              </div>
            </div>
            <div className="tabsContainer">
              {caseIds.length > 0 && (
                <div className="d-flex mt-3 mb-3">
                  <div className="receive__numbers">
                    <FloatingNumber title="Tasks Selected:" number={caseIds.length} />
                  </div>
                  <div className="d-flex align-items-center ml-auto">
                    <button type="button" className="btn btn-pri" onClick={reassignTask} disabled={!reassignEnable}>
                      Reassign Selected Tasks
                    </button>
                  </div>
                </div>
              )}
              <div>
                <DataTable data={filteredList} columns={columns} />
              </div>
            </div>
          </div>
          <InPageLoading isLoading={isLoading} />
          <Footer />
          <CustomModal
            isOpen={isShowModal}
            headerTitle="Tasks reassigned."
            onCancel={() => {
              setShowModal(false);
            }}
            type="system-modal"
            cancelTitle="OK"
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global, epiInvestigationReducers: { reassignTask } }, ownProps) => {
  const masterCodes = global?.data?.masterCodes || {};
  const groupLOV = masterCodes[MASTER_CODE.ASSIGNED_GROUP] || [];
  return {
    ...ownProps,
    ...reassignTask,
    groupLOV,
  };
};

const mapDispatchToProps = {
  caseReassignListAction,
  taskFilterAction,
  assignTaskToGroupAction,
  caseReassignAction,
  getMastercodeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EPIReassignTasks));
