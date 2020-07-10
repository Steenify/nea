import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import prettySize from 'prettysize';
import { ReactComponent as AddImageIcon } from 'assets/svg/AddImage.svg';
import { ReactComponent as PlusIcon } from 'assets/svg/plus_circle.svg';
import { isEqual } from 'lodash';

import InPageLoading from 'components/common/inPageLoading';
import CheckForEncryption from 'modules/checkForEncryption';

import { getSysConfigurations, uploadFile, deleteFile, downloadFile } from 'services/file-operation';
import { actionTryCatchCreator } from 'utils';

// import './style.scss';

class DropBox extends Component {
  constructor(props) {
    super(props);
    const { fileList, fileIdList, submissionId } = props;
    let propFileList = fileList || [];
    const propFileIdList = fileIdList || [];
    if (propFileList.length === 0 && propFileIdList.length > 0) {
      propFileList = propFileIdList.map((fileId) => ({
        fileId,
        fileName: 'Loading...',
        isLoaded: false,
      }));
    }
    this.state = {
      accept: '',
      maxSingleFileSize: 0,
      maxGroupFileSize: 0,
      networkDisabled: false,
      networkErrors: [],
      fileList: propFileList,
      fileIdList: propFileIdList,
      isLoading: false,
      isConfigLoaded: false,
      submissionId,
      // * Used for checking encryption
      pendindFiles: [],
      encryptionRequired: false,
      // password: '',
    };
    this.dropRef = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.fileIdList, prevState.fileIdList)) {
      return { fileIdList: nextProps.fileIdList, fileList: nextProps.fileIdList?.length === 0 ? [] : prevState.fileList };
    }
    if (!isEqual(nextProps.fileList, prevState.fileList) && nextProps.fileList) {
      return { fileList: nextProps.fileList, fileIdList: nextProps.fileList?.length === 0 ? [] : prevState.fileIdList };
    }
    return null;
  }

  componentDidMount() {
    const div = this.dropRef.current;
    div.addEventListener('dragenter', this.handleDragIn);
    div.addEventListener('dragleave', this.handleDragOut);
    div.addEventListener('dragover', this.handleDrag);
    div.addEventListener('drop', this.handleDrop);

    this.getFileSysConfigurations();
    this.getPreviousFile();
  }

  componentDidUpdate(prevProps, prevState) {
    const { fileIdList } = this.state;
    if (!isEqual(fileIdList, prevState.fileIdList)) {
      this.getPreviousFile();
    }
  }

  componentWillUnmount() {
    this.isComponentUnmounting = true;
    const div = this.dropRef.current;
    div.removeEventListener('dragenter', this.handleDragIn);
    div.removeEventListener('dragleave', this.handleDragOut);
    div.removeEventListener('dragover', this.handleDrag);
    div.removeEventListener('drop', this.handleDrop);
  }

  handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
    // }
  };

  handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // this.setState({ dragging: false });
  };

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.setState({ pendindFiles: Array.from(e.dataTransfer.files) });
      setTimeout(() => {
        this.passwordModalRef.showPasswordModal('file(s)');
      }, 500);

      // Array.from(e.dataTransfer.files).map((file) => this.onUploadFiles(file));
      // e.dataTransfer.clearData();
    }
  };

  handleChangeFiles = (e) => {
    e.preventDefault();
    this.setState({ pendindFiles: Array.from(e.target.files) });
    setTimeout(() => {
      this.passwordModalRef.showPasswordModal('file(s)');
    }, 500);

    // Array.from(e.target.files).map((file) => this.onUploadFiles(file));
    e.target.value = null;
  };

  checkForPassword = async (password) => {
    const { pendindFiles } = this.state;
    return Promise.all(pendindFiles.map((file) => this.onUploadFiles(file, password)));
  };

  getPreviousFile = () => {
    const { fileIdList } = this.state;
    if (fileIdList && fileIdList.length > 0) {
      fileIdList.forEach((fileId) => {
        this.downloadPreviousFile(fileId);
      });
    }
  };

  downloadPreviousFile = async (fileId) => {
    const { fileList } = this.state;
    const { status, data } = await downloadFile({ fileId }).request;

    let downloadedFile = {
      fileId,
      fileName: `Unable to load file with ID: ${fileId}.`,
      fileData: [],
      file: {},
      isLoaded: true,
    };

    if (status === 200) {
      if (data.status === 'Pass') {
        downloadedFile = {
          fileId,
          fileName: data.fileName,
          fileData: data.fileData,
          file: {},
          isLoaded: true,
        };
      } else {
        downloadedFile = {
          fileId,
          fileName: `${data.errorMessage} for file ID: ${fileId}.`,
          fileData: [],
          file: {},
          isLoaded: true,
        };
      }
    }
    const index = fileList.findIndex((file) => file.fileId === fileId);
    if (index >= 0) {
      fileList[index] = downloadedFile;
    } else {
      fileList.push(downloadedFile);
    }
    if (!this.isComponentUnmounting) this.setState({ fileList });
  };

  getFileSysConfigurations = async () => {
    const { submissionType, submissionId } = this.props;
    const { status, data } = await getSysConfigurations({
      submissionType,
      submissionId,
    });

    let result = {
      networkDisabled: true,
      networkErrors: data.errorMessage || [String(`HTTP code ${status}`)],
      isConfigLoaded: true,
    };
    if (status === 200 && data.status === 'Pass') {
      let accept = '';
      data.allowedFileTypes.forEach((item, index) => {
        const addOn = index === data.allowedFileTypes.length - 1 ? `.${item}` : `.${item}, `;
        accept += addOn;
      });
      result = {
        accept,
        maxSingleFileSize: parseFloat(data.maxSingleFileSize),
        maxGroupFileSize: parseFloat(data.maxGroupFileSize),
        isConfigLoaded: true,
        submissionId: data.submissionId,
        encryptionRequired: data.encryptionRequired,
      };
    }
    if (!this.isComponentUnmounting) this.setState(result);
  };

  getFileList = () => {
    const { fileList } = this.state;
    return fileList;
  };

  getState = () => this.state;

  onUploadFiles = async (selectedFile, password) => {
    const { fileList, fileIdList = [], maxSingleFileSize, maxGroupFileSize, accept } = this.state;
    const { submissionType, onChange, fileStatus, maxQuantity } = this.props;
    const { submissionId } = this.state;
    // const selectedFile = files[0];
    if (!accept.includes(selectedFile?.name.split('.').pop())) {
      toast.error(`Invalid file type. The acceptable file types are: ${accept}.`);
      return;
    }
    if (!selectedFile.name.match(/^[\w\s-]+\.[A-Za-z]{3,}$/g)) {
      toast.error(`${selectedFile.name}: File name cannot contains special characters.`);
      return;
    }
    if (selectedFile.size > maxSingleFileSize) {
      toast.error(`${selectedFile.name} exceeded the maximum file size. Maximum single file size allowed: ${prettySize(maxSingleFileSize)}.`);
      return;
    }

    if (fileList.length > 0) {
      const currentTotalFileSize = fileList.map((item) => item.file?.size || 0).reduce((total, current) => total + current) + selectedFile.size;
      if (currentTotalFileSize > maxGroupFileSize) {
        toast.error(`${selectedFile.name} exceeded the maximum group size. Maximum group file size allowed: ${prettySize(maxGroupFileSize)}.`);
        return;
      }
    }

    const file = new Blob([selectedFile]);
    const formData = new FormData();
    formData.append('file', file, selectedFile.name);
    formData.append('fileStatus', fileStatus || '');
    formData.append('submissionType', submissionType);
    formData.append('submissionId', submissionId);
    if (password) formData.append('password', password);

    await actionTryCatchCreator(
      uploadFile(formData),
      () => this.setState({ isLoading: true }),
      (data) => {
        this.setState({ isLoading: false });
        if (maxQuantity === fileList.length) {
          fileList.splice(0, 1);
          fileIdList.splice(0, 1);
        }

        fileIdList.push(data.fileId);
        fileList.push({
          fileId: data.fileId,
          fileName: selectedFile.name,
          file: selectedFile,
          isLoaded: true,
        });
        if (onChange) onChange(fileList);
        this.setState({
          fileList,
          fileIdList,
        });
      },
      () => this.setState({ isLoading: false }),
    );

    // try {
    //   const { status, data } = await uploadFile(formData);

    //   this.setState({
    //     isLoading: false,
    //   });

    //   if (status === 200) {
    //     if (data.status === 'Pass') {
    //       if (maxQuantity === fileList.length) {
    //         fileList.splice(0, 1);
    //         fileIdList.splice(0, 1);
    //       }

    //       fileIdList.push(data.fileId);
    //       fileList.push({
    //         fileId: data.fileId,
    //         fileName: selectedFile.name,
    //         file: selectedFile,
    //         isLoaded: true,
    //       });
    //       if (onChange) onChange(fileList);
    //       this.setState({
    //         fileList,
    //         fileIdList,
    //       });
    //       // setTimeout(() => {
    //       // }, 500);
    //     } else {
    //       const errorList = data?.errorMessage || [];
    //       errorList.forEach((error) => toast.error(error));
    //       // toast.error(data?.errorMessage?.join(', ') || '');
    //     }
    //   } else {
    //     toast.error(`HTTP code ${status}`);
    //   }
    // } catch (error) {
    //   toast.error(error.message);
    //   this.setState({ isLoading: false });
    // }
  };

  onDeleteFile = async (index) => {
    const { onChange, deleteLocally } = this.props;
    const { fileList, fileIdList } = this.state;
    const { fileId } = fileList[index];
    if (deleteLocally) {
      const temp = fileList;
      temp.splice(index, 1);
      if (onChange) onChange(temp);
      if (!this.isComponentUnmounting) {
        setTimeout(() => {
          this.setState({ fileList: temp });
        }, 500);
      }
    } else {
      actionTryCatchCreator(
        deleteFile({ fileId }),
        () => this.setState({ isLoading: true }),
        () => {
          this.setState({ isLoading: false });
          const temp1 = fileList;
          temp1.splice(index, 1);
          const temp2 = fileIdList;
          temp2.splice(index, 1);
          if (onChange) onChange(temp1);
          if (!this.isComponentUnmounting) {
            setTimeout(() => {
              this.setState({ fileList: temp1, fileIdList: temp2 });
            }, 500);
          }
        },
        () => this.setState({ isLoading: false }),
      );

      // this.setState({ isLoading: true });

      // const { status, data } = await deleteFile({ fileId });

      // this.setState({
      //   isLoading: false,
      // });

      // if (status === 200) {
      //   if (data.status === 'Pass') {
      //     const temp = fileList;
      //     temp.splice(index, 1);
      //     if (onChange) onChange(temp);
      //     if (!this.isComponentUnmounting) this.setState({ fileList: temp });
      //   } else {
      //     toast.error(data.errorMessage.join(', '));
      //   }
      // } else {
      //   toast.error(`HTTP code ${status}`);
      // }
    }
  };

  render() {
    const { fileList, networkDisabled, networkErrors, accept, isLoading, isConfigLoaded, encryptionRequired } = this.state;
    const { disabled, size, extractViews, isError, multiple = true, extractViewsClassName } = this.props;
    return (
      <div>
        <div className={`upload-drop-zone upload-drop-zone-${size} ${isError ? 'form-error' : ''}`} id="drop-zone" ref={this.dropRef}>
          <AddImageIcon className="mb-4 d-desktop-only" alt="" />
          {isConfigLoaded &&
            (networkDisabled ? (
              <div className="text-center">
                <span className="d-desktop-only">File upload is disabled due to network error:</span>
                {networkErrors.map((error, eIndex) => (
                  <span className="d-desktop-only" key={`network_error_${eIndex + 1}`}>
                    {error}
                  </span>
                ))}
              </div>
            ) : (
              <div className="d-flex drag-drop-text justify-content-center">
                <span className="d-desktop-only">Drag & Drop or</span>
                <PlusIcon className="plus-icon d-ipad-only d-mobile-only" />
                <div className="form-group">
                  <input className="m-0" type="file" name="" multiple={multiple} disabled={disabled || false} id="js-upload-files" accept={accept || 'image/*'} onChange={this.handleChangeFiles} />
                  <label htmlFor="js-upload-files" className="font-bold browse d-desktop-only">
                    Browse
                  </label>
                  <span className="font-bold browse d-ipad-only d-mobile-only">
                    Upload document
                    <span className="text-black">({accept})</span>
                  </span>
                </div>
                <span className="d-desktop-only">files to upload</span>
              </div>
            ))}
          {!isConfigLoaded && (
            <div className="text-center">
              <span className="d-desktop-only">Loading System Configuration...</span>
            </div>
          )}
        </div>
        <div className="upload-drop-zone__file mt-4 mb-4">
          <ul className="">
            {fileList &&
              fileList.map((file, index) => (
                <li className={extractViewsClassName} key={`image_upload__${index + 1}`}>
                  {`${index + 1}. ${file.fileName}`}
                  {file.isLoaded && <div className="remove-button" onClick={() => this.onDeleteFile(index)} />}
                  {extractViews && extractViews(file, index)}
                </li>
              ))}
          </ul>
        </div>
        <InPageLoading isLoading={isLoading} />
        <CheckForEncryption
          type="upload"
          encryptionRequired={encryptionRequired}
          ref={(e) => {
            this.passwordModalRef = e;
          }}
          onGenerate={this.checkForPassword}
        />
      </div>
    );
  }
}

DropBox.propTypes = {
  // fileList: PropTypes.array,
  // fileIdList: PropTypes.array,
  // submissionId: PropTypes.string,
  // submissionType: PropTypes.string,
  // onChange: PropTypes.func,
  // deleteLocally: PropTypes.bool,
  // disabled: PropTypes.bool,
  // size: PropTypes.string,
  // extractViews: PropTypes.func,
  fileStatus: PropTypes.string,
};

DropBox.defaultProps = {
  fileStatus: '',
};

export default DropBox;
