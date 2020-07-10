import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import Sort from 'components/common/sort';
import SearchBox from 'components/common/searchBox';
import FilteringDataTable from 'components/common/filtering-data-table';
import Filter, { FilterType } from 'components/common/filter';
import CustomModal from 'components/common/modal';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import Select from 'components/common/select';
import InPageLoading from 'components/common/inPageLoading';
import { tableColumnWidth, MODULE_NAMES, WEB_ROUTES } from 'constants/index';

import { retrieveUserAuditLogService } from 'services/audit-trails-reports/user-audit-log';
import { actionTryCatchCreator } from 'utils';

import { downloadListAction, defaultFilterValue } from './action';

const searchData = [
  {
    label: 'User Table',
    value: 'userTable',
  },
  {
    label: 'SOE ID',
    value: 'soeId',
  },
];

const UserAuditLog = (props) => {
  const { downloadListAction } = props;

  const [apiState, setAPIState] = useState({ list: [], isLoading: false });

  const getListAction = (params) => {
    const onPending = () => setAPIState((prev) => ({ ...prev, isLoading: true }));
    const onSuccess = (data) => {
      const result = data.userAuditLogVOList || [];
      setAPIState({ isLoading: false, list: result });
    };
    const onError = () => setAPIState((prev) => ({ ...prev, isLoading: false }));

    actionTryCatchCreator(retrieveUserAuditLogService(params), onPending, onSuccess, onError);
  };

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);

  const [moduleName, setModuleName] = useState(MODULE_NAMES[0].value);

  const [modalState, setModalState] = useState({ open: false, data: {} });

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.AUDIT_TRAILS_REPORT.USER_AUDIT_LOG.name}`;
  }, []);

  useEffect(() => {
    getListAction({ moduleName });
  }, [moduleName]);

  const columns = [
    {
      Header: 'Date',
      accessor: 'date',
      minWidth: tableColumnWidth.md,
      sortType: 'dateTime',
    },
    {
      Header: 'User Table',
      accessor: 'userTable',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Create/Update by UserID',
      accessor: 'soeId',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Details of Transaction',
      accessor: 'detailsOfTransaction',
      hiddenInSort: true,
      minWidth: tableColumnWidth.lg,
      Cell: (cellInfo) => (
        <button type="button" className="btn btn-sec mw-100" onClick={() => setModalState({ open: true, data: cellInfo.original })}>
          View details
        </button>
      ),
    },
  ];

  const dateSelectData = [
    {
      label: 'Date',
      value: 'date',
      useExactField: true,
    },
  ];

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        id: 'userTable',
        title: 'User Table',
      },
    ],
    [],
  );

  const printJSON = (json) => {
    if (_.isString(json)) {
      const str = json.replace(/\\"/g, '"');
      try {
        return JSON.stringify(JSON.parse(str), undefined, 2);
      } catch (error) {
        console.log(error);
        return "Can't parse JSON";
      }
    }
    if (_.isObject(json)) {
      return JSON.stringify(json, undefined, 2);
    }
    return '';
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.AUDIT_TRAILS_REPORT.USER_AUDIT_LOG.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.AUDIT_TRAILS_REPORT, WEB_ROUTES.AUDIT_TRAILS_REPORT.USER_AUDIT_LOG]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.AUDIT_TRAILS_REPORT.USER_AUDIT_LOG.name}</h1>
          </div>
          <div className="d-flex align-items-center tabsContainer">
            <label className="font-weight-bold mr-3">Module Name:</label>
            <Select className="wf-250" options={MODULE_NAMES} onChange={(module) => setModuleName(module.value)} />
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Enter keywords" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} timePicker />
              <Filter className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={apiState.list} />
              <Sort className="navbar-nav sortWrapper" data={columns.filter((item) => !item.hiddenInSort)} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>
          <div className="paddingBottom50 tabsContainer">
            <div>
              <FilteringDataTable
                data={apiState.list || []}
                filterData={{ searchType, searchText, filterValue, sortValue, datePickerValue }}
                columns={columns}
                rightHeaderContent={
                  <div className="d-flex align-items-center">
                    <button type="button" className="btn btn-sec m-1" onClick={() => downloadListAction({ moduleName })}>
                      Download
                    </button>
                  </div>
                }
              />
            </div>
          </div>
          <CustomModal
            isOpen={modalState.open}
            type="action-modal"
            headerTitle="Details of Transaction"
            cancelTitle="Close"
            onCancel={() => setModalState({ open: false })}
            size="lg"
            content={
              <div className="row">
                <div className="col-lg-6">
                  <label className="font-weight-bold">Before</label>
                  <pre>
                    <code>{printJSON(modalState?.data?.detailsOfTransactionBefore)}</code>
                  </pre>
                </div>
                <div className="col-lg-6">
                  <label className="font-weight-bold">After</label>
                  <pre>
                    <code>{printJSON(modalState?.data?.detailsOfTransactionAfter)}</code>
                  </pre>
                </div>
              </div>
            }
          />
          <InPageLoading isLoading={apiState.isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ adminReducers: { userAuditLog } }, ownProps) => ({
  ...ownProps,
  ...userAuditLog,
});

const mapDispatchToProps = {
  downloadListAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserAuditLog));
