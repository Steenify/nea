import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as Formik from 'formik';

import ValidationField from 'components/common/formik/validationField';
import BinaryFileGallery from 'components/common/binaryImageGallery';
import DropBox from 'components/common/dropbox';
import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import moment from 'moment';
import { FUNCTION_NAMES } from 'constants/index';

const StatementOfcer = (props) => {
  const {
    //
    isEditing,
    masterCodes,
    getMastercodeAction,
    formik: {
      values: { sof },
      setFieldValue,
    },
  } = props;
  const isEditable = sof?.isEditable || false;
  const habitatInfos = sof?.habitatInfos || [];
  // const witnessRelationshipLOV = masterCodes[MASTER_CODE.WITNESS_RELATIONSHIP] || [];
  const vectorTypeLOV = masterCodes[MASTER_CODE.SPECIMEN_CODE] || [];
  // const witnessIdTypeLOV = masterCodes[MASTER_CODE.ID_TYPE] || [];

  useEffect(() => {
    getMastercodeAction([MASTER_CODE.WITNESS_RELATIONSHIP, MASTER_CODE.ID_TYPE, MASTER_CODE.SPECIMEN_CODE]);
  }, [getMastercodeAction]);

  const detectedVectorType = vectorTypeLOV.find((type) => type.value === sof?.officerInfo?.vectorType)?.label || sof?.officerInfo?.vectorType;

  const renderReadonlyOfficerInfo = () => {
    const { inspectionTime, inspectionDate, breedingLocation, witnessRelationship, witnessName, witnessId, breedingOrDropping, modeOfDisclosure } = sof?.officerInfo || {};
    if (witnessId) {
      return (
        <>
          On <u className="font-weight-bold">{inspectionDate}</u>, at about <u className="font-weight-bold">{inspectionTime}</u>, I was deployed to carry out vector control survey at{' '}
          <u className="font-weight-bold">{breedingLocation}</u> and I detected <u className="font-weight-bold">{detectedVectorType}</u> {breedingOrDropping}. The {breedingOrDropping} was shown to the{' '}
          <u className="font-weight-bold">{witnessRelationship}</u>
          {', '}
          <u className="font-weight-bold">{witnessName}</u>
          {', ID No. '}
          <u className="font-weight-bold">{witnessId}</u>
          {'. The identification details were '}
          <u className="font-weight-bold">{modeOfDisclosure}</u>.
        </>
      );
    }
    return (
      <>
        On <u className="font-weight-bold">{inspectionDate}</u>, at about <u className="font-weight-bold">{inspectionTime}</u>, I was deployed to carry out vector control survey at{' '}
        <u className="font-weight-bold">{breedingLocation}</u> and I detected <u className="font-weight-bold">{detectedVectorType}</u> {breedingOrDropping}. The {breedingOrDropping} was shown to the{' '}
        <u className="font-weight-bold">{witnessRelationship}</u>
        {', '}
        <u className="font-weight-bold">{witnessName}</u>.
      </>
    );
    // return
    // <>
    //   On <u className="font-weight-bold">{inspectionDate}</u>, at about <u className="font-weight-bold">{inspectionTime}</u>, I was deployed to <u className="font-weight-bold">{breedingLocation}</u>{' '}
    //   and detected <u className="font-weight-bold">{detectedVectorType}</u>. The sample was shown to the{' '}
    //   <u className="font-weight-bold">
    //     {witnessRelationship}, {witnessName}, {witnessIdType} {witnessId}
    //   </u>{' '}
    //   {sof?.modeOfDisclosure && (
    //     <>
    //       <br />
    //       <br />
    //       {sof?.modeOfDisclosure === 'PS' && 'Physically seen.'}
    //       {sof?.modeOfDisclosure === 'VG' && 'Verbally given.'}
    //     </>
    //   )}
    // </>;
  };

  // const renderEditableOfficerInfo = () => (
  //   <>
  //     <div className="d-inline-flex flex-wrap align-items-center">
  //       <label className="m-1">On</label>
  //       <ValidationField
  //         name="sof.officerInfo.inspectionDate"
  //         placeholder="Date"
  //         inputClassName="d-inline m-1"
  //         inputComponent="singleDatePicker"
  //         hideError
  //       />
  //       <label className="m-1">, at about</label>
  //       <ValidationField
  //         name="sof.officerInfo.inspectionTime"
  //         placeholder="Time"
  //         inputClassName="d-inline wf-150 "
  //         inputComponent="timePicker"
  //         hideError
  //       />
  //       <label className="m-1">, I was deployed to carry out vector control survey at</label>
  //       <ValidationField
  //         name="sof.officerInfo.breedingLocation"
  //         placeholder="(exact breeding location)"
  //         inputClassName="d-inline wf-400 m-1 hf-48"
  //         hideError
  //       />
  //       <label className="m-1">and I detected</label>
  //       <u className="font-weight-bold">{detectedVectorType}</u>
  //       {/* <ValidationField
  //         name="sof.officerInfo.vectorType"
  //         inputComponent="react-select"
  //         selectClassName="d-inline-block wf-400 m-1"
  //         placeholder="Vector Type"
  //         options={vectorTypeLOV}
  //         hideError
  //       /> */}
  //       <label>.</label>
  //       <br />
  //     </div>

  //     <div className="d-inline-flex flex-wrap align-items-center">
  //       <label className="m-1">The sample was shown to the</label>

  //       <ValidationField
  //         name="sof.officerInfo.witnessRelationship"
  //         placeholder="Witness Relationship"
  //         inputComponent="react-select"
  //         selectClassName="d-inline-block wf-300 m-1"
  //         options={witnessRelationshipLOV}
  //         hideError
  //       />
  //       <label className="m-1">,</label>
  //       <div className="d-inline-block wf-400 m-1">
  //         <ValidationField
  //           name="sof.officerInfo.witnessName"
  //           placeholder="Witness Name"
  //           inputClassName="hf-48"
  //           hideError
  //         />
  //       </div>
  //       <label className="m-1">,</label>
  //       {/* <u className="font-weight-bold">{sof?.officerInfo?.witnessIdType}</u> */}
  //       <ValidationField
  //         name="sof.officerInfo.witnessIdType"
  //         placeholder="Witness ID Type"
  //         inputComponent="react-select"
  //         selectClassName="d-inline-block wf-300 hf-48 m-1"
  //         options={witnessIdTypeLOV}
  //         hideError
  //       />
  //       <div className="d-inline-block wf-200 m-1">
  //         <ValidationField
  //           name="sof.officerInfo.witnessId"
  //           placeholder="Witness ID"
  //           inputClassName=" hf-48"
  //           hideError
  //         />
  //       </div>
  //       <label>.</label>
  //     </div>
  //   </>
  // );

  let fileIDs = [];
  if (sof?.uploadedFileIds?.length > 0) {
    fileIDs = sof?.uploadedFileIds;
  } else if (sof?.uploadedFiles?.length > 0) {
    fileIDs = sof?.uploadedFiles?.map((file) => file.fileId);
  }

  return (
    <>
      <div className="tab-pane__group bg-white">
        <p className="tab-pane__title text-bold text-white">Officer Information</p>
        <div className="card">
          <div className="card-body">
            <div>
              <div className="row paddingBottom10">
                <div className="col-md-4 col-lg-3 font-weight-bold">Name of Officer</div>
                <div className="col-md-4 col-lg-3">{sof?.officerInfo?.officerName}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-md-4 col-lg-3 font-weight-bold">NRIC</div>
                <div className="col-md-4 col-lg-3">{sof?.officerInfo?.officerId}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-md-4 col-lg-3 font-weight-bold">Designation</div>
                <div className="col-md-4 col-lg-3">{sof?.officerInfo?.designation}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-md-4 col-lg-3 font-weight-bold">Regional Office</div>
                <div className="col-md-4 col-lg-3">{sof?.officerInfo?.regionOffice}</div>
              </div>
              <div className="row paddingBottom10">
                <div className="col-md-4 col-lg-3 font-weight-bold">Constituency in Charge</div>
                <div className="col-md-4 col-lg-3">{sof?.officerInfo?.division}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="paddingBottom30">
        <div className="col-md-12">
          {/* {isEditing ? renderEditableOfficerInfo() : renderReadonlyOfficerInfo()} */}
          {renderReadonlyOfficerInfo()}
          <br />
          <br />
          Details of breeding detected are as follow:
        </div>
      </div>
      <div className="tab-pane__group bg-white">
        <p className="tab-pane__title text-bold text-white">Habitat Information</p>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <div className="">
                  <div className="tblCompo habitatTbl">
                    <table>
                      <thead>
                        <tr className="tbl-headings">
                          <th align="left" valign="middle" className="col1">
                            S/No
                          </th>
                          <th align="left" valign="middle" className="col2">
                            Habitat Type
                          </th>
                          <th align="left" valign="middle" className="col4">
                            Habitat Size
                          </th>
                          <th align="left" valign="middle" className="col4">
                            Location
                          </th>
                          <th align="center" valign="middle" colSpan="2" className="col5 text-center">
                            Density
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {habitatInfos.map((habitat, hIndex) => (
                          <tr key={`habitat_table_row_${hIndex + 1}`}>
                            <td align="left" valign="middle" className="text-blue">
                              {habitat?.serialNo}
                            </td>
                            <td align="left" valign="middle">
                              {habitat?.habitatType}
                            </td>
                            <td align="left" valign="middle">
                              {habitat?.habitatSize}
                            </td>
                            <td align="left" valign="middle">
                              {habitat?.locationBreeding}
                            </td>
                            <td align="left" valign="middle">
                              {habitat?.densityInContainer && `${habitat?.densityInContainer} in Container`}
                            </td>
                            <td align="left" valign="middle">
                              {habitat?.densityPerDip && `${habitat?.densityPerDip} per Dip`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tab-pane__group bg-white">
        <p className="tab-pane__title text-bold text-white">Remarks</p>
        <div className="card">
          <div className="card-body">
            <div className="row">
              {isEditing && isEditable && (
                <>
                  <div className="col-md-6">
                    <ValidationField name="sof.remarks" placeholder="Remarks" inputComponent="textarea" rows={7} />
                  </div>
                  <div className="col-md-6">
                    <DropBox
                      size="sm"
                      submissionType="SOF"
                      fileIdList={fileIDs}
                      functionName={FUNCTION_NAMES.statement}
                      deleteLocally
                      onChange={(fileList) =>
                        setFieldValue(
                          'sof.uploadedFileIds',
                          fileList.map((file) => file.fileId),
                        )
                      }
                    />
                  </div>
                </>
              )}
              {!(isEditing && isEditable) && (
                <>
                  <div className="col-md-6">
                    <ValidationField name="sof.remarks" placeholder="Remarks" inputComponent="textarea" rows={7} disabled />
                  </div>
                  <div className="col-md-6">
                    <BinaryFileGallery fileIdList={fileIDs} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="col-md-12">
          <strong>
            The above statement is true to the best of my knowledge and belief. I understand that if the statement will be tendered in evidence, I will be liable to prosecution if I have willfully
            stated anything which I know to be false or does not believe to be true.
          </strong>
        </div>
      </div>
      <div>
        <div className="paddingBottom30 paddingTop20">
          <div className="col-md-2">Date of Statement</div>
          <div className="col-md-4">
            {isEditing && isEditable ? (
              <ValidationField
                name="sof.dateOfStatement"
                placeholder="DD/MM/YYYY"
                inputComponent="singleDatePickerV2"
                minDate={moment(sof?.officerInfo?.inspectionDate, 'DD/MM/YYYY')}
                maxDate={moment()}
                inputClassName="mt-2 mr-2 xs-paddingBottom15"
              />
            ) : (
              <strong>{sof?.dateOfStatement}</strong>
            )}
          </div>
        </div>
      </div>
      {/* {sof?.dateOfStatement && (isEditing || sof?.dateOfAmendment) && (
        <div className="tab-pane__group bg-white">
          <p className="tab-pane__title text-bold text-white">Reason for Amendment</p>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <ValidationField
                    name="sof.reasonForAmendment"
                    placeholder="Reason For Amendment"
                    inputComponent="textarea"
                    disabled={!(isEditing && isEditable)}
                  />
                </div>
              </div>
              <div>
                <div className="row paddingTop40">
                  <div className="col-md-3">Date of Amendment</div>
                  <div className="col-md-3">
                    <strong>
                      {sof?.dateOfAmendment} {isEditing && isEditable && "(today's date)"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

const mapStateToProps = ({ global }) => ({
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = { getMastercodeAction };

export default connect(mapStateToProps, mapDispatchToProps)(Formik.connect(StatementOfcer));
