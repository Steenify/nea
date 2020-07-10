import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import SearchBox from 'components/common/searchBox';
import Sort from 'components/common/sort';
import Filter, { FilterType } from 'components/common/filter';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import FilteringDataTable from 'components/common/filtering-data-table';
import InPageLoading from 'components/common/inPageLoading';
import CustomModal from 'components/common/modal';
import Footer from 'components/ui/footer';
import FloatingNumber from 'components/common/floating-number';
import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import { ReactComponent as Arrow } from 'assets/svg/arrow-receive-number.svg';

import { dateTimeFormatString, actionTryCatchCreator } from 'utils';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { getTrackListingService, saveUrgentSampleService } from 'services/vector-inspection';

import './style.scss';

export const defaultFilterValue = {
  searchText: '',
  searchType: 'inspectionId',
  datePickerValue: {
    startDate: moment().startOf('day'),
    endDate: moment().endOf('day'),
    selectedValue: 'breeding',
  },
  filterValue: null,
  sortValue: {
    id: 'breedingDetectionDate',
    label: 'Breeding Detection Date',
    desc: false,
    sortType: 'date',
  },
};

const searchData = [
  {
    label: 'Inspection ID',
    value: 'inspectionId',
  },
  {
    label: 'Sample ID',
    value: 'sampleId',
  },
  {
    label: 'Deposited By',
    value: 'depositorName',
  },
  {
    label: 'Sent By',
    value: 'senderName',
  },
  {
    label: 'Received By',
    value: 'recipientNameName',
  },
];

const dateSelectData = [
  {
    label: 'Breeding Detection Date',
    value: 'breeding',
  },
  {
    label: 'Deposited Date',
    value: 'deposit',
  },
  {
    label: 'Sent Date',
    value: 'send',
  },
  {
    label: 'Received Date',
    value: 'receive',
  },
];

const TrackSampleStatus = (props) => {
  const { history, getMastercodeAction, masterCodes } = props;

  const [apiState, setAPIState] = useState({ list: [], totalCollected: 0, totalDeposited: 0, totalSent: 0, totalReceived: 0, isLoading: false });

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const filterRef = useRef(null);

  const [sampleIds, setSampleIds] = useState([]);
  const [urgentReason, setUrgentReason] = useState('');
  const [isModalOpen, toggleModal] = useState(false);

  const getSamples = useCallback(() => {
    const startDate = datePickerValue?.startDate || defaultFilterValue.datePickerValue.startDate;
    const endDate = datePickerValue?.endDate || defaultFilterValue.datePickerValue.endDate;
    const dateType = datePickerValue?.selectedValue || defaultFilterValue.datePickerValue.selectedValue;
    const params = {
      startDate: startDate.format(dateTimeFormatString),
      endDate: endDate.format(dateTimeFormatString),
      dateType,
    };
    actionTryCatchCreator(
      getTrackListingService(params),
      () => setAPIState((prev) => ({ ...prev, isLoading: true })),
      (data) => {
        if (filterRef && filterRef.current) filterRef.current.onClear();
        setAPIState({
          isLoading: false,
          list: data.samples || [],
          totalCollected: data.totalCollected,
          totalDeposited: data.totalDeposited,
          totalReceived: data.totalReceived,
          totalSent: data.totalSent,
        });
      },
      () => setAPIState((prev) => ({ ...prev, isLoading: false })),
    );
  }, [datePickerValue]);

  const saveUrgentSample = useCallback(() => {
    actionTryCatchCreator(
      saveUrgentSampleService({ barcodeIds: sampleIds, urgentReason }),
      () => setAPIState((prev) => ({ ...prev, isLoading: true })),
      () => {
        setSampleIds([]);
        setUrgentReason('');
        toggleModal(false);
        getSamples();
      },
      () => setAPIState((prev) => ({ ...prev, isLoading: false })),
    );
  }, [sampleIds, urgentReason, getSamples]);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.TRACK_SAMPLE_STATUS.name}`;
    getMastercodeAction([MASTER_CODE.SAMPLE_STATUS_CODE]);
    getSamples();
  }, [getMastercodeAction, getSamples]);

  const getTrProps = (_, rowInfo) => {
    const props = {
      onClick: () => history.push(`${WEB_ROUTES.DETAILS.url}/inspection`, { id: rowInfo?.row?.inspectionId }),
      className: 'cursor-pointer',
    };
    if (rowInfo) {
      if (rowInfo.row._original.isPrioritized) {
        props.className = 'bg-warning cursor-pointer';
      }
      if (rowInfo.row._original.isUrgentCase) {
        props.className = 'bg-danger cursor-pointer';
      }
    }
    return props;
  };

  const columns = [
    {
      Header: 'Breeding Detection Date',
      accessor: 'breedingDetectionDate',
      minWidth: tableColumnWidth.lg,
      sortType: 'date',
    },
    {
      Header: 'Breeding Detection Time',
      accessor: 'breedingDetectionTime',
      minWidth: tableColumnWidth.lg,
      sortType: 'time',
    },
    {
      Header: 'Inspection ID',
      accessor: 'inspectionId',
      Cell: (cellInfo) => <span className="text-blue cursor-pointer">{cellInfo.row.inspectionId}</span>,
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Sample ID',
      accessor: 'sampleId',
      minWidth: tableColumnWidth.lg,
      Cell: (cellInfo) => <span className="text-blue cursor-pointer">{cellInfo.row.sampleId}</span>,
    },
    {
      Header: 'Deposited by',
      accessor: 'depositorName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Deposited Date',
      accessor: 'depositedDate',
      minWidth: tableColumnWidth.md,
      sortType: 'date',
    },
    {
      Header: 'Deposited Time',
      accessor: 'depositedTime',
      minWidth: tableColumnWidth.md,
      sortType: 'time',
    },
    {
      Header: 'Sent By',
      accessor: 'senderName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Sent Date',
      accessor: 'sendDate',
      minWidth: tableColumnWidth.md,
      sortType: 'date',
    },
    {
      Header: 'Sent Time',
      accessor: 'sendTime',
      minWidth: tableColumnWidth.md,
      sortType: 'time',
    },
    {
      Header: 'Received by',
      accessor: 'recipientName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Received Date',
      accessor: 'receivedDate',
      minWidth: tableColumnWidth.md,
      sortType: 'date',
    },
    {
      Header: 'Received Time',
      accessor: 'receivedTime',
      minWidth: tableColumnWidth.md,
      sortType: 'time',
    },
    {
      Header: 'Status',
      accessor: 'sampleStatusDesc',
      minWidth: tableColumnWidth.xl,
    },
  ];

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        title: 'Status',
        id: 'sampleStatusDesc',
        values: (masterCodes[MASTER_CODE.SAMPLE_STATUS_CODE] || []).map((item) => item.label),
      },
    ],
    [masterCodes],
  );

  return (
    <>
      <Header />

      <div className="main-content">
        <NavBar active={WEB_ROUTES.INSPECTION_MANAGEMENT.TRACK_SAMPLE_STATUS.name} />

        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.TRACK_SAMPLE_STATUS]} />

          <div className="main-title">
            <h1>{WEB_ROUTES.INSPECTION_MANAGEMENT.TRACK_SAMPLE_STATUS.name}</h1>
          </div>

          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Search by keyword" searchTypes={searchData} value={searchText} onChangeText={setSearchTextValue} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} original={apiState.list} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>

          <div className="main-title">
            <div className="receive__numbers">
              <FloatingNumber title="Collected By officer" number={apiState.totalCollected} />
              <Arrow className="receive__arrow" />
              <FloatingNumber title="Deposited By Officer" number={apiState.totalDeposited} />
              <Arrow className="receive__arrow" />
              <FloatingNumber title="Sent to EHI" number={apiState.totalSent} />
              <Arrow className="receive__arrow" />
              <FloatingNumber title="Received by EHI" number={apiState.totalReceived} />
            </div>
          </div>

          <div className="tabsContainer">
            {sampleIds.length > 0 && (
              <div className="d-flex mt-3 mb-3">
                <div className="receive__numbers">
                  <FloatingNumber title="Samples Selected:" number={sampleIds.length} />
                </div>
                <div className="d-flex align-items-center ml-auto">
                  <button type="button" className="btn btn-pri" onClick={() => toggleModal(true)}>
                    Urgent Sample
                  </button>
                </div>
              </div>
            )}
            <FilteringDataTable data={apiState.list || []} columns={columns} getTrProps={getTrProps} filterData={{ searchType, searchText, filterValue, sortValue }} />
          </div>
          <InPageLoading isLoading={apiState.isLoading} />
          <Footer />
          <CustomModal
            isOpen={isModalOpen}
            type="action-modal"
            headerTitle="Urgent Reason"
            cancelTitle="Cancel"
            onCancel={() => {
              toggleModal(!isModalOpen);
              setUrgentReason('');
            }}
            confirmTitle="Save"
            onConfirm={saveUrgentSample}
            content={
              <div className="form-nea__checkgroup-ul show">
                <div className="form-group modal-others">
                  <label className="custom-textbox d-block">
                    <textarea
                      className="form-control textField modal-reason"
                      type="text"
                      placeholder="Please state reason"
                      value={urgentReason}
                      onChange={(e) => setUrgentReason(e.target.value)}
                      rows="5"
                    />
                  </label>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global }) => ({
  global,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = {
  getMastercodeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TrackSampleStatus));
