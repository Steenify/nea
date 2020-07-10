import React, { useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import SearchBox from 'components/common/searchBox';
import Sort from 'components/common/sort';
import Filter, { FilterType } from 'components/common/filter';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';
import Footer from 'components/ui/footer';
import DateRangPickerSelect from 'components/common/dateRangPickerSelect';
import CustomModal from 'components/common/modal';
import FloatingNumber from 'components/common/floating-number';
import DropBox from 'components/common/dropbox';

import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { Form3Mode } from 'modules/details/form3/helper';

import './style.scss';
import { getSampleIdentifiedListAction, getSampleIdentifiedListFilterAction, form3CreateAction, form3NoFurtherAction, defaultFilterValue } from './action';

const dateSelectData = [
  {
    label: 'Breeding Detection Date',
    value: 'breeding',
  },
];

const ListOfSamplesIDed = (props) => {
  const {
    history,
    ui: { isLoading },
    data: { filteredSamples, samples },
    getSampleIdentifiedListAction,
    getSampleIdentifiedListFilterAction,
    form3CreateAction,
    form3NoFurtherAction,
  } = props;

  const [sortValue, setSortValue] = useState(defaultFilterValue.sortValue);

  const [filterValue, setFilterValue] = useState(defaultFilterValue.filterValue);

  const [searchType, setSearchTypeValue] = useState(defaultFilterValue.searchType);
  const [searchText, setSearchText] = useState(defaultFilterValue.searchText);

  const [datePickerValue, setDatePickerValue] = useState(defaultFilterValue.datePickerValue);

  const [modalState, setModalState] = useState({ open: false, type: 'reason' });

  const [sampleIds, setSampleIds] = useState([]);
  const isSelectAll = sampleIds.length > 0 && sampleIds.length === filteredSamples.length;

  const [fileIdList, setFileIds] = useState([]);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.IDENTIFIED_SAMPLES.name}`;
    getSampleIdentifiedListAction();
  }, [getSampleIdentifiedListAction]);

  useEffect(() => {
    getSampleIdentifiedListFilterAction({
      searchType,
      sortValue,
      datePickerValue,
      searchText,
      filterValue,
    });
  }, [searchType, searchText, datePickerValue, sortValue, filterValue, getSampleIdentifiedListFilterAction]);

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

  const searchData = [
    { label: 'Address', value: 'address' },
    { label: 'Inspection ID', value: 'inspectionId' },
    { label: 'Sample ID', value: 'sampleId' },
  ];

  const filterValues = useMemo(
    () => [
      {
        type: FilterType.SELECT,
        title: 'RO',
        id: 'regionOfficeCode',
      },
      {
        type: FilterType.SEARCH,
        title: 'Town Council',
        id: 'townCouncil',
      },
      {
        type: FilterType.SEARCH,
        title: 'Division',
        id: 'division',
      },
    ],
    [],
  );

  const columns = [
    {
      fixed: 'left',
      minWidth: tableColumnWidth.xs,
      Cell: (cellInfo) => (
        <div style={{ textAlign: 'center' }}>
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id={`custom_search_check__${cellInfo.row.sampleId}`}
              checked={sampleIds.includes(cellInfo.row.sampleId)}
              onChange={() => onCheckSample(cellInfo.row.sampleId)}
            />
            <label className="custom-control-label" htmlFor={`custom_search_check__${cellInfo.row.sampleId}`} />
          </div>
        </div>
      ),
      Header: () => (
        <div style={{ textAlign: 'center' }}>
          <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input" id="custom_search_check_all" checked={isSelectAll} onChange={() => onCheckAllSample()} />
            <label className="custom-control-label" htmlFor="custom_search_check_all" />
          </div>
        </div>
      ),
    },
    {
      Header: 'Breeding Detection Date',
      accessor: 'breedingDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'RO',
      accessor: 'regionOfficeCode',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Town Council',
      accessor: 'townCouncil',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Division',
      accessor: 'division',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Address',
      accessor: 'address',
      minWidth: tableColumnWidth.xxl,
    },
    {
      Header: 'Task Reference Type',
      accessor: 'taskReferenceType',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Premises Type',
      accessor: 'premisesType',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Survey Type',
      accessor: 'surveyType',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Inspection ID',
      accessor: 'inspectionId',
      minWidth: tableColumnWidth.lg,
      Cell: (cellInfo) => (
        <span className="text-blue cursor-pointer" onClick={() => history.push(`${WEB_ROUTES.DETAILS.url}/inspection`, { id: cellInfo.row.inspectionId })}>
          {cellInfo.row.inspectionId}
        </span>
      ),
    },
    {
      Header: 'Specimen Type',
      accessor: 'specimenType',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Sample ID',
      accessor: 'sampleId',
      minWidth: tableColumnWidth.lg,
      Cell: (cellInfo) => (
        <span className="text-blue cursor-pointer" onClick={() => history.push(`${WEB_ROUTES.DETAILS.url}/sample`, { id: cellInfo.row.sampleId })}>
          {cellInfo.row.sampleId}
        </span>
      ),
    },
    {
      Header: 'Vector?',
      accessor: 'isVector',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'RCU / Non-RCU',
      accessor: 'inspectorRole',
      minWidth: tableColumnWidth.md,
    },
  ];

  const submitNoFurtherAction = (isReasonNeeded) => {
    if (!remarks && isReasonNeeded) {
      toast.error('Reason is required');
      return;
    }
    const data = {
      sampleIds,
      // sampleRejectionVO: {
      //   remarks,
      //   fileIdList,
      // },
    };
    if (isReasonNeeded) {
      data.sampleRejectionVO = {
        remarks,
        fileIdList,
      };
    }
    form3NoFurtherAction(data, () => {
      setSampleIds([]);
      setFileIds([]);
      setModalState({ open: false });
      getSampleIdentifiedListAction();
    });
  };

  const submitCreateForm3 = () => {
    const data = { sampleIds };
    form3CreateAction(data, (response) => {
      const {
        form3VO: { form3Id },
      } = response;
      history.push(WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_DETAIL.url, { action: Form3Mode.create, form3Id });
    });
  };

  return (
    <>
      <Header />

      <div className="main-content">
        <NavBar active={WEB_ROUTES.INSPECTION_MANAGEMENT.IDENTIFIED_SAMPLES.name} />

        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.IDENTIFIED_SAMPLES]} />

          <div className="main-title">
            <h1>{WEB_ROUTES.INSPECTION_MANAGEMENT.IDENTIFIED_SAMPLES.name}</h1>
          </div>

          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox placeholder="Search" onChangeText={setSearchText} searchTypes={searchData} value={searchText} onChangeSearchType={setSearchTypeValue} />
              <DateRangPickerSelect singleDatePicker className="navbar-nav filterWrapper ml-auto xs-paddingBottom15" selectData={dateSelectData} onChange={setDatePickerValue} />
              <Filter className="navbar-nav filterWrapper xs-paddingBottom15" data={filterValues} onChange={setFilterValue} original={samples} />
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
                  <button
                    type="button"
                    className="btn btn-sec mr-2"
                    onClick={() => {
                      if (sampleIds.some((sampleId) => samples.find((sample) => sampleId === sample.sampleId)?.isVector === 'Yes')) {
                        setModalState({ open: true, type: 'reason' });
                      } else {
                        submitNoFurtherAction(false);
                      }
                    }}>
                    No Further Action
                  </button>
                  <button type="button" className="btn btn-pri" onClick={() => setModalState({ open: true, type: 'create' })}>
                    Create Form 3
                  </button>
                </div>
              </div>
            )}
            <DataTable data={filteredSamples} columns={columns} />
          </div>

          <CustomModal
            headerTitle="Reason for no further action"
            confirmTitle="Submit to manager"
            cancelTitle="Cancel"
            isOpen={modalState.open && modalState.type === 'reason'}
            onConfirm={() => submitNoFurtherAction(true)}
            onCancel={() => {
              setFileIds([]);
              setModalState({ open: false });
            }}
            type="action-modal"
            content={
              <form className="form-group">
                <div className="row paddingBottom20">
                  <div className="col-lg-12">
                    <textarea className="form-control" rows={3} onChange={(e) => setRemarks(e.target.value)} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <DropBox
                      submissionType="SAMPLEID"
                      // submissionId={sampleId}
                      size="sm"
                      fileIdList={fileIdList}
                      onChange={(fileList) => setFileIds(fileList.map((file) => file.fileId))}
                    />
                  </div>
                </div>
              </form>
            }
          />

          <CustomModal
            isOpen={modalState.open && modalState.type === 'create'}
            type="system-modal"
            headerTitle="SOF will be automatically submitted upon Form 3 creation. Proceed with Form 3 creation?"
            cancelTitle="No"
            onCancel={() => setModalState({ open: false })}
            confirmTitle="Yes"
            onConfirm={() => {
              submitCreateForm3();
              setModalState({ open: false });
            }}
          />
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global, sampleIdentificationReducers: { listOfSamplesIDed } }) => ({
  ...global,
  ...listOfSamplesIDed,
});

const mapDispatchToProps = {
  getSampleIdentifiedListAction,
  getSampleIdentifiedListFilterAction,
  form3NoFurtherAction,
  form3CreateAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ListOfSamplesIDed));
