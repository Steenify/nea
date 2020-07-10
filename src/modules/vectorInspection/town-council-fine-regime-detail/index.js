import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import XLSX from 'xlsx';
import update from 'react-addons-update';
import { isArray, isBoolean } from 'lodash';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import TabNav from 'components/ui/tabnav';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import DataTable from 'components/common/data-table';
import InPageLoading from 'components/common/inPageLoading';

import PromptOnLeave from 'components/common/formik/prompt-on-leave';
import SubmitErrorMessage from 'components/common/formik/submit-error-message';
import ValidationField from 'components/common/formik/validationField';

import { WEB_ROUTES, tableColumnWidth } from 'constants/index';
import { getMonthFromString, alphabet, getData, storeData } from 'utils';
import GoBackButton from 'components/ui/go-back-button';

import { getDetailAction, getSummaryAction, confirmSummaryAction, saveDetailAction, rejectAction, supportAction, approveAction } from './action';

const TownCouncilFineRegimeDetail = (props) => {
  const {
    ui: { isLoading },
    data: { detail, summary },
    history,
    location: { state },

    getDetailAction,
    getSummaryAction,
    confirmSummaryAction,
    saveDetailAction,
    rejectAction,
    supportAction,
    approveAction,
  } = props;

  const tabNavMenu = ['Summary', 'Details'];

  const [activeTabNav, toggleTabNav] = useState(getData('previousTCTabs') || '0');

  const year = state?.year;
  const month = String(getMonthFromString(state?.month));
  const tcCode = state?.tcCode;
  const detailAction = state?.detailAction;

  if (!year || !month || !tcCode) {
    history.goBack();
    // history.replace(WEB_ROUTES.INSPECTION_MANAGEMENT.TOWN_COUNCIL_FINE_REGIME.url);
  }

  const goToForm3Detail = (form3Id) => {
    storeData('previousTCTabs', activeTabNav);
    history.push(WEB_ROUTES.INSPECTION_MANAGEMENT.FORM3_DETAIL.url, { form3Id });
  };

  const detailColumns = [
    {
      Header: 'Form 3 ID',
      accessor: 'form3Id',
      minWidth: tableColumnWidth.md,
      Cell: (cellInfo) => (
        <span className="text-blue cursor-pointer" onClick={() => goToForm3Detail(cellInfo.row.form3Id)}>
          {cellInfo.row.form3Id}
        </span>
      ),
    },
    {
      Header: 'Classification',
      accessor: 'classification',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Cluster ID',
      accessor: 'clusterId',
      minWidth: tableColumnWidth.xl,
      Cell: (cellInfo) => {
        const { index } = cellInfo;
        return <ValidationField name={`data[${index}].clusterId`} inputClassName="textfield" hideError />;
      },
    },
    {
      Header: 'Habitat',
      accessor: 'habitatCode',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'PCO schedule (date)',
      accessor: 'pcoScheduleDate',
      minWidth: tableColumnWidth.xl,
      className: 'rt-overflow-visible',
      Cell: (cellInfo) => {
        const { index } = cellInfo;
        return <ValidationField name={`data[${index}].pcoScheduleDate`} inputComponent="singleDatePickerV2" placeholder="DD/MM/YYYY" hideError />;
      },
    },
    {
      Header: 'PCO schedule (day)',
      accessor: 'pcoScheduleDay',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Day from schedule',
      accessor: 'dayFromSchedule',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Density',
      accessor: 'density',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Witness',
      accessor: 'witness',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Within threshold ?',
      accessor: 'withinThreshold',
      minWidth: tableColumnWidth.md,
      Cell: (cellInfo) => {
        const {
          row: { withinThreshold },
        } = cellInfo;
        switch (withinThreshold) {
          case false:
            return <>No</>;
          case true:
            return <>Yes</>;
          default:
            return <>-</>;
        }
      },
    },
  ];

  const viewOnlyColumn = [
    {
      Header: 'Form 3 ID',
      accessor: 'form3Id',
      minWidth: tableColumnWidth.md,
      Cell: (cellInfo) => (
        <span className="text-blue cursor-pointer" onClick={() => goToForm3Detail(cellInfo.row.form3Id)}>
          {cellInfo.row.form3Id}
        </span>
      ),
    },
    {
      Header: 'Classification',
      accessor: 'classification',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Cluster ID',
      accessor: 'clusterId',
      minWidth: tableColumnWidth.xl,
    },
    {
      Header: 'Habitat',
      accessor: 'habitatCode',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'PCO schedule (date)',
      accessor: 'pcoScheduleDate',
      minWidth: tableColumnWidth.xl,
      className: 'rt-overflow-visible',
    },
    {
      Header: 'PCO schedule (day)',
      accessor: 'pcoScheduleDay',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Day from schedule',
      accessor: 'dayFromSchedule',
      minWidth: tableColumnWidth.md,
    },
    {
      Header: 'Density',
      accessor: 'density',
      minWidth: tableColumnWidth.sm,
    },
    {
      Header: 'Witness',
      accessor: 'witnessName',
      minWidth: tableColumnWidth.lg,
    },
    {
      Header: 'Within threshold ?',
      accessor: 'withinThreshold',
      minWidth: tableColumnWidth.md,
      Cell: (cellInfo) => {
        const {
          row: { withinThreshold },
        } = cellInfo;
        switch (withinThreshold) {
          case false:
            return <>No</>;
          case true:
            return <>Yes</>;
          default:
            return <>-</>;
        }
      },
    },
  ];

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.INSPECTION_MANAGEMENT.TOWN_COUNCIL_FINE_REGIME_DETAIL.name}`;
    if (year && month && tcCode) {
      const data = { year, month, tcCode };
      getDetailAction(data);
      getSummaryAction(data);
    }
    storeData('previousTCTabs', '0');
  }, [getDetailAction, getSummaryAction, year, month, tcCode]);

  const onSubmit = (values, actions) => {
    saveDetailAction({ tcRegimeDetailVOList: values.data }, () => {
      const data = { year, month, tcCode };
      getDetailAction(data);
      getSummaryAction(data);
    });
    actions.setSubmitting(false);
    actions.setErrors({});
  };

  const validate = (values) => {
    const errors = {};

    const dataErrors = [];
    let errorCount = 0;
    values.data.forEach((value) => {
      const error = {};
      // if (!value.clusterId) {
      //   errorCount += 1;
      //   error.clusterId = '(Required)';
      // }
      if (!value.pcoScheduleDate) {
        errorCount += 1;
        error.pcoScheduleDate = '(Required)';
      }
      dataErrors.push(error);
    });

    if (errorCount) {
      errors.data = dataErrors;
      errors.errorCount = errorCount;
      errors.errorHint = `There are ${errorCount} missing required fields Details tab.`;
    }
    return errors;
  };

  const exportSummaryExcel = () => {
    const data = [];

    for (let i = 0; i < 20; i += 1) {
      const temp = [];
      for (let k = 0; k < 20; k += 1) {
        temp.push('');
      }
      data.push(temp);
    }

    let summarySheet = XLSX.utils.aoa_to_sheet(data);

    summarySheet = update(summarySheet, {
      B1: { v: { $set: 'Within Clusters (Immediate fines)' } },
      C1: { v: { $set: 'Total' } },

      A2: { v: { $set: 'Within clusters' } },
      B2: { v: { $set: summary?.withinClusterCount } },
      C2: { v: { $set: summary?.withinClusterTotal } },

      B4: { v: { $set: 'Day 1-3, > 4 ph (Immediate fine)' } },
      C4: { v: { $set: 'Day 1-3, < 5 ph (Add to threshold.)' } },
      D4: { v: { $set: 'Days 4-7 (No enforcement actions. Not added to threshold.)' } },
      E4: { v: { $set: 'Days 0 (No enforcement actions. Not added to threshold.)' } },
      F4: { v: { $set: 'Total' } },
      G4: { v: { $set: 'Added in threshold' } },

      A5: { v: { $set: 'Top Habitats' } },
      B5: { v: { $set: `${summary?.topHabitatDayOneToThreeMoreThanEqualFivePh}` } },
      C5: { v: { $set: summary?.topHabitatDayOneToThreeLessThanFivePh } },
      D5: { v: { $set: summary?.topHabitatDayFourToSeven } },
      E5: { v: { $set: summary?.topHabitatDayZero } },
      F5: { v: { $set: summary?.topHabitatTotal } },
      G5: { v: { $set: `${summary?.topHabitatAddedThreshold}` } },

      B7: { v: { $set: 'Day 1-3, > 4 ph (Add to threshold.)' } },
      C7: { v: { $set: 'Day 1-3, < 5 ph (No enforcement actions. Not added to threshold.)' } },
      D7: { v: { $set: 'Days 4-7 (No enforcement actions. Not added to threshold.)' } },
      E7: { v: { $set: 'Days 0 (No enforcement actions. Not added to threshold.)' } },
      F7: { v: { $set: 'Total' } },
      G7: { v: { $set: 'Added in threshold' } },

      A8: { v: { $set: 'TC Managed areas' } },
      B8: { v: { $set: summary?.tcManagedAreasDayOneToThreeMoreThanEqualFivePh } },
      C8: { v: { $set: summary?.tcManagedAreasDayOneToThreeLessThanFivePh } },
      D8: { v: { $set: summary?.tcManagedAreasDayFourToSeven } },
      E8: { v: { $set: summary?.tcManagedAreasDayZero } },
      F8: { v: { $set: summary?.tcManagedAreasTotal } },
      G8: { v: { $set: `${summary?.tcManagedAreasAddedThreshold}` } },

      B10: { v: { $set: 'Threshold' } },
      C10: { v: { $set: 'Within clusters' } },
      D10: { v: { $set: 'Top Habitats' } },
      E10: { v: { $set: 'TC Managed areas' } },
      F10: { v: { $set: 'No. above threshold' } },
      G10: { v: { $set: 'Total' } },
      H10: { v: { $set: 'Immediate' } },
      I10: { v: { $set: 'No. above threshold' } },
      J10: { v: { $set: 'Total' } },

      A11: { v: { $set: 'Summary' } },
      B11: { v: { $set: `${summary?.threshold}` } },
      C11: { v: { $set: summary?.withinClusters } },
      D11: { v: { $set: summary?.topHabitats } },
      E11: { v: { $set: summary?.tcManagedAreas } },
      F11: { v: { $set: `${summary?.noAboveThreshold}` } },
      G11: { v: { $set: summary?.total } },
      H11: { v: { $set: `${summary?.immediateAmount}` } },
      I11: { v: { $set: summary?.noAboveThresholdAmount } },
      J11: { v: { $set: summary?.totalAmount } },
    });

    const columns = detailAction === 'confirm' ? detailColumns : viewOnlyColumn;
    const tableData = detail.map((item) => {
      const temp = {};
      columns.forEach((column) => {
        const value = item[column.accessor] || '';
        if (isArray(value)) {
          temp[column.accessor] = value.join(', ');
        } else if (isBoolean(value)) {
          temp[column.accessor] = value ? 'Yes' : 'No';
        } else {
          temp[column.accessor] = value;
        }
      });
      return temp;
    });

    if (tableData.length === 0) {
      const temp = {};
      columns.forEach((column) => {
        temp[column.accessor] = '';
      });
      tableData.push(temp);
    }

    let detailsSheet = XLSX.utils.json_to_sheet(tableData);
    columns.forEach((column, index) => {
      detailsSheet = update(detailsSheet, {
        [`${alphabet[index]}1`]: {
          v: {
            $set: column.Header,
          },
        },
      });
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
    XLSX.utils.book_append_sheet(wb, detailsSheet, 'Details');
    XLSX.writeFile(wb, `${WEB_ROUTES.INSPECTION_MANAGEMENT.TOWN_COUNCIL_FINE_REGIME_DETAIL.name}.xlsx`);
  };

  const renderMainContent = () => (
    <>
      <div className={activeTabNav === '0' ? '' : 'd-none'}>
        <div className="tblCompo habitatTbl bg-white mb-3">
          <table>
            <thead>
              <tr className="tbl-headings">
                <th className="wf-200" />
                <th className="text-center">Within Clusters (Immediate fines)</th>
                <th className="wf-100 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td align="center" valign="middle">
                  Within clusters
                </td>
                <td align="center" valign="middle">
                  {summary?.withinClusterCount}
                </td>
                <td align="center" valign="middle">
                  {summary?.withinClusterTotal}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="tblCompo habitatTbl bg-white mb-3">
          <table>
            <thead>
              <tr className="tbl-headings">
                <th className="wf-200" />
                <th className="text-center">
                  Day 1-3, {'>'} 4 ph
                  <br />
                  (Immediate fine)
                </th>
                <th className="text-center">
                  Day 1-3, {'<'} 5 ph
                  <br />
                  (Add to threshold.)
                </th>
                <th className="text-center">
                  Days 4-7
                  <br />
                  (No enforcement actions.
                  <br />
                  Not added to threshold.)
                </th>
                <th className="text-center">
                  Days 0<br />
                  (No enforcement actions.
                  <br />
                  Not added to threshold.)
                </th>
                <th className="wf-100 text-center">Total</th>
                <th className="wf-100 text-center">Added in threshold</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td align="center" valign="middle">
                  Top Habitats
                </td>
                <td align="center" valign="middle">
                  {summary?.topHabitatDayOneToThreeMoreThanEqualFivePh}
                </td>
                <td align="center" valign="middle">
                  {summary?.topHabitatDayOneToThreeLessThanFivePh}
                </td>
                <td align="center" valign="middle">
                  {summary?.topHabitatDayFourToSeven}
                </td>
                <td align="center" valign="middle">
                  {summary?.topHabitatDayZero}
                </td>
                <td align="center" valign="middle">
                  {summary?.topHabitatTotal}
                </td>
                <td align="center" valign="middle">
                  {summary?.topHabitatAddedThreshold}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="tblCompo habitatTbl bg-white mb-3">
          <table>
            <thead>
              <tr className="tbl-headings">
                <th className="wf-200" />
                <th className="text-center">
                  Day 1-3, {'>'} 4 ph <br /> (Add to threshold.)
                </th>
                <th className="text-center">
                  Day 1-3, {'<'} 5 ph <br /> (No enforcement actions.
                  <br />
                  Not added to threshold.)
                </th>
                <th className="text-center">
                  Days 4-7 <br /> (No enforcement actions.
                  <br />
                  Not added to threshold.)
                </th>
                <th className="text-center">
                  Days 0 <br /> (No enforcement actions.
                  <br />
                  Not added to threshold.)
                </th>
                <th className="wf-100 text-center">Total</th>
                <th className="wf-100 text-center">Added in threshold</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td align="center" valign="middle">
                  TC Managed areas
                </td>
                <td align="center" valign="middle">
                  {summary?.tcManagedAreasDayOneToThreeMoreThanEqualFivePh}
                </td>
                <td align="center" valign="middle">
                  {summary?.tcManagedAreasDayOneToThreeLessThanFivePh}
                </td>
                <td align="center" valign="middle">
                  {summary?.tcManagedAreasDayFourToSeven}
                </td>
                <td align="center" valign="middle">
                  {summary?.tcManagedAreasDayZero}
                </td>
                <td align="center" valign="middle">
                  {summary?.tcManagedAreasTotal}
                </td>
                <td align="center" valign="middle">
                  {summary?.tcManagedAreasAddedThreshold}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="tblCompo habitatTbl bg-white mb-3">
          <table>
            <thead>
              <tr className="tbl-headings">
                <th className="wf-100" />
                <th className="text-center">Threshold</th>
                <th className="text-center">Within clusters</th>
                <th className="text-center">Top Habitats</th>
                <th className="text-center">TC Managed areas</th>
                <th className="text-center">No. above threshold</th>
                <th className="text-center">Total</th>
                <th className="text-center">Immediate</th>
                <th className="text-center">No. above threshold</th>
                <th className="text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td align="center" valign="middle">
                  Summary
                </td>
                <td align="center" valign="middle">
                  {summary?.threshold}
                </td>
                <td align="center" valign="middle">
                  {summary?.withinClusters}
                </td>
                <td align="center" valign="middle">
                  {summary?.topHabitats}
                </td>
                <td align="center" valign="middle">
                  {summary?.tcManagedAreas}
                </td>
                <td align="center" valign="middle">
                  {summary?.noAboveThreshold}
                </td>
                <td align="center" valign="middle">
                  {summary?.total}
                </td>
                <td align="center" valign="middle">
                  {summary?.immediateAmount}
                </td>
                <td align="center" valign="middle">
                  {summary?.noAboveThresholdAmount}
                </td>
                <td align="center" valign="middle">
                  {summary?.totalAmount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-center">
          {detailAction === 'support' && (
            <>
              {summary?.confirmedBy && <label className="row justify-content-center font-weight-bold">Confirmed by: {summary?.confirmedBy}</label>}
              <button
                type="button"
                className="btn btn-pri m-2"
                onClick={() =>
                  supportAction({ year, month, tcCode }, () => {
                    toast.success('TC Fine Regime supported');
                    history.goBack();
                  })
                }>
                Support
              </button>
              <button
                type="button"
                className="btn btn-sec m-2"
                onClick={() =>
                  rejectAction({ year, month, tcCode }, () => {
                    toast.success('TC Fine Regime rejected');
                    history.goBack();
                  })
                }>
                Reject
              </button>
            </>
          )}
          {detailAction === 'approve' && (
            <>
              {summary?.confirmedBy && <label className="row justify-content-center font-weight-bold">Confirmed by: {summary?.confirmedBy}</label>}
              {summary?.supportedBy && <label className="row justify-content-center font-weight-bold">Supported by: {summary?.supportedBy}</label>}
              <button
                type="button"
                className="btn btn-pri m-2"
                onClick={() =>
                  approveAction({ year, month, tcCode }, () => {
                    toast.success('TC Fine Regime approved');
                    history.goBack();
                  })
                }>
                Approve
              </button>
              <button
                type="button"
                className="btn btn-sec m-2"
                onClick={() =>
                  rejectAction({ year, month, tcCode }, () => {
                    toast.success('TC Fine Regime rejected');
                    history.goBack();
                  })
                }>
                Reject
              </button>
            </>
          )}
          {detailAction === 'confirm' && (
            <>
              <label className="row justify-content-center font-weight-bold">Please confirm that all Form 3 for the month have been verified. Proceed with enforcement.</label>
              <button type="button" className="btn btn-pri m-2" onClick={() => confirmSummaryAction({ year, month, tcCode }, () => history.goBack())}>
                Confirm
              </button>
            </>
          )}
        </div>
      </div>
      <div className={activeTabNav === '1' ? '' : 'd-none'}>
        {detailAction === 'confirm' ? (
          <>
            <DataTable data={detail} columns={detailColumns} />
            <div className="text-center">
              <button type="submit" className="btn btn-pri m-2">
                Save
              </button>
            </div>
          </>
        ) : (
          <DataTable data={detail} columns={viewOnlyColumn} />
        )}
      </div>
    </>
  );

  const parentPage = detailAction ? WEB_ROUTES.INSPECTION_MANAGEMENT.TOWN_COUNCIL_FINE_REGIME : WEB_ROUTES.INSPECTION_MANAGEMENT.QUERY_TOWN_COUNCIL_FINE_REGIME;

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={parentPage.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.INSPECTION_MANAGEMENT, parentPage, WEB_ROUTES.INSPECTION_MANAGEMENT.TOWN_COUNCIL_FINE_REGIME_DETAIL]} />
          <GoBackButton onClick={() => history.goBack()} title={`${year} ${state?.month} - ${state?.tcCodeDesc}`}>
            <div className="d-flex align-items-center justify-content-end ml-auto">
              <button type="button" className="btn btn-sec m-2 " onClick={exportSummaryExcel}>
                Download
              </button>
            </div>
          </GoBackButton>
          <nav className="tab__main">
            <div className="tabsContainer">
              <Formik initialValues={{ data: detail?.map((item) => ({ pcoScheduleDate: '', clusterId: '', ...item })) }} enableReinitialize validate={validate} onSubmit={onSubmit}>
                {({ dirty }) => (
                  <Form>
                    <PromptOnLeave dirty={dirty} />
                    <SubmitErrorMessage />
                    <TabNav onToggleTab={toggleTabNav} activeTab={activeTabNav} menu={tabNavMenu} />
                    <div className="paddingBottom30 mt-2">{renderMainContent()}</div>
                  </Form>
                )}
              </Formik>
            </div>
          </nav>
          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ vectorInspectionReducers: { townCouncilFineRegimeDetail } }, ownProps) => ({
  ...ownProps,
  ...townCouncilFineRegimeDetail,
});

const mapDispatchToProps = {
  getDetailAction,
  getSummaryAction,
  confirmSummaryAction,
  saveDetailAction,
  rejectAction,
  supportAction,
  approveAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TownCouncilFineRegimeDetail));
