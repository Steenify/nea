import React, { useRef, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import DataTable from 'components/common/data-table';
import SearchBox from 'components/common/searchBox';
import InPageLoading from 'components/common/inPageLoading';
import NewBreadCrumb from 'components/ui/breadcrumb';
import FloatingNumber from 'components/common/floating-number';
import CustomModal from 'components/common/modal';
import MeatballDropdown from 'components/common/meatball-dropdown';
import RejectSampleModal from 'components/modals/reject-sample-modal';
import ReviewRejectReasonModal from 'components/modals/review-reject-reason-modal';
import Checkbox from 'components/common/checkbox';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import { isSampleRejected } from 'utils';
import { getMastercodeAction, MASTER_CODE } from 'store/actions';

import { validateBarcodeDepositAction, submitDepositAction, reacceptSampleAction, rejectSampleAction, selectSampleAction, resetReducerAction, toggleConfirmScreenAction } from './action';

import './style.scss';

const DepositSamples = (props) => {
  const {
    validateBarcodeDepositAction,
    reacceptSampleAction,
    rejectSampleAction,
    selectSampleAction,
    resetReducerAction,
    toggleConfirmScreenAction,
    submitDepositAction,
    getMastercodeAction,
    ui: { isLoading, isShowConfirm },
    data: { scannedSamples, scannedSample, workingSample, depositedSamples },

    masterCodes,
  } = props;

  const [sampleId, setBarcodeId] = useState('');
  const [modalState, setModalState] = useState({
    isReject: false,
    isReview: false,
    isReaccept: false,
    isSubmit: false,
  });
  const searchBoxRef = useRef(null);
  const [selectedCodes, setSelectedCodes] = useState([]);
  const reasons = masterCodes[MASTER_CODE.SAMPLE_REJECT_REASONS] || [];
  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.DEPOSIT_SAMPLE.name}`;
    getMastercodeAction([MASTER_CODE.SAMPLE_REJECT_REASONS]);
    if (searchBoxRef?.current.inputRef) searchBoxRef.current.inputRef.focus();
    return resetReducerAction;
  }, [getMastercodeAction, resetReducerAction]);

  const onSubmitBarcode = (event) => {
    event.preventDefault();
    if (sampleId && sampleId.trim()) {
      validateBarcodeDepositAction(sampleId.trim(), () => {
        setSelectedCodes([...selectedCodes, sampleId.trim()]);
      });
    }
    setBarcodeId('');
  };

  const getTrProps = (_state, rowInfo) => {
    let className = '';
    if (rowInfo) {
      if (rowInfo.row._original.isScanned) {
        className += ' bg-scanned';
      }
      if (scannedSample && rowInfo.row.sampleId === scannedSample.sampleId) {
        className += ' selected';
      }
      if (rowInfo.row._original.isUrgentCase) {
        className += ' bg-danger';
      }
    }
    return { className };
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

  const submitSamples = () => {
    setModalState({ isSubmit: false });
    const data = {
      samples: getSendingSamples().map((sample) => {
        const { sampleId, rejectReasonCodes, rejectReasonOther, rejectFileIds } = sample;
        return {
          barcodeId: sampleId,
          rejectReasonCodes,
          rejectReasonOther,
          rejectFileIds,
        };
      }),
    };
    submitDepositAction(data);
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
  const acceptedCount = scannedSamples.length - rejectedCount;

  const depositColumns = [
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
      Header: 'Sample ID',
      accessor: 'sampleId',
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
      Header: 'Deposited Date',
      accessor: 'depositedDate',
      minWidth: tableColumnWidth.md,
      maxWidth: isShowConfirm ? undefined : 0,
      show: isShowConfirm,
    },
    {
      Header: 'Deposited Time',
      accessor: 'depositedTime',
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
              rejectReasonCodes.map((code, index) => {
                const codeDesc = reasons.find((reason) => reason.value === code)?.label;
                if (code === 'OTH') {
                  return <></>;
                }
                return <p key={`review_reason_${index.toString()}`}>{codeDesc}</p>;
              })}
            {rejectReasonCodes && rejectReasonCodes.find((code) => code === 'OTH') && <p>Others: {rejectReasonOther}</p>}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.INSPECTION_MANAGEMENT.DEPOSIT_SAMPLE.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, WEB_ROUTES.INSPECTION_MANAGEMENT.DEPOSIT_SAMPLE]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.INSPECTION_MANAGEMENT.DEPOSIT_SAMPLE.name}</h1>
          </div>
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
                  <FloatingNumber title="Samples Deposited:" number={depositedSamples.filter((item) => !isSampleRejected(item)).length} />
                  <FloatingNumber title="Samples Rejected:" number={depositedSamples.filter((item) => isSampleRejected(item)).length} />
                </>
              ) : (
                <>
                  <FloatingNumber title="Samples Deposited:" number={acceptedCount} />
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
          <div className="tabsContainer">
            <DataTable data={isShowConfirm ? depositedSamples : scannedSamples} columns={depositColumns} getTrProps={getTrProps} />
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
            onConfirm={submitSamples}
            content={
              <>
                {getSendingSamples().filter((item) => !isSampleRejected(item)).length > 0 && (
                  <div>
                    <div className="font-weight-bold pt-3">Deposit</div>
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

const mapStateToProps = ({ global, vectorInspectionReducers: { depositSamples } }, ownProps) => ({
  ...ownProps,
  ...depositSamples,
  masterCodes: global?.data?.masterCodes || {},
});

const mapDispatchToProps = {
  validateBarcodeDepositAction,
  submitDepositAction,
  reacceptSampleAction,
  rejectSampleAction,
  selectSampleAction,
  resetReducerAction,
  toggleConfirmScreenAction,
  getMastercodeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DepositSamples));
