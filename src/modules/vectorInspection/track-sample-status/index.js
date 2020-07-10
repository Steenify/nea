import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import SearchBox from 'components/common/searchBox';
import Sort from 'components/common/sort';
import Filter, { FilterType } from 'components/common/filter';
import DateRangePickerSelect from 'components/common/dateRangPickerSelect';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import CustomModal from 'components/common/modal';
import Footer from 'components/ui/footer';
import FloatingNumber from 'components/common/floating-number';
import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import { ReactComponent as Arrow } from 'assets/svg/arrow-receive-number.svg';

import { dateTimeFormatString } from 'utils';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import './style.scss';

import { getTrackListingAction, getTrackListingFilterAction, saveUrgentAction, defaultFilterValue } from './action';

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
  const {
    getTrackListingAction,
    getTrackListingFilterAction,
    saveUrgentAction,
    trackSampleStatus: {
      ui: { isLoading },
      data: { filteredSamples, totalCollected, totalDeposited, totalSent, totalReceived },
    },
    history,
    getMastercodeAction,
    masterCodes,
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const filterRef = useRef(null);

  const [debounceSearchText] = useDebounce(searchText, 1000);

  const [sampleIds, setSampleIds] = useState([]);
  // const isSelectAll = sampleIds.length > 0 && sampleIds.length === filteredSamples.length;
  const [urgentReason, setUrgentReason] = useState('');
  const [isModalOpen, toggleModal] = useState(false);

  const getSamples = useCallback(() => {
    const startDate = datePickerValue?.startDate || defaultFilterValue.datePickerValue.startDate;
    const endDate = datePickerValue?.endDate || defaultFilterValue.datePickerValue.endDate;
    const dateType = datePickerValue?.selectedValue || defaultFilterValue.datePickerValue.selectedValue;
    getTrackListingAction({
      startDate: startDate.format(dateTimeFormatString),
      endDate: endDate.format(dateTimeFormatString),
      dateType,
    }).then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
  }, [getTrackListingAction, datePickerValue]);

  const saveUrgentSample = () => {
    setSampleIds([]);
    setUrgentReason('');
    toggleModal(false);
    saveUrgentAction({ barcodeIds: sampleIds, urgentReason }).then(() => {
      getSamples();
    });
  };

  useEffect(() => {
    document.title = 'NEA | Track Sample Status';
    getMastercodeAction([MASTER_CODE.SAMPLE_STATUS_CODE]);
    getSamples();
  }, [getMastercodeAction, getSamples]);

  useEffect(() => {
    getTrackListingFilterAction({
      sortValue,
      searchType,
      searchText: debounceSearchText,
      filterValue,
    });
  }, [debounceSearchText, searchType, sortValue, filterValue, getTrackListingFilterAction]);

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

  // const onCheckSample = sampleId => {
  //   const index = sampleIds.findIndex(id => id === sampleId);
  //   if (index > -1) {
  //     sampleIds.splice(index, 1);
  //   } else {
  //     sampleIds.push(sampleId);
  //   }
  //   setSampleIds([...sampleIds]);
  // };

  // const onCheckAllSample = () => {
  //   if (isSelectAll) {
  //     filteredSamples.forEach(sample => {
  //       const index = sampleIds.findIndex(id => id === sample.sampleId);
  //       if (index > -1) sampleIds.splice(index, 1);
  //     });
  //     setSampleIds([...sampleIds]);
  //   } else {
  //     filteredSamples.forEach(sample => {
  //       const index = sampleIds.findIndex(id => id === sample.sampleId);
  //       if (index < 0) sampleIds.push(sample.sampleId);
  //     });
  //     setSampleIds([...sampleIds]);
  //   }
  // };

  const columns = [
    // {
    //   fixed: 'left',
    //   minWidth: tableColumnWidth.xs,
    //   Cell: cellInfo => (
    //     <div>
    //       <div className="custom-control custom-checkbox">
    //         <input
    //           type="checkbox"
    //           className="custom-control-input"
    //           id={`custom_search_check__${cellInfo.row.sampleId}`}
    //           checked={sampleIds.includes(cellInfo.row.sampleId)}
    //           onChange={() => onCheckSample(cellInfo.row.sampleId)}
    //         />
    //         <label className="custom-control-label" htmlFor={`custom_search_check__${cellInfo.row.sampleId}`} />
    //       </div>
    //     </div>
    //   ),
    //   Header: () => (
    //     <div>
    //       <div className="custom-control custom-checkbox">
    //         <input
    //           type="checkbox"
    //           className="custom-control-input"
    //           id="custom_search_check_all"
    //           checked={isSelectAll}
    //           onChange={() => onCheckAllSample()}
    //         />
    //         <label className="custom-control-label" htmlFor="custom_search_check_all" />
    //       </div>
    //     </div>
    //   ),
    // },
    {
      Header: 'Breeding Detection Date',
      accessor: 'breedingDetectionDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Breeding Detection Time',
      accessor: 'breedingDetectionTime',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Inspection ID',
      accessor: 'inspectionId',
      Cell: (cellInfo) => (
        <span
          className="text-blue cursor-pointer"
          // onClick={() => history.push(`${WEB_ROUTES.DETAILS.url}/inspection`, {id: cellInfo.row.inspectionId})}
        >
          {cellInfo.row.inspectionId}
        </span>
      ),
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Sample ID',
      accessor: 'sampleId',
      minWidth: tableColumnWidth.lg,
      Cell: (cellInfo) => (
        <span
          className="text-blue cursor-pointer"
          // onClick={() => history.push(`${WEB_ROUTES.DETAILS.url}/sample`, {id: cellInfo.row.sampleId})}
        >
          {cellInfo.row.sampleId}
        </span>
      ),
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
    },
    {
      Header: 'Deposited Time',
      accessor: 'depositedTime',
      minWidth: tableColumnWidth.md,
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
    },
    {
      Header: 'Sent Time',
      accessor: 'sendTime',
      minWidth: tableColumnWidth.md,
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
    },
    {
      Header: 'Received Time',
      accessor: 'receivedTime',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Status',
      accessor: 'sampleStatusDesc',
      minWidth: tableColumnWidth.xl,
    },
  ];

  const filterData = [
    {
      type: FilterType.SELECT,
      title: 'Status',
      id: 'sampleStatusDesc',
      values: (masterCodes[MASTER_CODE.SAMPLE_STATUS_CODE] || []).map((item) => item.label),
    },
  ];

  return (
    <>
      <Header />

      <div className="main-content">
        <NavBar active="Track Sample Status" />

        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.TRACK_SAMPLE_STATUS]} />

          <div className="main-title">
            <h1>Track Sample Status</h1>
          </div>

          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Search by keyword" searchTypes={searchData} value={searchText} onChangeText={setSearchTextValue} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper xs-paddingBottom15" onChange={setFilterValue} data={filterData} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
            </div>
          </div>

          <div className="main-title">
            <div className="receive__numbers">
              <FloatingNumber title="Collected By officer" number={totalCollected} />
              <Arrow className="receive__arrow" />
              <FloatingNumber title="Deposited By Officer" number={totalDeposited} />
              <Arrow className="receive__arrow" />
              <FloatingNumber title="Sent to EHI" number={totalSent} />
              <Arrow className="receive__arrow" />
              <FloatingNumber title="Received by EHI" number={totalReceived} />
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
            <DataTable data={filteredSamples} columns={columns} getTrProps={getTrProps} />
          </div>
          <InPageLoading isLoading={isLoading} />
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

const mapStateToProps = ({ global, sampleIdentificationReducers: { trackSampleStatus } }) => ({
  global,
  trackSampleStatus,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = {
  getTrackListingAction,
  getTrackListingFilterAction,
  saveUrgentAction,
  getMastercodeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TrackSampleStatus));
