import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import InPageLoading from 'components/common/inPageLoading';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import Breadcrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import BinaryFileGallery from 'components/common/binaryImageGallery';
import GoBackButton from 'components/ui/go-back-button';
import CommonRejectModal from 'components/modals/common-reject-modal';

import { WEB_ROUTES } from 'constants/index';
import { actionTryCatchCreator } from 'utils';
import { approveInspectionNoticeService, rejectInspectionNoticeService, getApprovingInspectionNoticeService } from 'services/inspection-management/latest-block-summary';

const InsertNotice = ({ location: { state }, history }) => {
  const noticeType = state?.noticeType;
  const [isLoading, setIsLoading] = useState(false);
  const [notices, setNotices] = useState([]);
  const [remarks, setRejectionReason] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, data: null, type: null });
  const [rejectFileIds, setFileIds] = useState([]);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.APPROVING_NOTICE_DETAIL.name}`;
    if (!state) {
      history.goBack();
    } else {
      const { noticeType, blockHouseNo, postalCode } = state;
      const onPending = () => setIsLoading(true);
      const onSuccess = (data) => {
        setNotices(data?.notices || []);
        setIsLoading(false);
      };
      const onError = () => setIsLoading(false);
      actionTryCatchCreator(getApprovingInspectionNoticeService({ noticeType, blockHouseNo, postalCode }), onPending, onSuccess, onError);
    }
  }, [state, history]);

  const hideModal = () => {
    setModalState({ isOpen: false, data: null, type: null });
  };

  const approveInspectionNotice = (params) => {
    const onPending = () => setIsLoading(true);
    const onSuccess = () => {
      toast.success('Approved');
      hideModal();
      setIsLoading(false);
      history.goBack();
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(approveInspectionNoticeService(params), onPending, onSuccess, onError);
  };

  const rejectInspectionNotice = (params) => {
    if (!params?.rejectionVO?.remarks) {
      toast.error('Please enter rejection reason');
      return;
    }
    const onPending = () => setIsLoading(true);
    const onSuccess = () => {
      toast.success('Rejected');
      hideModal();
      setIsLoading(false);
      history.goBack();
    };
    const onError = () => {
      setIsLoading(false);
    };
    actionTryCatchCreator(rejectInspectionNoticeService(params), onPending, onSuccess, onError);
  };

  return (
    <>
      <Header />
      <div className="main-content">
        <NavBar active={WEB_ROUTES.MY_WORKSPACE.name} />
        <div className="contentWrapper">
          <Breadcrumb page={[WEB_ROUTES.MY_WORKSPACE, WEB_ROUTES.INSPECTION_MANAGEMENT.APPROVING_NOTICE_DETAIL]} />
          <GoBackButton title={WEB_ROUTES.INSPECTION_MANAGEMENT.APPROVING_NOTICE_DETAIL.name} onClick={history.goBack}>
            <button type="button" className="btn btn-pri m-1 ml-auto" onClick={() => approveInspectionNotice({ noticeIds: state?.noticeIds })}>
              Approve
            </button>
            <button type="button" className="btn btn-sec m-1" onClick={() => setModalState({ isOpen: true, data: { noticeIds: state?.noticeIds }, type: 'reject' })}>
              Reject
            </button>
          </GoBackButton>
          <div className="tabsContainer">
            {notices.map((notice, index) => (
              <div className="tab-content" key={`notice_${index + 1}`}>
                <div className="tab-pane__group bg-white">
                  <p className="tab-pane__title text-white">
                    Unit: {notice?.floorNo} - {notice?.unitNo}
                  </p>
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        {noticeType !== 'CL' && (
                          <div className="col-lg-6">
                            <div className="row mb-2">
                              <div className="font-weight-bold col">Name of owner/occupier</div>
                              <div className="col-7">{notice?.ownerName}</div>
                            </div>
                            <div className="row mb-2">
                              <div className="font-weight-bold col">{noticeType === 'S35' ? 'Call Letter' : noticeType === 'S35R' ? 'S35' : 'S35 Reminder'} Issued / Inserted Date</div>
                              <div className="col-7">{notice?.lastNoticeIssuedDate}</div>
                            </div>
                            <div className="row mb-2">
                              <div className="font-weight-bold col">Inspection Date</div>
                              <div className="col-7">{notice?.inspectionDate}</div>
                            </div>
                            {noticeType === 'S36' ? (
                              <>
                                <div className="row mb-2">
                                  <div className="font-weight-bold col">Authorised Officers</div>
                                  <div className="col-7">{notice?.authorisedOfficers}</div>
                                </div>
                                <div className="row mb-2">
                                  <div className="font-weight-bold col">Description of vicinity</div>
                                  <div className="col-7">{notice?.vicinity}</div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="row mb-2">
                                  <div className="font-weight-bold col">Inspection Time</div>
                                  <div className="col-7">
                                    {notice?.inspectionTimeFrom} - {notice?.inspectionTimeTo}
                                  </div>
                                </div>
                                <div className="row mb-2">
                                  <div className="font-weight-bold col">Officer Telephone Number</div>
                                  <div className="col-7">{notice?.officeTelephoneNumber}</div>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                        <div className="col-lg-6">
                          <div className="row mb-2">
                            <div className="font-weight-bold col">Latest Inspection Date</div>
                            <div className="col-7">{notice?.latestInspectionDate}</div>
                          </div>
                          <div className="row mb-2">
                            <div className="font-weight-bold col">Status</div>
                            <div className="col-7">{notice?.status}</div>
                          </div>
                          <div className="row mb-2">
                            <div className="font-weight-bold col">Reason</div>
                            <div className="col-7">{notice?.reason}</div>
                          </div>
                          <div className="row mb-2">
                            <div className="font-weight-bold col">Served Date</div>
                            <div className="col-7">{notice?.servedDate}</div>
                          </div>
                          <div className="row mb-2">
                            <div className="font-weight-bold col">Remark</div>
                            <div className="col-7">{notice?.remark}</div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        {notice?.documents && notice?.documents?.length > 0 && (
                          <div className="col-12">
                            <div className="font-weight-bold">Documents</div>
                            <BinaryFileGallery fileIdList={notice?.documents} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Footer />
          <InPageLoading isLoading={isLoading} />
          <CommonRejectModal
            isOpen={modalState.isOpen && modalState.type === 'reject'}
            onConfirm={() => rejectInspectionNotice({ ...modalState.data, rejectionVO: { remarks, rejectFileIds } })}
            onCancel={hideModal}
            onTextChange={setRejectionReason}
            setFileIds={setFileIds}
          />
        </div>
      </div>
    </>
  );
};
const mapStateToProps = () => ({});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InsertNotice));
