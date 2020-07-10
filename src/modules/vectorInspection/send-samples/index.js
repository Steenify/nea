import React, { useRef, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from 'components/ui/header';
import TabNav from 'components/ui/tabnav';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import CustomModal from 'components/common/modal';
import DataTable from 'components/common/data-table';
import SearchBox from 'components/common/searchBox';
import NewBreadCrumb from 'components/ui/breadcrumb';
import InPageLoading from 'components/common/inPageLoading';
import FloatingNumber from 'components/common/floating-number';
import MeatballDropdown from 'components/common/meatball-dropdown';
import RejectSampleModal from 'components/modals/reject-sample-modal';
import ReviewRejectReasonModal from 'components/modals/review-reject-reason-modal';
import Checkbox from 'components/common/checkbox';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { getMastercodeAction, MASTER_CODE } from 'store/actions';

import { isSampleRejected } from 'utils';

import {
  getSendListingAction,
  validateBarcodeSendAction,
  submitSendAction,
  reacceptSampleAction,
  rejectSampleAction,
  selectSampleAction,
  resetReducerAction,
  toggleConfirmScreenAction,
} from './action';

import './style.scss';

const depositedColumns = [
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
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'RO',
    accessor: 'regionOfficeCode',
    minWidth: tableColumnWidth.md,
  },
  {
    Header: 'Sample ID',
    accessor: 'sampleId',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Deposited By',
    accessor: 'depositorName',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Deposited Date',
    accessor: 'depositedDate',
    minWidth: tableColumnWidth.lg,
  },
  {
    Header: 'Deposited Time',
    accessor: 'depositedTime',
    minWidth: tableColumnWidth.lg,
  },
];

const SendSamples = (props) => {
  const {
    getSendListingAction,
    validateBarcodeSendAction,
    rejectSampleAction,
    reacceptSampleAction,
    submitSendAction,
    selectSampleAction,
    resetReducerAction,
    toggleConfirmScreenAction,
    getMastercodeAction,
    ui: { isLoading, isShowConfirm },
    data: { scannedSamples, scannedSample, workingSample, sendSamples },
  } = props;

  const [activeTab, setActiveTab] = useState('0');
  const [modalState, setModalState] = useState({
    isReject: false,
    isReview: false,
    isReaccept: false,
    isSubmit: false,
  });
  const [sampleId, setBarcodeId] = useState('');
  const searchBoxRef = useRef(null);
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [localDepositedSamples, setLocalDepositedSamples] = useState([]);
  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.SEND_SAMPLE.name}`;
    if (searchBoxRef?.current.inputRef) searchBoxRef.current.inputRef.focus();
    getMastercodeAction([MASTER_CODE.SAMPLE_REJECT_REASONS]);
    getSendListingAction({}, (list) => {
      setLocalDepositedSamples(list);
    });
    return resetReducerAction;
  }, [getSendListingAction, getMastercodeAction, resetReducerAction]);

  const onSubmitBarcode = (event) => {
    event.preventDefault();
    if (sampleId && sampleId.trim()) {
      const barcodeId = sampleId.trim();
      validateBarcodeSendAction(barcodeId, () => {
        setLocalDepositedSamples(localDepositedSamples.filter((item) => item.sampleId !== barcodeId));
        setSelectedCodes([...selectedCodes, barcodeId]);
      });
    }
    setBarcodeId('');
  };

  const scannedGetTrProps = (_state, rowInfo) => {
    let className = '';
    if (rowInfo) {
      if (rowInfo.row._original.isScanned) {
        className += ' bg-scanned';
      }
      if (scannedSample && rowInfo.row.sampleId === scannedSample.sampleId) {
        className += ' selected';
      }
      if (rowInfo.row._original.hasBottomDivider) {
        className += ' bottom-divider';
      }
      if (rowInfo.row._original.isUrgentCase) {
        className += ' bg-danger';
      }
    }
    return { className };
  };

  const depositedGetTrProps = (_state, rowInfo) => {
    let className = '';
    if (rowInfo) {
      if (rowInfo.row._original.isUrgentCase) {
        className += ' bg-danger';
      }
    }
    return { className };
  };

  const toggleTab = (tab) => {
    if (tab === '0') {
      setTimeout(() => {
        searchBoxRef.current.inputRef.focus();
      }, 500);
    } else {
      // getSendListingAction();
    }
    setActiveTab(tab);
  };

  const rejectSample = (data) => {
    setModalState({ isReject: false });
    rejectSampleAction({ ...workingSample, ...data });
  };

  const reacceptSample = () => {
    reacceptSampleAction({
      ...workingSample,
      rejectReasonCodes: [],
      rejectReasonOther: '',
      rejectFileIds: [],
    });
    setModalState({ isReaccept: false });
  };

  const getSendingSamples = () => scannedSamples.filter((item) => selectedCodes.includes(item?.sampleId));

  const submitSendSamples = () => {
    setModalState({ isSubmit: false });
    const data = {
      samples: getSendingSamples().map((sample) => {
        const { sampleId, rejectReasonCodes, rejectReasonOther, rejectFileIds } = sample;
        return { barcodeId: sampleId, rejectReasonCodes, rejectReasonOther, rejectFileIds };
      }),
    };
    submitSendAction(data);
    setSelectedCodes([]);
  };

  const onSubmit = () => {
    if (isShowConfirm) {
      toggleConfirmScreenAction(false);
    } else {
      setModalState({ isSubmit: true });
    }
  };

  const rejectedCount = scannedSamples.filter((item) => isSampleRejected(item)).length;
  // const acceptedCount = scannedSamples.length - rejectedCount;

  const sendColumns = [
    {
      fixed: 'left',
      minWidth: tableColumnWidth.xs,
      Cell: (cellInfo) => {
        const id = cellInfo?.row?.sampleId || '';
        const checked = selectedCodes.includes(id);
        return <Checkbox checked={checked} onChange={() => setSelectedCodes(checked ? selectedCodes.filter((item) => item !== id) : [...selectedCodes, id])} />;
      },
      Header: () => (
        <Checkbox
          checked={selectedCodes.length === scannedSamples.length && selectedCodes.length > 0}
          onChange={() => setSelectedCodes(selectedCodes.length === scannedSamples.length ? [] : scannedSamples.map((item) => item?.sampleId || ''))}
        />
      ),
      maxWidth: !isShowConfirm ? undefined : 0,
      show: !isShowConfirm,
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
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'RO',
      accessor: 'regionOfficeCode',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Deposited By',
      accessor: 'depositorName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Sample ID',
      accessor: 'sampleId',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Deposited Date',
      accessor: 'depositedDate',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Deposited Time',
      accessor: 'depositedTime',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: '',
      className: 'rt-overflow-visible',
      minWidth: tableColumnWidth.lg,
      maxWidth: !isShowConfirm ? undefined : 0,
      show: !isShowConfirm,
      Cell: (cellInfo) => {
        const { _original } = cellInfo.row;
        if (isSampleRejected(_original)) {
          return (
            <MeatballDropdown
              actions={[
                {
                  title: 'View Reason',
                  onClick: () => {
                    selectSampleAction(_original);
                    setModalState({ isReview: true });
                  },
                },
                {
                  title: 'Reaccept',
                  onClick: () => {
                    selectSampleAction(_original);
                    setModalState({ isReaccept: true });
                  },
                },
              ]}
            />
          );
        }
        return (
          <button
            type="button"
            className="btn btn-sec"
            onClick={() => {
              selectSampleAction(_original);
              setModalState({ isReject: true, isReview: false });
            }}>
            Reject
          </button>
        );
      },
    },
    {
      Header: 'Status',
      accessor: 'sampleStatusDesc',
      minWidth: tableColumnWidth.lg,
      maxWidth: isShowConfirm ? undefined : 0,
      show: isShowConfirm,
    },
    {
      Header: 'Sent Date',
      accessor: 'sendDate',
      minWidth: tableColumnWidth.md,
      maxWidth: isShowConfirm ? undefined : 0,
      show: isShowConfirm,
    },
    {
      Header: 'Sent Time',
      accessor: 'sendTime',
      minWidth: tableColumnWidth.md,
      maxWidth: isShowConfirm ? undefined : 0,
      show: isShowConfirm,
    },
    {
      Header: 'Reason Rejected',
      accessor: 'depositedDate',
      minWidth: tableColumnWidth.lg,
      maxWidth: isShowConfirm ? undefined : 0,
      show: isShowConfirm,
      Cell: (cellInfo) => {
        const rejectReasonCodes = cellInfo?.row?._original?.rejectReasonCodes || [];
        const rejectReasonOther = cellInfo?.row?._original?.rejectReasonOther || '';
        return (
          <div>
            {rejectReasonCodes &&
              rejectReasonCodes.map((codeDesc, index) => {
                if (codeDesc === 'Others') {
                  return <></>;
                }
                return <p key={`review_reason_${index.toString()}`}>{codeDesc}</p>;
              })}
            {rejectReasonCodes && rejectReasonCodes.find((code) => code === 'Others') && <p>Others: {rejectReasonOther}</p>}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.INSPECTION_MANAGEMENT.SEND_SAMPLE.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.SEND_SAMPLE]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.INSPECTION_MANAGEMENT.SEND_SAMPLE.name}</h1>
          </div>
          <div className="tabsContainer">
            <TabNav onToggleTab={toggleTab} activeTab={activeTab} menu={['Send Samples', 'Samples Deposited']} />
          </div>
          {activeTab === '0' && (
            <>
              <div className="navbar navbar-expand filterMainWrapper">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <SearchBox
                    autoFocus
                    name="barcode"
                    placeholder="Please scan or enter Barcode ID"
                    onChangeText={setBarcodeId}
                    value={sampleId}
                    onSubmit={onSubmitBarcode}
                    ref={searchBoxRef}
                    className="mb-0"
                  />
                </div>
              </div>
              <div className="main-title">
                <div className="receive__numbers">
                  {isShowConfirm ? (
                    <>
                      <FloatingNumber title="Samples Scanned:" number={sendSamples.filter((item) => !isSampleRejected(item)).length} />
                      <FloatingNumber title="Samples Rejected:" number={sendSamples.filter((item) => isSampleRejected(item)).length} />
                    </>
                  ) : (
                    <>
                      <FloatingNumber title="Samples Scanned:" number={scannedSamples.length} />
                      <FloatingNumber title="Samples Rejected:" number={rejectedCount} />
                    </>
                  )}
                </div>
                {(selectedCodes.length > 0 || isShowConfirm) && (
                  <button type="button" className="btn btn-pri ml-auto" onClick={onSubmit}>
                    {isShowConfirm ? 'OK' : 'Submit'}
                  </button>
                )}
              </div>
            </>
          )}
          <div className="tabsContainer">
            <div>
              {activeTab === '0' && <DataTable data={isShowConfirm ? sendSamples : scannedSamples} columns={sendColumns} getTrProps={scannedGetTrProps} />}
              {activeTab === '1' && <DataTable data={localDepositedSamples} columns={depositedColumns} getTrProps={depositedGetTrProps} containerClassName="mt-4" />}
            </div>
          </div>

          <RejectSampleModal sample={workingSample} isOpen={modalState.isReject} onCancel={() => setModalState({ isReject: false })} onSubmit={rejectSample} />
          <ReviewRejectReasonModal
            sample={workingSample}
            isOpen={modalState.isReview}
            onCancel={() => setModalState({ isReview: false })}
            onSubmit={() => setModalState({ isReview: false, isReject: true })}
          />
          <CustomModal
            isOpen={modalState.isReaccept}
            type="system-modal"
            headerTitle="Do you want to re-accept"
            cancelTitle="Cancel"
            onCancel={() => setModalState({ isReaccept: false })}
            confirmTitle="Accept"
            onConfirm={reacceptSample}
          />
          <CustomModal
            isOpen={modalState.isSubmit}
            type="system-modal"
            headerTitle="Do you want to submit"
            cancelTitle="Cancel"
            onCancel={() => setModalState({ isSubmit: false })}
            confirmTitle="OK"
            onConfirm={submitSendSamples}
            content={
              <>
                {getSendingSamples().filter((item) => !isSampleRejected(item)).length > 0 && (
                  <div>
                    <div className="font-weight-bold pt-3">Accept</div>
                    {getSendingSamples()
                      .filter((item) => !isSampleRejected(item))
                      .map(({ barcodeId }, index) => (
                        <div key={`accepted_submit_modal_${index + 1}`}>• {barcodeId}</div>
                      ))}
                  </div>
                )}
                {getSendingSamples().filter((item) => isSampleRejected(item)).length > 0 && (
                  <div>
                    <div className="font-weight-bold pt-3">Reject</div>
                    {getSendingSamples()
                      .filter((item) => isSampleRejected(item))
                      .map(({ barcodeId }, index) => (
                        <div key={`accepted_submit_modal_${index + 1}`}>• {barcodeId}</div>
                      ))}
                  </div>
                )}
              </>
            }
          />
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ vectorInspectionReducers: { sendSamples } }, ownProps) => ({
  ...ownProps,
  ...sendSamples,
});

const mapDispatchToProps = {
  getSendListingAction,
  validateBarcodeSendAction,
  submitSendAction,
  rejectSampleAction,
  selectSampleAction,
  resetReducerAction,
  reacceptSampleAction,
  getMastercodeAction,
  toggleConfirmScreenAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SendSamples));
