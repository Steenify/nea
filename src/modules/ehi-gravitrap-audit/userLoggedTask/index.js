import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import BreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import DataTable from 'components/common/data-table';
import { ReactComponent as CloseIcon } from 'assets/svg/close.svg';
import CustomModal from 'components/common/modal';
import { tableColumnWidth, WEB_ROUTES } from 'constants/index';
import AddButton from 'components/common/add-button';
import { Formik, Form } from 'formik';
import ValidationField from 'components/common/formik/validationField';
import { getMastercodeAction, MASTER_CODE } from 'store/actions';
import { selectOptionsFromStringArray } from 'utils';
import { toast } from 'react-toastify';
import { listingAction, updateAction } from './action';
import { validate, ACTION_TYPES, initialSector } from './helper';

const boolOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

const premisesLOV = selectOptionsFromStringArray(['HDB', 'Landed']);

const LoggedTask = ({ ui: { isLoading }, data: { list = [], nextTaskListGenerationDate = '' }, listingAction, getMastercodeAction, updateAction }) => {
  const title = WEB_ROUTES.EHI_GRAVITRAP_AUDIT.USER_LOGGED_TASK.name;
  useEffect(() => {
    document.title = `NEA | ${title}`;
    listingAction();
    getMastercodeAction([MASTER_CODE.PREMISES_TYPE, MASTER_CODE.GROUP_BY]);
  }, [getMastercodeAction, listingAction, title]);

  const [modal, setModal] = useState({ isShow: false, action: () => {}, headerTitle: '', confirmTitle: '', cancelTitle: '' });
  const { ADD, EDIT, NONE } = ACTION_TYPES;
  const groupByLOV = selectOptionsFromStringArray(['Postal Code', 'Cluster ID', 'Sector ID']);

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    const params = values.data.map((item) => {
      const { id, groupBy, groupId, recurring, endDate, premiseType } = item;
      return { id, groupBy, groupId, recurring, endDate, premiseType };
    });

    setModal({
      isShow: true,
      headerTitle: 'Please check that all the fields are correctly entered',
      confirmTitle: 'Confirm',
      cancelTitle: 'Cancel',
      action: () => {
        setModal({ isShow: false });
        updateAction(params, () => {
          setSubmitting(false);
          resetForm();
          toast.success('List saved.');
          listingAction();
        });
      },
    });

    setSubmitting(false);
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={title} />
        <div className="contentWrapper">
          <BreadCrumb page={[WEB_ROUTES.EHI_GRAVITRAP_AUDIT, WEB_ROUTES.EHI_GRAVITRAP_AUDIT.USER_LOGGED_TASK]} />
          <div className="main-title">
            <h1>{title}</h1>
          </div>

          <div className="main-title">
            <h3>{`Next task list generation date: ${nextTaskListGenerationDate}`}</h3>
          </div>

          <Formik enableReinitialize initialValues={{ data: list }} validate={validate} onSubmit={onSubmit}>
            {({ values, isSubmitting, setFieldValue }) => {
              const { data } = values;
              const fieldName = 'data';
              const removeSector = (index) => {
                data.splice(index, 1);
                setFieldValue(fieldName, data, false);
              };
              const addSector = () => {
                setFieldValue(fieldName, [{ ...initialSector, action: ADD }, ...data]);
              };
              const resetSector = (id, index) => {
                const find = list.find((item) => item.id === id) || {};
                setFieldValue(`data[${index}]`, find, false);
              };
              // const isActionPerforming = data.filter((item) => item.action !== NONE).length > 0;
              const columns = [
                {
                  Header: 'Premises Type',
                  accessor: 'premiseType',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { action, premiseType } = data[index] || cellInfo?.row?._original;
                    if (action !== NONE) {
                      return <ValidationField name={`data[${index}].premiseType`} inputComponent="react-select" selectClassName="wf-300" hideError options={premisesLOV} />;
                    }

                    return premiseType;
                  },
                },
                {
                  Header: 'Group By',
                  accessor: 'groupBy',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { action, groupBy, premiseType } = data[index] || cellInfo?.row?._original;
                    const options = groupByLOV.filter((group) => {
                      if (premiseType === 'HDB') {
                        return group.value !== 'Sector ID';
                      }
                      if (premiseType === 'Landed') {
                        return group.value === 'Sector ID';
                      }
                      return false;
                    });
                    if (action !== NONE) {
                      return <ValidationField name={`data[${index}].groupBy`} inputComponent="react-select" selectClassName="wf-300" hideError options={options} />;
                    }
                    return groupBy;
                  },
                },
                {
                  Header: 'Postal Code / Sector ID / Cluster ID',
                  accessor: 'groupId',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { action, groupId } = data[index] || cellInfo?.row?._original;
                    if (action !== NONE) {
                      return <ValidationField name={`data[${index}].groupId`} inputClassName="textfield" hideError />;
                    }
                    return groupId;
                  },
                },
                {
                  Header: 'Recurring',
                  accessor: 'recurring',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { action, recurring } = data[index] || cellInfo?.row?._original;
                    if (action !== NONE) {
                      return (
                        <ValidationField
                          name={`data[${index}].recurring`}
                          inputComponent="react-select"
                          selectClassName="wf-200"
                          hideError
                          options={boolOptions}
                          isClearable={false}
                          onChange={(value) => {
                            if (value) {
                              setFieldValue(`data[${index}].recurring`, true, false);
                            } else {
                              setFieldValue(`data[${index}].recurring`, true, false);
                            }
                          }}
                        />
                      );
                    }
                    return recurring ? 'Yes' : 'No';
                  },
                },
                {
                  Header: 'End Date',
                  accessor: 'endDate',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { action, endDate } = data[index] || cellInfo?.row?._original;
                    if (action !== NONE) {
                      return <ValidationField inputComponent="singleDatePickerV2" name={`data[${index}].endDate`} hideError />;
                    }
                    return endDate;
                  },
                },
                {
                  Header: '',
                  accessor: 'action',
                  className: 'rt-overflow-visible',
                  minWidth: tableColumnWidth.lg,
                  Cell: (cellInfo) => {
                    const { index } = cellInfo;
                    const { id, action } = data[index] || cellInfo?.row?._original;
                    if (action === ADD) {
                      return (
                        <button type="button" className="btn btn-sec mw-100" onClick={() => removeSector(index)}>
                          Cancel
                        </button>
                      );
                    }
                    if (action === EDIT) {
                      return (
                        <button type="button" className="btn btn-sec mw-100" onClick={() => resetSector(id, index)}>
                          Cancel
                        </button>
                      );
                    }
                    return (
                      <>
                        <span className="cursor-pointer">
                          <CloseIcon width={36} height={36} onClick={() => removeSector(index)} />
                        </span>
                      </>
                    );
                  },
                },
              ];
              return (
                <div className="tabsContainer">
                  <Form>
                    <DataTable
                      data={data}
                      columns={columns}
                      rightHeaderContent={
                        <div className="d-flex align-items-center">
                          <AddButton title="Add Block/Sector/Cluster" onClick={addSector} className="d-inline m-1" />
                          <button type="submit" className="btn btn-pri m-1" disabled={isSubmitting}>
                            Confirm
                          </button>
                        </div>
                      }
                    />
                  </Form>
                </div>
              );
            }}
          </Formik>

          <InPageLoading isLoading={isLoading} />
          <Footer />
          <CustomModal
            isOpen={modal.isShow}
            type="system-modal"
            headerTitle="Confirmation"
            content={modal.headerTitle}
            confirmTitle={modal.confirmTitle}
            onConfirm={modal.action}
            cancelTitle={modal.cancelTitle}
            onCancel={() => setModal({ isShow: false })}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global, ehiGravitrapAuditReducers: { userLoggedTask } }, ownProps) => ({
  ...ownProps,
  ...userLoggedTask,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = { updateAction, listingAction, getMastercodeAction };

export default connect(mapStateToProps, mapDispatchToProps)(LoggedTask);
