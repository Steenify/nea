import React, { useState } from 'react';
import DataTable from 'components/common/data-table';
import { tableColumnWidth } from 'constants/index';
import BinaryFileGallery from 'components/common/binaryImageGallery';
import CustomModal from 'components/common/modal';

const BaseTypeContractorFindings = (props) => {
  const { contractorsFindings } = props;

  const [modalState, setModalState] = useState({ open: false, fileList: [] });

  const columns = [
    {
      Header: 'Location',
      accessor: 'address',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Findings',
      accessor: 'findings',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Findings Date',
      accessor: 'findingsDate',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Number of Burrows',
      accessor: 'noOfBurrows',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Number of Defects',
      accessor: 'noOfDefects',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Habitat/Location of findings',
      accessor: 'habitat',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Remarks/Action Taken',
      accessor: 'remarks',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Photos',
      accessor: 'photos',
      minWidth: tableColumnWidth.md,
      Cell: (cellInfo) =>
        cellInfo.original?.fileList.length > 0 ? (
          <button type="button" className="btn btn-sec" onClick={() => setModalState({ open: true, fileList: cellInfo.original?.fileList })}>
            View Photos
          </button>
        ) : (
          <></>
        ),
    },
  ];

  return (
    <div className="tab-pane__group bg-white">
      <p className="tab-pane__title text-white">Contractor's Findings</p>
      <div className="card">
        <div className="card-body">
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">Regional Office</div>
            <div className="col-md-9 col-lg-4">{contractorsFindings?.ro}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">Recorded By</div>
            <div className="col-md-9 col-lg-4">{contractorsFindings?.recordedBy}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">Ref</div>
            <div className="col-md-9 col-lg-4">{contractorsFindings?.ref}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3 col-lg-3 font-weight-bold">Date</div>
            <div className="col-md-9 col-lg-4">{contractorsFindings?.recordedDate}</div>
          </div>

          <div className="row mb-2">
            <div className="col-12">
              <DataTable data={contractorsFindings?.contractorFindingsList || []} columns={columns} />
            </div>
          </div>
        </div>
      </div>
      <CustomModal
        bodyClassName="is-reject-form"
        headerTitle="Photos"
        cancelTitle="Close"
        isOpen={modalState?.open}
        onCancel={() => setModalState({ open: false, fileList: [] })}
        type="action-modal"
        content={<BinaryFileGallery fileIdList={modalState?.fileList} />}
      />
    </div>
  );
};

export default BaseTypeContractorFindings;
