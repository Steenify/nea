import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as Formik from 'formik';
import { isArray } from 'lodash';

import BinaryFileGallery from 'components/common/binaryImageGallery';
import ValidationField from 'components/common/formik/validationField';
import DropBox from 'components/common/dropbox';

import { SUBMISSION_TYPE } from 'constants/index';

import { actionTryCatchCreator } from 'utils';
import AddButton from 'components/common/add-button';
import { getAuditTaskLapsTypeService } from 'services/rodent-audit';
import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';

const ContractorCorrespondence = (props) => {
  const { correspondence, action, formik } = props;
  const [lapseTypeLOV, setLapseTypeLOV] = useState([]);
  const taskId = formik?.values?.taskId;

  useEffect(() => {
    if (taskId) {
      actionTryCatchCreator(getAuditTaskLapsTypeService({ id: taskId }), null, (data) => {
        setLapseTypeLOV((data?.mastCdVo?.mastCdDetList || []).map((item) => ({ value: item.code, label: item.codeDesc })));
      });
    }
  }, [taskId]);

  const addLapse = () => {
    const list = formik.values.lapses || [];
    list.push('');
    formik.setFieldValue('lapses', list);
  };

  const removeLapse = (index) => {
    const list = formik.values.lapses || [];
    list.splice(index, 1);
    formik.setFieldValue('lapses', list);
  };

  if (action === 'submit') {
    return (
      <>
        <div className="tab-pane__group bg-white">
          <p className="tab-pane__title text-white">Contractor's Correspondence</p>
          <div className="card">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-12 font-weight-bold">Attachments (*)</div>
                <div className="col-12 col-lg-6">
                  <DropBox
                    size="sm"
                    isError={formik.errors.contractorVO?.fileId}
                    submissionType={SUBMISSION_TYPE.RODAUDITCC}
                    fileIdList={formik.values.contractorVO?.fileId}
                    onChange={(fileList) =>
                      formik.setFieldValue(
                        'contractorVO.fileId',
                        fileList.map((file) => file.fileId),
                      )
                    }
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12 font-weight-bold">Remarks (*)</div>
                <div className="col-12 col-lg-6">
                  <ValidationField inputComponent="textarea" name="contractorVO.remarks" rows={5} hideError />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tab-pane__group bg-white">
          <p className="tab-pane__title text-white">Senior Manager's Lapse Assessment</p>
          <div className="card">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-12 font-weight-bold">Attachments (*)</div>
                <div className="col-12 col-lg-6">
                  <DropBox
                    size="sm"
                    isError={formik.errors.seniorManagerVO?.fileId}
                    submissionType={SUBMISSION_TYPE.RODAUDITCC}
                    fileIdList={formik.values.seniorManagerVO?.fileId}
                    onChange={(fileList) =>
                      formik.setFieldValue(
                        'seniorManagerVO.fileId',
                        fileList.map((file) => file.fileId),
                      )
                    }
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12 font-weight-bold">Remarks (*)</div>
                <div className="col-12 col-lg-6">
                  <ValidationField inputComponent="textarea" name="seniorManagerVO.remarks" rows={5} hideError />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tab-pane__group bg-white">
          <p className="tab-pane__title text-white">Final Lapse Assessment</p>
          <div className="card">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-12 font-weight-bold">Accept contractor's explanation for lapses? (*)</div>
                <div className="col-12">
                  <div className="d-flex">
                    <div className="custom-radio">
                      <ValidationField type="radio" id="acceptExplanation_yes" name="acceptExplanation" className="form-input" value hideError />
                      <label className="form-label" htmlFor="acceptExplanation_yes">
                        Yes
                      </label>
                    </div>
                    <div className="custom-radio ml-5">
                      <ValidationField type="radio" id="acceptExplanation_no" name="acceptExplanation" className="form-input" value={false} hideError />
                      <label className="form-label" htmlFor="acceptExplanation_no">
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {!formik.values.acceptExplanation && (
                <div className="row mb-3">
                  <div className="col-12 font-weight-bold">Type of lapse (*)</div>
                  {formik.values.lapses && (
                    <>
                      {formik.values.lapses.includes('RD_BCD') && (
                        <div className="col-12 mb-2">
                          <div className="d-flex align-items-center">
                            Burrow Count: <ValidationField name="burrowCount" inputClassName="textfield wf-200 m-2" hideError />
                          </div>
                          {formik.errors.burrowCount && <Formik.ErrorMessage className="col-form-error-label" name="burrowCount" component="div" />}
                        </div>
                      )}

                      {formik.values.lapses.map((_lapse, index) => (
                        <div className="col-12 mb-2" key={`lapses_${index + 1}`}>
                          <div className="d-flex align-items-center">
                            <span className="cursor-pointer" onClick={() => removeLapse(index)}>
                              <CloseIcon width={36} height={36} />
                            </span>
                            <ValidationField
                              name={`lapses[${index}]`}
                              inputComponent="react-select"
                              selectClassName="wf-400"
                              placeholder="Select lapse"
                              alwaysUpdate
                              // options={(masterCodes[MASTER_CODE.LAPSE_TYPE] || []).filter((code) => ['RD_LS_FI', 'RD_LS_DR', 'RD_BCD', 'RD_D_OP', 'RD_BCD_FI'].includes(code.value))}
                              options={lapseTypeLOV}
                              onChange={(values) => values !== 'RD_BCD' && formik.setFieldValue('burrowCount', 0)}
                              hideError
                            />
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  <div className="col-12">
                    {formik.values.lapses.length < 1 && <AddButton title="Add Lapse" onClick={addLapse} />}
                    {!isArray(formik.errors.lapses) && <Formik.ErrorMessage className="col-form-error-label" name="lapses" component="div" />}
                  </div>
                </div>
              )}
              <div className="row mb-3">
                <div className="col-12 font-weight-bold">Remarks</div>
                <div className="col-12 col-lg-6">
                  <ValidationField inputComponent="textarea" name="remarks" rows={5} hideError />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="tab-pane__group bg-white">
        <p className="tab-pane__title text-white">Contractor's Correspondence</p>
        <div className="card">
          <div className="card-body">
            {correspondence?.contractorVO && (
              <>
                {(correspondence?.contractorVO?.files || []).map((file) => (
                  <>
                    <div className="row mb-3">
                      <div className="col-md-3 col-lg-3 font-weight-bold">Uploaded as at</div>
                      <div className="col-md-9 col-lg-4">{file.uploadTime}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-3 col-lg-3 font-weight-bold">Attachments</div>
                      <div className="col-12">
                        <BinaryFileGallery fileIdList={[file.fileId]} />
                      </div>
                    </div>
                  </>
                ))}

                <div className="row mb-3">
                  <div className="col-3 col-md-12 font-weight-bold">Remarks</div>
                  <div className="col-9 col-md-12">{correspondence?.contractorVO?.remarks}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {correspondence?.seniorManagerVO && (
        <div className="tab-pane__group bg-white">
          <p className="tab-pane__title text-white">Senior Manager's Lapse Assessment</p>
          <div className="card">
            <div className="card-body">
              {(correspondence?.seniorManagerVO?.files || []).map((file) => (
                <>
                  <div className="row mb-3">
                    <div className="col-md-3 col-lg-3 font-weight-bold">Uploaded as at</div>
                    <div className="col-md-9 col-lg-4">{file.uploadTime}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-3 col-lg-3 font-weight-bold">Attachments</div>
                    <div className="col-12">
                      <BinaryFileGallery fileIdList={[file.fileId]} />
                    </div>
                  </div>
                </>
              ))}

              <div className="row mb-3">
                <div className="col-3 col-md-12 font-weight-bold">Remarks</div>
                <div className="col-9 col-md-12">{correspondence?.seniorManagerVO?.remarks}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="tab-pane__group bg-white">
        <p className="tab-pane__title text-white">Final Lapse Assessment</p>
        <div className="card">
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-12 font-weight-bold">Accept contractor&apos;s explanation for lapses?</div>
              <div className="col-12">{correspondence?.acceptExplanation ? 'Yes' : 'No'}</div>
            </div>
            {!correspondence?.acceptExplanation && (
              <div className="row mb-3">
                <div className="col-12 font-weight-bold">Type of lapse</div>
                {correspondence?.lapses && correspondence?.lapses.length > 0 && (
                  <>
                    {correspondence?.lapses?.includes('RD_BCD') && <div className="col-12">Burrow Count: {correspondence?.burrowCount}</div>}

                    {correspondence?.lapses.map((lapse, index) => (
                      <div className="col-12" key={`lapse_${index + 1}`}>
                        {lapse}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
            <div className="row mb-3">
              <div className="col-12 font-weight-bold">Remarks</div>
              <div className="col-12">{correspondence?.remarks}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global }, ownProps) => ({
  ...ownProps,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = {
  // getMastercodeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Formik.connect(ContractorCorrespondence));
