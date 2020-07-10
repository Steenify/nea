import React, { useRef, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import SearchBox from 'components/common/searchBox';
import DataTable from 'components/common/data-table';
import NewBreadCrumb from 'components/ui/breadcrumb';
import CustomModal from 'components/common/modal';
import InPageLoading from 'components/common/inPageLoading';
import FloatingNumber from 'components/common/floating-number';
import MeatballDropdown from 'components/common/meatball-dropdown';
import RejectSampleModal from 'components/modals/reject-sample-modal';
import ReviewRejectReasonModal from 'components/modals/review-reject-reason-modal';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';

import { getMastercodeAction, MASTER_CODE } from 'store/actions';

import { isSampleRejected } from 'utils';

import { receiveSampleFilter, receiveValidateBarcode, resetReceiveSampleReducer, rejectSample, reacceptSample, acceptUrgentSample, submitReceivedSamples, selectSampleAction } from './action';

const ReceiveSample = (props) => {
  const {
    resetReceiveSampleReducerAction,
    receiveValidateBarcodeAction,
    rejectSampleAction,
    reacceptSampleAction,
    submitReceivedSamplesAction,
    selectSampleAction,
    getMastercodeAction,
    // masterCodes,
    ui: { isSubmitted, isLoading, loadingText },
    data: { scannedSample, workingSample, filteredTaskList },
  } = props;

  const [barcodeId, setBarcodeId] = useState('');
  const [modalState, setModalState] = useState({ isReject: false, isReview: false, isReaccept: false });
  const searchBoxRef = useRef(null);

  const getTrProps = (_state, rowInfo) => {
    let className = '';
    if (rowInfo) {
      if (scannedSample && rowInfo.row.barcodeId === scannedSample.barcodeId) {
        className += ' selected';
      }
      if (rowInfo.row._original.isUrgentCase) {
        className += ' bg-danger';
      }
    }
    return { className };
  };

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.SAMPLE_IDENTIFICATION.RECEIVE_SAMPLE.name}`;
    resetReceiveSampleReducerAction();
    if (searchBoxRef?.current.inputRef) searchBoxRef.current.inputRef.focus();
    getMastercodeAction([MASTER_CODE.SAMPLE_REJECT_REASONS]);
  }, [resetReceiveSampleReducerAction, getMastercodeAction]);

  const onSubmitBarcode = (event) => {
    event.preventDefault();
    if (barcodeId && barcodeId.trim()) {
      receiveValidateBarcodeAction({ barcodeId: barcodeId.trim() });
    }
    setBarcodeId('');
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

  const submitSamples = () => {
    if (isSubmitted) {
      resetReceiveSampleReducerAction().then(() => {
        if (searchBoxRef?.current.inputRef) searchBoxRef.current.inputRef.focus();
      });
    } else {
      const data = {
        samples: filteredTaskList.map((sample) => {
          const { barcodeId, rejectReasonCodes, rejectReasonOther, rejectFileIds } = sample;
          return { barcodeId, rejectReasonCodes, rejectReasonOther, rejectFileIds };
        }),
      };
      submitReceivedSamplesAction(data);
    }
  };

  // const rejectedCount = filteredTaskList.filter(item => isSampleRejected(item)).length;
  const rejectedCount = filteredTaskList.filter(
    (item) =>
      // if (isSubmitted) {
      //   return (item.rejectReasonList && item.rejectReasonList.length > 0) || item.rejectReasonOther;
      // }
      (item.rejectReasonCodes && item.rejectReasonCodes.length > 0) || item.rejectReasonOther,
  ).length;
  const acceptedCount = filteredTaskList.length - rejectedCount;

  const columnPreSubmit = [
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
      Header: 'RO',
      accessor: 'regionOfficeCode',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Sender Name',
      accessor: 'senderName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Contact',
      accessor: 'senderContactNo',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Sample ID',
      accessor: 'barcodeId',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: '',
      className: 'rt-overflow-visible',
      minWidth: tableColumnWidth.lg,
      Cell: (cellInfo) => {
        const { barcodeId, _original } = cellInfo.row;
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
        if (scannedSample && scannedSample.barcodeId === barcodeId) {
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
        }
        return <div />;
      },
    },
  ];

  const columnPostSubmit = [
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
      Header: 'RO',
      accessor: 'regionOfficeCode',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Sender Name',
      accessor: 'senderName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Contact',
      accessor: 'senderContactNo',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Sample ID',
      accessor: 'barcodeId',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Status',
      accessor: 'sampleStatusDesc',
      minWidth: tableColumnWidth.md,
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
      Header: 'Reject Reason',
      minWidth: tableColumnWidth.xxl,
      Cell: (cellInfo) => {
        const {
          _original: { rejectReasonCodes, rejectReasonOther },
        } = cellInfo.row;
        // const SampleRejectReasons = masterCodes[MASTER_CODE.SAMPLE_REJECT_REASONS] || [];
        const reasons = [];
        if (rejectReasonCodes) {
          rejectReasonCodes.forEach((reason) => {
            reasons.push(<li key={`review_reject_reason_${reason}`}>{reason}</li>);
          });
        }
        if (rejectReasonOther) {
          reasons.push(<li key="review_reject_reason_OTH">Others: {rejectReasonOther}</li>);
        }
        return <ul style={{ listStyle: 'disc' }}>{reasons}</ul>;
      },
    },
  ];
  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.SAMPLE_IDENTIFICATION.RECEIVE_SAMPLE.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.SAMPLE_IDENTIFICATION, WEB_ROUTES.SAMPLE_IDENTIFICATION.RECEIVE_SAMPLE]} />
          <div className="main-title">
            <h1>{WEB_ROUTES.SAMPLE_IDENTIFICATION.RECEIVE_SAMPLE.name}</h1>
          </div>
          <div className="navbar navbar-expand filterMainWrapper">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <SearchBox
                name="barcode"
                placeholder="Scan or enter Sample ID (Must be exact Sample ID: i.e. ERO-A200456-20)"
                onSubmit={onSubmitBarcode}
                value={barcodeId}
                onChangeText={setBarcodeId}
                autoFocus
                disabled={isSubmitted}
                ref={searchBoxRef}
              />
            </div>
          </div>
          <div className="main-title">
            <div className="receive__numbers ">
              <FloatingNumber title="Samples Accepted:" number={acceptedCount} />
              <FloatingNumber title="Samples Rejected:" number={rejectedCount} />
            </div>
            {(acceptedCount > 0 || rejectedCount > 0) && (
              <div className="text-center d-flex align-items-center ml-auto">
                <button type="button" className="btn btn-pri" onClick={submitSamples}>
                  {isSubmitted ? 'OK' : 'Submit'}
                </button>
              </div>
            )}
          </div>
          <div className="paddingBottom50 tabsContainer">
            <div>
              <DataTable data={filteredTaskList} columns={isSubmitted ? columnPostSubmit : columnPreSubmit} getTrProps={getTrProps} />
            </div>
          </div>
          <InPageLoading isLoading={isLoading} text={loadingText} />
          <Footer />
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
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global, sampleIdentificationReducers: { receiveSample } }, ownProps) => ({
  ...ownProps,
  ...receiveSample,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = {
  receiveSampleFilterAction: receiveSampleFilter,
  receiveValidateBarcodeAction: receiveValidateBarcode,
  resetReceiveSampleReducerAction: resetReceiveSampleReducer,
  rejectSampleAction: rejectSample,
  acceptUrgentSampleAction: acceptUrgentSample,
  reacceptSampleAction: reacceptSample,
  submitReceivedSamplesAction: submitReceivedSamples,
  selectSampleAction,
  getMastercodeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReceiveSample));
