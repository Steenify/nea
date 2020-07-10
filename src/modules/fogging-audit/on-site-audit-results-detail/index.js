import React, { useState, useRef, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';

import { TabContent, TabPane } from 'reactstrap';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import TabNav from 'components/ui/tabnav';
import SearchBox from 'components/common/searchBox';
import Filter, { FilterType } from 'components/common/filter';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import Footer from 'components/ui/footer';
import CustomModal from 'components/common/modal';

import AuditResults from 'components/pages/fogging-audit/audit-results';

import GoBackButton from 'components/ui/go-back-button';
import { defaultFilterValue, getDetailAction, submitOnsiteAuditScheduleMatchingAction, filterListAction } from './action';

const OnSiteAuditResultsDetail = (props) => {
  const {
    history,
    location: { state },

    ui: { isLoading },
    data: { filteredList, list, detail },
    getDetailAction,
    submitOnsiteAuditScheduleMatchingAction,
    filterListAction,
  } = props;

  const tabNavMenu = ['Fogging Info', 'Audit Results'];

  const [activeTabNav, toggleTabNav] = useState('0');

  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);

  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const filterRef = useRef(null);

  const [scheduleId, setScheduleId] = useState();
  const [modalState, setModalState] = useState({ open: false, isMatched: false });

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SEARCH,
        id: 'premisesType',
        title: 'Premises Type',
      },
    ],
    [],
  );

  const dateSelectData = [
    {
      label: 'Fogging Date',
      value: 'foggingDate',
      useExactField: true,
    },
  ];
  const searchData = [
    {
      label: 'Company Name',
      value: 'companyName',
    },
    {
      label: 'Address',
      value: 'address',
    },
    {
      label: 'Building Name',
      value: 'buildingName',
    },
  ];

  const columns = [
    {
      fixed: 'left',
      Header: '',
      minWidth: tableColumnWidth.md,
      Cell: (cellInfo) => {
        if (cellInfo.row._original.auditTaskId) {
          return <label className="font-weight-bold text-blue">Audited as at</label>;
        }

        return (
          <div className="custom-radio">
            <input
              className="form-input"
              type="radio"
              checked={scheduleId === cellInfo.row._original.scheduleId}
              onChange={() => setScheduleId(cellInfo.row._original.scheduleId)}
              id={cellInfo.row._original.scheduleId}
            />
            <label className="form-label font-weight-bold" htmlFor={cellInfo.row._original.scheduleId}>
              Schedule
            </label>
          </div>
        );
      },
    },
    {
      Header: 'Fogging Date',
      accessor: 'foggingDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Fogging Period',
      accessor: 'foggingPeriod',
      isTimePeriod: true,
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Company Name',
      accessor: 'companyName',
      minWidth: tableColumnWidth.xl,
      sortType: 'string',
    },
    {
      Header: 'Address',
      accessor: 'address',
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: 'Building Name',
      accessor: 'buildingName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Premises Type',
      accessor: 'premisesType',
      minWidth: tableColumnWidth.lg,
    },
  ];

  const getTrProps = (_state, rowInfo) => {
    if (rowInfo?.row?._original?.scheduleId) {
      return {
        onClick: () => setScheduleId(rowInfo.row._original.scheduleId),
        className: 'cursor-pointer',
      };
    }
    return {};
  };

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.FOGGING_AUDIT.ON_SITE_AUDIT_RESULTS_DETAIL.name}`;
    if (state?.auditTaskId) {
      getDetailAction({ auditTaskId: state?.auditTaskId });
    } else {
      history.goBack();
    }
  }, [getDetailAction, history, state]);

  useEffect(() => {
    if (detail) {
      filterListAction({
        searchText,
        searchType,
        filterValue,
      });
    }
  }, [searchText, searchType, filterValue, filterListAction, detail]);

  const submitMatching = (isMatched) => {
    submitOnsiteAuditScheduleMatchingAction(
      {
        isMatched,
        scheduleId,
        auditTaskId: detail?.matchingAuditTask?.auditTaskId,
      },
      () => {
        // toast.success(isMatched ? 'Submitted Match to fogging schedule.' : 'Submitted Unable to match fogging schedule.');
        toast.success('Task routed for enforcement recommendation.');
        history.goBack();
      },
    );
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.FOGGING_AUDIT, WEB_ROUTES.FOGGING_AUDIT.ON_SITE_AUDIT_RESULTS_DETAIL]} />
          <GoBackButton onClick={() => history.goBack()} title={`Inspection ID: ${state?.inspectionId}`} />

          <nav className="tab__main">
            <div className="tabsContainer">
              <div>
                <TabNav onToggleTab={toggleTabNav} activeTab={activeTabNav} menu={tabNavMenu} />
                <TabContent activeTab={activeTabNav}>
                  <TabPane tabId="0">
                    <div className="tab-content">
                      <div className="tab-pane__group bg-white">
                        <p className="tab-pane__title text-white">Contractor Info</p>
                        <div className="card">
                          <div className="card-body">
                            <div className="row paddingBottom10">
                              <div className="col-md-3 col-lg-2 font-weight-bold">Company Name</div>
                              <div className="col-md-9 col-lg-4">{detail?.foggingInfo?.companyName}</div>
                            </div>
                            <div className="row paddingBottom10">
                              <div className="col-md-3 col-lg-2 font-weight-bold">UEN</div>
                              <div className="col-md-9 col-lg-4">{detail?.foggingInfo?.companyUen}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-content">
                      <div className="tab-pane__group bg-white">
                        <p className="tab-pane__title text-white">Match to Fogging Schedule</p>
                        <div className="card">
                          <div className="card-body">
                            <div className="navbar navbar-expand filterMainWrapper row">
                              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <SearchBox placeholder="Search by keyword" onChangeText={setSearchTextValue} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
                                <DateRangePickerSelect
                                  className="navbar-nav filterWrapper ml-auto"
                                  onChange={setDatePickerValue}
                                  selectData={dateSelectData}
                                  timePicker={false}
                                  data={datePickerValue}
                                />
                                <Filter ref={filterRef} className="navbar-nav filterWrapper" onChange={setFilterValue} data={filterData} original={list} />
                              </div>
                            </div>
                            <div className="">
                              <div>
                                <DataTable data={filteredList} columns={columns} getTrProps={getTrProps} />
                              </div>
                              <div className="d-flex justify-content-center">
                                <button type="button" className="btn btn-sec m-2" disabled={!scheduleId} onClick={() => setModalState({ open: true, isMatched: true })}>
                                  Match Task to Selected Fogging Schedule
                                </button>
                                <button type="button" className="btn btn-sec m-2" onClick={() => setModalState({ open: true, isMatched: false })}>
                                  Unable to Match to Any Fogging Schedule
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tabId="1">
                    <AuditResults auditResult={detail?.auditResult} />
                  </TabPane>
                </TabContent>
              </div>
            </div>
          </nav>

          <InPageLoading isLoading={isLoading} />
          <Footer />
          <CustomModal
            isOpen={modalState.open}
            type="system-modal"
            headerTitle={modalState.isMatched ? 'Please confirm that you would like to proceed with the matching.' : 'Please confirm that you are unable to find a matching fogging schedule.'}
            cancelTitle="Cancel"
            onCancel={() => setModalState({ open: false })}
            confirmTitle="Confirm"
            onConfirm={() => {
              setModalState({ open: false });
              submitMatching(modalState.isMatched);
            }}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ foggingAuditReducers: { onSiteAuditResultsDetail } }, ownProps) => ({
  ...ownProps,
  ...onSiteAuditResultsDetail,
});

const mapDispatchToProps = { getDetailAction, submitOnsiteAuditScheduleMatchingAction, filterListAction };

export default connect(mapStateToProps, mapDispatchToProps)(OnSiteAuditResultsDetail);
