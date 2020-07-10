import React, { useState } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NewBreadCrumb from 'components/ui/breadcrumb';
import NavBar from 'components/layout/navbar';
import Footer from 'components/ui/footer';
import Select from 'components/common/select';
import InPageLoading from 'components/common/inPageLoading';
import SingleDatePickerV2 from 'components/common/single-date-picker';
import moment from 'moment-timezone';

import { WEB_ROUTES } from 'constants/index';

import { saveOptionalInstanceCfgAction } from '../action';

const format = (date) => moment(date).format('DD/MM/YYYY');

const OptionalTaskLDConfiguration = (props) => {
  const {
    history,
    optionalTaskLDConfiguration: {
      ui: { isLoading = false },
    },
    saveOptionalInstanceCfgAction,
  } = props;

  const [crcInstance, setCrcInstance] = useState();
  const [binChuteInstance, setBinChuteInstance] = useState();
  const [binCentreInstance, setBinCentreInstance] = useState();
  const [effectiveDate, setEffectiveDate] = useState();

  const onSave = () => {
    saveOptionalInstanceCfgAction(
      {
        crcInstance: crcInstance?.value,
        binchuteInstance: binChuteInstance?.value,
        bincentreInstance: binCentreInstance?.value,
        effectiveDate: format(effectiveDate),
      },
      (error) => {
        if (error) {
          toast.error(error?.message);

          return;
        }

        toast.success('Configuration created.');

        history.goBack();
      },
    );
  };

  return (
    <>
      <Header />

      <div className="main-content">
        <NavBar active={WEB_ROUTES.RODENT_AUDIT.OPTIONAL_TASK_LD_CONFIGURATION_LIST.name} />

        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.RODENT_AUDIT, WEB_ROUTES.RODENT_AUDIT.OPTIONAL_TASK_LD_CONFIGURATION_LIST, WEB_ROUTES.RODENT_AUDIT.OPTIONAL_TASK_LD_CONFIGURATION_NEW]} />

          <div className="main-title">
            <h1>{WEB_ROUTES.RODENT_AUDIT.OPTIONAL_TASK_LD_CONFIGURATION_NEW.name}</h1>
          </div>
          {/* <div className="paddingLeft30">
            <h2>New Configuration</h2>
          </div> */}

          <div className="block-summary filterMainWrapper tabsContainer" style={{ padding: '30px' }}>
            <div className="tab-pane__group bg-white">
              <div className="card">
                <div className="form-inline mb-4">
                  <div className="form-group form-group__stacked mb-4">
                    <b className="text-body">CRC Instance</b>
                    <Select
                      className="m-1 w-100 d-block"
                      options={[
                        {
                          label: '-- Select --',
                          value: null,
                        },
                        {
                          label: 'Per Block',
                          value: 'PER_BLOCK',
                        },
                        {
                          label: 'Per Row',
                          value: 'PER_ROW',
                        },
                      ]}
                      value={crcInstance}
                      onChange={setCrcInstance}
                    />
                  </div>
                </div>

                <div className="form-inline mb-4">
                  <div className="form-group form-group__stacked mb-4">
                    <b className="text-body">Bin Chute Instance</b>
                    <Select
                      className="m-1 w-100 d-block"
                      options={[
                        {
                          label: '-- Select --',
                          value: null,
                        },
                        {
                          label: 'Per Block',
                          value: 'PER_BLOCK',
                        },
                        {
                          label: 'Per Row',
                          value: 'PER_ROW',
                        },
                        {
                          label: 'Per Zone',
                          value: 'PER_ZONE',
                        },
                      ]}
                      value={binChuteInstance}
                      onChange={setBinChuteInstance}
                    />
                  </div>
                </div>

                <div className="form-inline mb-4">
                  <div className="form-group form-group__stacked mb-4">
                    <b className="text-body">Bin Centre Instance</b>
                    <Select
                      className="m-1 w-100 d-block"
                      options={[
                        {
                          label: '-- Select --',
                          value: null,
                        },
                        {
                          label: 'Per Row',
                          value: 'PER_ROW',
                        },
                        {
                          label: 'Per Zone',
                          value: 'PER_ZONE',
                        },
                      ]}
                      value={binCentreInstance}
                      onChange={setBinCentreInstance}
                    />
                  </div>
                </div>

                <div className="form-inline mb-4 d-flex align-items-end">
                  <div>
                    <b className="text-body mr-2">Effective Date</b>
                    <SingleDatePickerV2 className="mt-2 mr-2 xs-paddingBottom15" date={effectiveDate} onChangeDate={setEffectiveDate} />
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex">
              <button type="submit" className="btn btn-pri" onClick={onSave}>
                Save
              </button>
            </div>
          </div>

          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global, rodentAuditReducers: { optionalTaskLDConfiguration } }, ownProps) => ({
  ...ownProps,
  global,
  optionalTaskLDConfiguration,
});

const mapDispatchToProps = {
  saveOptionalInstanceCfgAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(OptionalTaskLDConfiguration);
