import React, { Component } from 'react';
import { Modal } from 'reactstrap';
import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';

import './style.scss';

class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderActionModal = () => {
    const { headerTitle, content, confirmTitle, onConfirm, cancelTitle, onCancel, bodyClassName } = this.props;
    return (
      <div className="action-modal shadow-sm">
        <div className="modal-header">
          <p className="mb-0 pl-4 pt-4 bold-font title">{headerTitle}</p>
          <button type="button" className="close" aria-label="Close" onClick={onCancel}>
            <CloseIcon style={{ height: '40px', width: '40px', display: 'block' }} />
          </button>
        </div>
        <div className="modal-body">
          <div className={`${bodyClassName}`}>
            {/* <p className="mb-4 bold-font title">{headerTitle}</p> */}
            {content && content}
          </div>
        </div>
        <div className="modal-footer justify-content-center">
          {cancelTitle && (
            <button type="button" className="btn btn-sec" onClick={onCancel}>
              {cancelTitle}
            </button>
          )}
          {confirmTitle && (
            <button type="submit" className="btn btn-pri" onClick={onConfirm}>
              {confirmTitle}
            </button>
          )}
        </div>
      </div>
    );
  };

  renderSystemModal = () => {
    const { headerTitle, content, confirmTitle, onConfirm, cancelTitle, onCancel } = this.props;
    return (
      <div className="system-modal shadow-sm">
        <div className="modal-header">
          <button type="button" className="close" aria-label="Close" onClick={onCancel}>
            <CloseIcon style={{ height: '40px', width: '40px', display: 'block' }} />
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-title bold-font title text-center">{headerTitle}</p>
          <p className="text-center">{content}</p>
        </div>
        <div className="modal-footer justify-content-center mb-4">
          {cancelTitle && (
            <button type="button" className="btn btn-sec" onClick={onCancel}>
              {cancelTitle}
            </button>
          )}
          {confirmTitle && (
            <button type="submit" className="btn btn-pri" onClick={onConfirm}>
              {confirmTitle}
            </button>
          )}
        </div>
      </div>
    );
  };

  renderInfoModal = () => {
    const { onCancel, content } = this.props;
    return (
      <div className="info-modal shadow-sm">
        <div className="modal-header">
          <button type="button" className="close" aria-label="Close" onClick={onCancel}>
            <CloseIcon style={{ height: '40px', width: '40px', display: 'block' }} />
          </button>
        </div>
        <div className="modal-body">
          {content ? (
            <>{content}</>
          ) : (
            <div className="container marginBottom30">
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-group">
                    <li className="list-group-item">
                      <div className="legendValue text-blue">AC</div>
                      <span className="text-black bold-font">Accessible</span>
                    </li>
                    <li className="list-group-item">
                      <div className="legendValue text-dark-red">IR</div>
                      <span className="text-black bold-font">Refused Entry</span>
                    </li>
                    <li className="list-group-item">
                      <div className="legendValue text-green">IL</div>
                      <span className="text-black bold-font">Locked</span>
                    </li>
                    {/* <li className="list-group-item">
                      <div className="legendValue text-orange">VC</div>
                      <span className="text-black bold-font">Vacant</span>
                    </li> */}
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-group">
                    <li className="list-group-item">
                      <div className="legendValue w-30 text-red">
                        <small>BR</small>
                      </div>
                      <span className="text-black bold-font">Breeding</span>
                    </li>
                    <li className="list-group-item">
                      <div className="legendValue w-30 text-red">
                        <small>T</small>
                      </div>
                      <span className="text-black bold-font">Treated</span>
                      <small className="remarks">(with at least ie preventive measure such as ULV Spraying, Mozzie, Zap, etc)</small>
                    </li>
                    <li className="list-group-item">
                      <div className="legendValue w-30 text-red">
                        <small>CL</small>
                      </div>
                      <span className="text-black bold-font">Call Letter</span>
                      <small className="remarks" />
                    </li>
                    <li className="list-group-item">
                      <div className="legendValue w-30 text-red">
                        <small>S35</small>
                      </div>
                      <span className="text-black bold-font">Section 35</span>
                      <small className="remarks" />
                    </li>
                    <li className="list-group-item">
                      <div className="legendValue w-30 text-red">
                        <small>S35R</small>
                      </div>
                      <span className="text-black bold-font">Section 35 Reminder</span>
                      <small className="remarks" />
                    </li>
                    <li className="list-group-item">
                      <div className="legendValue w-30 text-red">
                        <small>S36</small>
                      </div>
                      <span className="text-black bold-font">Section 36</span>
                      <small className="remarks" />
                    </li>
                    <li className="list-group-item">
                      <div className="legendValue w-30 text-red">
                        <small>VC</small>
                      </div>
                      <span className="text-black bold-font">Vacant</span>
                      <small className="remarks" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  renderModal = () => {
    const { onCancel, content } = this.props;
    return (
      <div className="shadow-sm">
        <div className="modal-header">
          <button type="button" className="close" aria-label="Close" onClick={onCancel}>
            <CloseIcon style={{ height: '40px', width: '40px', display: 'block' }} />
          </button>
        </div>
        <div className="modal-body">{content}</div>
      </div>
    );
  };

  render() {
    const { className, type, isOpen, onCancel, size } = this.props;
    const modalClass = type !== 'action-modal' ? `${className} modal-dialog-centered` : className;
    return (
      <Modal isOpen={isOpen} toggle={onCancel} className={modalClass} size={size}>
        {type === 'action-modal' && this.renderActionModal()}
        {type === 'system-modal' && this.renderSystemModal()}
        {type === 'info-modal' && this.renderInfoModal()}
        {!type && this.renderModal()}
      </Modal>
    );
  }
}

export default CustomModal;
