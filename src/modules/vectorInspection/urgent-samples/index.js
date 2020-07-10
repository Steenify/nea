import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

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
import FloatingNumber from 'components/common/floating-number';
import Footer from 'components/ui/footer';
import Checkbox from 'components/common/checkbox';

import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { getUrgentSampleListingAction, getUrgentSampleListingFilterAction, defaultFilterValue, saveUrgentAction } from './action';

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
    label: 'Inspection Officer',
    value: 'inspectionOfficer',
  },
];

const UrgentSamples = (props) => {
  const {
    getUrgentSampleListingAction,
    getUrgentSampleListingFilterAction,
    saveUrgentAction,
    urgentSamples: {
      ui: { isLoading },
      data: { filteredSamples, samples },
    },
    history,
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);
  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchTextValue] = useState(defaultFilterValue.searchText);
  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);
  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);
  const filterRef = useRef(null);

  const [sampleIds, setSampleIds] = useState([]);
  const isSelectAll = sampleIds.length > 0 && sampleIds.length === filteredSamples.length;
  const [urgentReason, setUrgentReason] = useState('');
  const [isModalOpen, toggleModal] = useState(false);

  const getSamples = useCallback(() => {
    getUrgentSampleListingAction().then(() => {
      if (filterRef && filterRef.current) filterRef.current.onClear();
    });
  }, [getUrgentSampleListingAction]);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.URGENT_SAMPLES.name}`;
    getSamples();
  }, [getSamples]);

  useEffect(() => {
    getUrgentSampleListingFilterAction({
      sortValue,
      searchType,
      searchText,
      filterValue,
      datePickerValue,
    });
  }, [searchText, searchType, sortValue, filterValue, datePickerValue, getUrgentSampleListingFilterAction]);

  const getTrProps = (_, rowInfo) => {
    const props = {};
    if (rowInfo) {
      if (rowInfo.row._original.isPrioritized) {
        props.className = 'bg-warning';
      }
      if (rowInfo.row._original.isUrgentCase) {
        props.className = 'bg-danger';
      }
    }
    return props;
  };

  const dateSelectData = [
    {
      label: 'Breeding Detection Date',
      value: 'breedingDetection',
    },
  ];

  const filterData = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        title: 'Sample Status',
        id: 'sampleStatus',
      },
    ],
    [],
  );

  const saveUrgentSample = () => {
    if (!urgentReason) {
      toast.error('Urgent Reason is required');
      return;
    }

    saveUrgentAction({ barcodeIds: sampleIds, urgentReason }, () => {
      setSampleIds([]);
      setUrgentReason('');
      toggleModal(false);
      getSamples();
    });
  };

  const onCheckSample = (sampleId) => {
    const index = sampleIds.findIndex((id) => id === sampleId);
    if (index > -1) {
      sampleIds.splice(index, 1);
    } else {
      sampleIds.push(sampleId);
    }
    setSampleIds([...sampleIds]);
  };

  const onCheckAllSample = () => {
    if (isSelectAll) {
      filteredSamples.forEach((sample) => {
        const index = sampleIds.findIndex((id) => id === sample.sampleId);
        if (index > -1) sampleIds.splice(index, 1);
      });
      setSampleIds([...sampleIds]);
    } else {
      filteredSamples.forEach((sample) => {
        const index = sampleIds.findIndex((id) => id === sample.sampleId);
        if (index < 0) sampleIds.push(sample.sampleId);
      });
      setSampleIds([...sampleIds]);
    }
  };

  const columns = [
    {
      fixed: 'left',
      minWidth: tableColumnWidth.xs,
      Cell: (cellInfo) => <Checkbox checked={sampleIds.includes(cellInfo.row.sampleId)} onChange={() => onCheckSample(cellInfo.row.sampleId)} />,
      Header: () => <Checkbox checked={isSelectAll} onChange={() => onCheckAllSample()} />,
    },
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
        <span className="text-blue cursor-pointer" onClick={() => history.push(`${WEB_ROUTES.DETAILS.url}/inspection`, { id: cellInfo.row.inspectionId })}>
          {cellInfo.row.inspectionId}
        </span>
      ),
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Sample ID',
      accessor: 'sampleId',
      Cell: (cellInfo) => (
        <span className="text-blue cursor-pointer" onClick={() => history.push(`${WEB_ROUTES.DETAILS.url}/sample`, { id: cellInfo.row.sampleId })}>
          {cellInfo.row.sampleId}
        </span>
      ),
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Inspection Officer',
      accessor: 'inspectionOfficer',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Sample Status',
      accessor: 'sampleStatus',
      minWidth: tableColumnWidth.lg,
    },
  ];

  return (
    <>
      <Header />

      <div className="main-content">
        <NavBar active={WEB_ROUTES.INSPECTION_MANAGEMENT.URGENT_SAMPLES.name} />

        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.URGENT_SAMPLES]} />

          <div className="main-title">
            <h1>{WEB_ROUTES.INSPECTION_MANAGEMENT.URGENT_SAMPLES.name}</h1>
          </div>

          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Search by keyword" searchTypes={searchData} value={searchText} onChangeText={setSearchTextValue} onChangeSearchType={setSearchTypeValue} />
              <DateRangePickerSelect className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" onChange={setDatePickerValue} selectData={dateSelectData} data={datePickerValue} />
              <Filter ref={filterRef} className="navbar-nav filterWrapper  min-width-300 " onChange={setFilterValue} data={filterData} original={samples} />
              <Sort className="navbar-nav sortWrapper" data={columns} value={sortValue} desc={sortValue.desc} onChange={setSortValue} />
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
            headerTitle="Reason"
            cancelTitle="Cancel"
            onCancel={() => {
              toggleModal(!isModalOpen);
              setUrgentReason('');
            }}
            confirmTitle="Submit"
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

const mapStateToProps = ({ global, sampleIdentificationReducers: { urgentSamples } }) => ({
  global,
  urgentSamples,
});

const mapDispatchToProps = {
  getUrgentSampleListingAction,
  getUrgentSampleListingFilterAction,
  saveUrgentAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UrgentSamples));
