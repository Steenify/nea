import React, { useState } from 'react';
import { ErrorMessage, connect, getIn } from 'formik';

import ValidationField from 'components/common/formik/validationField';
import AddButton from 'components/common/add-button';
import DropBox from 'components/common/dropbox';
import BinaryFileGallery from 'components/common/binaryImageGallery';

const AdditionalInfo = (props) => {
  const {
    isEditing,
    formik: { errors, values, setFieldValue },
  } = props;

  const defaultEditingRemarks = [];

  if (values?.additionalInfo?.elderResidentsRemark) {
    defaultEditingRemarks.push('additionalInfo.elderResidentsRemark');
  }
  if (values?.additionalInfo?.maidDomesticHelperRemark) {
    defaultEditingRemarks.push('additionalInfo.maidDomesticHelperRemark');
  }
  if (values?.additionalInfo?.otherOccupantsRemark) {
    defaultEditingRemarks.push('additionalInfo.otherOccupantsRemark');
  }
  if (values?.additionalInfo?.personWithDisabilitiesRemark) {
    defaultEditingRemarks.push('additionalInfo.personWithDisabilitiesRemark');
  }
  if (values?.additionalInfo?.hoardingIssuesRemark) {
    defaultEditingRemarks.push('additionalInfo.hoardingIssuesRemark');
  }
  if (values?.additionalInfo?.housekeepingIssuesRemark) {
    defaultEditingRemarks.push('additionalInfo.housekeepingIssuesRemark');
  }

  const [editingRemarks, setEditingRemarks] = useState(defaultEditingRemarks);
  const isEditable = values?.additionalInfo?.isEditable;

  let fileIDs = [];
  if (values?.additionalInfo?.uploadedFileIds?.length > 0) {
    fileIDs = values?.additionalInfo?.uploadedFileIds;
  } else if (values?.additionalInfo?.uploadedFiles?.length > 0) {
    fileIDs = values?.additionalInfo?.uploadedFiles?.map((file) => file.fileId);
  }

  const renderRemark = (name, value) => {
    if (isEditing && isEditable) {
      if (editingRemarks.includes(name)) {
        return (
          <>
            <div className="bold-text">Remarks</div>
            <div>
              <ValidationField name={name} placeholder="Remarks" inputComponent="textarea" hideError />
              <div className="col-form-error-label">{getIn(errors, name)}</div>
            </div>
          </>
        );
      }
      return (
        <>
          <AddButton title="Add Remarks" onClick={() => setEditingRemarks([...editingRemarks, name])} />
          <div className="col-form-error-label">{getIn(errors, name)}</div>
        </>
      );
    }
    return value && value !== '' ? (
      <>
        <div className="bold-text">Remarks</div>
        <div>{value}</div>
      </>
    ) : (
      <></>
    );
  };

  const renderRadioGroup = (name) => (
    <>
      <div className="col-md-5 col-lg-5 col-3">
        <div className="custom-radio">
          <ValidationField type="radio" id={`${name}_yes`} name={name} disabled={!(isEditing && isEditable)} value hideError />
          <label className="form-label" htmlFor={`${name}_yes`}>
            Yes
          </label>
        </div>
      </div>
      <div className="col-md-5 col-lg-5 col-3">
        <div className="custom-radio">
          <ValidationField type="radio" id={`${name}_no`} name={name} disabled={!(isEditing && isEditable)} value={false} hideError />
          <label className="form-label" htmlFor={`${name}_no`}>
            No
          </label>
        </div>
      </div>
    </>
  );

  const AdditionalInfos = [
    {
      label: 'Elder residents',
      name: 'additionalInfo.isElderResidents',
      remarkName: 'additionalInfo.elderResidentsRemark',
      value: values?.additionalInfo?.isElderResidents,
      remarkValue: values?.additionalInfo?.elderResidentsRemark,
    },
    {
      label: 'Maid/ domestic helper',
      name: 'additionalInfo.isMaidDomesticHelper',
      remarkName: 'additionalInfo.maidDomesticHelperRemark',
      value: values?.additionalInfo?.isMaidDomesticHelper,
      remarkValue: values?.additionalInfo?.maidDomesticHelperRemark,
    },
    {
      label: 'Other occupants',
      name: 'additionalInfo.isOtherOccupants',
      remarkName: 'additionalInfo.otherOccupantsRemark',
      value: values?.additionalInfo?.isOtherOccupants,
      remarkValue: values?.additionalInfo?.otherOccupantsRemark,
    },
    {
      label: 'Person(s) with disabilities',
      name: 'additionalInfo.isPersonWithDisabilities',
      remarkName: 'additionalInfo.personWithDisabilitiesRemark',
      value: values?.additionalInfo?.isPersonWithDisabilities,
      remarkValue: values?.additionalInfo?.personWithDisabilitiesRemark,
    },
    {
      label: 'Hoarding issues',
      name: 'additionalInfo.isHoardingIssues',
      remarkName: 'additionalInfo.hoardingIssuesRemark',
      value: values?.additionalInfo?.isHoardingIssues,
      remarkValue: values?.additionalInfo?.hoardingIssuesRemark,
    },
    {
      label: 'Housekeeping issues',
      name: 'additionalInfo.isHousekeepingIssues',
      remarkName: 'additionalInfo.housekeepingIssuesRemark',
      value: values?.additionalInfo?.isHousekeepingIssues,
      remarkValue: values?.additionalInfo?.housekeepingIssuesRemark,
    },
  ];

  return (
    <>
      <div className="tab-pane__group bg-white">
        <p className="tab-pane__title text-bold text-white">Additional Information</p>
        <div className="card">
          <div className="card-body">
            {AdditionalInfos.map((info, index) => (
              <div className="remarksCont bg-white" key={`additional_info_${index + 1}`}>
                <div className="row">
                  <div className="col-md-6 col-lg-3 bold-text">
                    {info.label}
                    <ErrorMessage className="col-form-error-label" name={info.name} component="div" />
                  </div>
                  <div className="col-md-6 col-lg-2 xs-paddingBottom10 xs-paddingTop10">
                    <div className="row">{renderRadioGroup(info.name)}</div>
                  </div>
                  <div className="col-md-12 col-lg-7">{renderRemark(info.remarkName, info.remarkValue)}</div>
                </div>
              </div>
            ))}

            {isEditing && isEditable && (
              <DropBox
                size="sm"
                submissionType="SOF"
                fileIdList={fileIDs}
                deleteLocally
                onChange={(fileList) => {
                  setFieldValue(
                    'additionalInfo.uploadedFileIds',
                    fileList.map((file) => file.fileId),
                  );
                }}
              />
            )}
            {!(isEditing && isEditable) && <BinaryFileGallery fileIdList={fileIDs} />}
          </div>
        </div>
      </div>
      <div className="marginTop20 marginBottom60" />
    </>
  );
};

export default connect(AdditionalInfo);
