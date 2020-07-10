import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import JSZip from 'jszip';

import CustomModal from 'components/common/modal';
import SearchableCheckList from 'components/common/searchable-check-list';

import { autoGenerateDownloadLinkWithBlob } from 'utils';

const FileTemplates = () => {
  const [modalState, setModalState] = useState({ open: false, data: {} });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const files = [
    'Bulk Update Chikugunya.xlsx',
    'Bulk Update Dengue.xlsx',
    'Bulk Update Zika.xlsx',
    'Chikugunya Confirmed Cases.xlsx',
    'Chikugunya Suspected Cases.xlsx',
    'Dengue Confirmed Cases.xlsx',
    'Dengue Suspected Cases.xlsx',
    'Fogging Findings.xlsx',
    'Fogging Schedule.xlsx',
    'Leptospirosis Confirmed Cases.xlsx',
    'Leptospirosis Suspected Cases.xlsx',
    'Malaria Confirmed Cases.xlsx',
    'Malaria Suspected Cases.xlsx',
    'Murine Typhus Confirmed Cases.xlsx',
    'Murine Typhus Suspected Cases.xlsx',
    'Ops Area Triggered Block.xlsx',
    'PCO Schedule.xlsx',
    'Rodent Audit Base Findings.xlsx',
    'Rodent Audit Daily Deployment.xlsx',
    'Rodent Audit Daily Report.xlsx',
    'Rodent Audit Feedback Findings.xlsx',
    'Rodent Audit Feedback Report.xlsx',
    'Rodent Audit Manpower List.xlsx',
    'Rodent Audit Operational Schedule.xlsx',
    'Rodent Audit Optional Findings.xlsx',
    'Zika Confirmed Cases.xlsx',
    'Zika Suspected Cases.xlsx',
  ];

  const onDownload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select file(s) to download.');
    } else {
      const zip = new JSZip();

      // eslint-disable-next-line import/no-dynamic-require
      const list = selectedFiles.map((fileName) => fetch(require(`assets/file-templates/${fileName.value}`)).then((r) => r.blob()));
      const fileNames = await Promise.all(list);
      fileNames.map((blob, index) => zip.folder('File Templates').file(selectedFiles[index].value, blob));

      zip.generateAsync({ type: 'blob' }).then((blob) => autoGenerateDownloadLinkWithBlob('File Templates.zip', blob));
    }
  };

  return (
    <>
      {/* <div className="tabsContainer"> */}
      <button type="button" className="btn btn-pri" onClick={() => setModalState({ open: true })}>
        Download File Templates
      </button>
      {/* </div> */}
      <CustomModal
        isOpen={modalState.open}
        type="action-modal"
        headerTitle="File Templates"
        cancelTitle="Close"
        onCancel={() => setModalState({ open: false })}
        confirmTitle="Download"
        onConfirm={onDownload}
        size="lg"
        content={<SearchableCheckList options={files.map((item) => ({ label: item, value: item }))} placeholder="Select" onChange={(list) => setSelectedFiles(list)} />}
      />
    </>
  );
};

const mapStateToProps = (_reducers, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FileTemplates));
