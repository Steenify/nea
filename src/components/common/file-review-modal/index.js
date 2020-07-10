import React, { useState } from 'react';

import { Document, Page, pdfjs } from 'react-pdf';

import CustomModal from 'components/common/modal';
import Paging from 'components/common/pagination';

import { base64ToUInt8Array } from 'utils';

import './style.scss';

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdfjs-dist/build/pdf.worker.min.js`;

const FilePreviewModal = ({ isOpen, file, onCancel }) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      type="info-modal"
      className="max_width_630"
      content={
        <div>
          <Document file={{ data: base64ToUInt8Array(file) }} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
            <Page pageNumber={pageNumber} />
          </Document>
          <Paging number={pageNumber - 1} totalPages={numPages} onClickPager={(number) => setPageNumber(number + 1)} />
        </div>
      }
    />
  );
};

export default FilePreviewModal;
