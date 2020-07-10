import React from 'react';
import DataTable from 'components/common/data-table';

const sectionRequestColumn = [
  {
    Header: 'Inspection ID',
    accessor: 'inspectionId',
  },
  {
    Header: 'S/No.',
    accessor: 'serialNo',
  },
  {
    Header: 'Barcode ID',
    accessor: 'barcodeId',
  },
  {
    Header: 'Species',
    accessor: 'species',
  },
  {
    Header: 'Vector of Disease',
    accessor: 'vectorOfDisease',
  },
  {
    Header: 'Specimen Stage',
    accessor: 'specimenStage',
  },
];
const Form3SamplesTab = props => {
  const { samples, specimen, enforceable } = props;
  return (
    <DataTable
      data={samples}
      columns={sectionRequestColumn}
      title={`Specimen: ${specimen || ''}`}
      rightTitle={`Enforceable : ${enforceable}`}
      showListHidden
    />
  );
};
export default Form3SamplesTab;
