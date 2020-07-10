import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from 'components/ui/header';
import NavBar from 'components/layout/navbar';
import NewBreadCrumb from 'components/ui/breadcrumb';
import Footer from 'components/ui/footer';
import InPageLoading from 'components/common/inPageLoading';
import SearchableCheckList from 'components/common/searchable-check-list';
import { WEB_ROUTES } from 'constants/index';
import { getMastercodeAction, MASTER_CODE } from 'store/actions';

import { saveAction } from './action';

const WidgetByRoleDetail = (props) => {
  const {
    saveAction,
    location: { state },
    history,
    ui: { isLoading },
    getMastercodeAction,
    masterCodes,
    // data,
  } = props;

  const [assignedWidgets, setAssignedWidgets] = useState([]);
  const [selectedAssignedWidget, setSelectedAssignedWidget] = useState([]);
  const [nonAssignedWidgets, setNonAssignedWidgets] = useState([]);
  const [selectedNonAssignedWidget, setSelectedNonAssignedWidget] = useState([]);

  useEffect(() => {
    document.title = `NEA | ${WEB_ROUTES.DASHBOARD_CONFIGURATION.WIDGET_BY_ROLE_DETAIL.name}`;

    if (!state?.detail) {
      history.replace(WEB_ROUTES.DASHBOARD_CONFIGURATION.WIDGET_BY_ROLE.url);
    } else {
      getMastercodeAction([MASTER_CODE.DASHBOARD_WIDGET], undefined, undefined, (codes) => {
        const assignedCodes = state?.detail?.widgetCode?.map((item) => item.trim()) || [];
        setNonAssignedWidgets((codes[MASTER_CODE.DASHBOARD_WIDGET] || []).filter((item) => !assignedCodes.includes(item.value)));
        setAssignedWidgets(assignedCodes.map((item) => ({ value: item, label: (codes[MASTER_CODE.DASHBOARD_WIDGET] || []).find((code) => code.value === item)?.label || item })));
      });
    }
  }, [state, getMastercodeAction, history]);

  const addWidget = () => {
    if (assignedWidgets.length + selectedNonAssignedWidget.length > 4) {
      toast.error('Can only assign up to 4 widgets per role');
      return;
    }
    if (selectedNonAssignedWidget.length > 0) {
      setSelectedNonAssignedWidget([]);
      setAssignedWidgets((widgets) => [...widgets, ...selectedNonAssignedWidget]);
      setNonAssignedWidgets((widgets) => widgets.filter((item) => !selectedNonAssignedWidget.map((f) => f.value).includes(item.value)));
    }
  };

  const removeWidget = () => {
    if (selectedAssignedWidget.length > 0) {
      setNonAssignedWidgets((widgets) => [...widgets, ...selectedAssignedWidget]);
      setAssignedWidgets((widgets) => widgets.filter((item) => !selectedAssignedWidget.map((f) => f.value).includes(item.value)));
      setSelectedAssignedWidget([]);
    }
  };

  const removeAllWidget = () => {
    setNonAssignedWidgets((widgets) => [...widgets, ...assignedWidgets]);
    setAssignedWidgets([]);
  };

  const onSave = () => {
    if (assignedWidgets.length < 1) {
      toast.error('Must assign at least 1 widget per role');
      return;
    }
    saveAction({ role: state?.detail?.roleName, widgetCode: assignedWidgets.map((item) => item.value) }, () => {
      toast.success('Widgets for role saved');
      history.goBack();
    });
  };

  return (
    <>
      <Header />
      <div className="main-content workspace__main">
        <NavBar active={WEB_ROUTES.DASHBOARD_CONFIGURATION.WIDGET_BY_ROLE.name} />
        <div className="contentWrapper">
          <NewBreadCrumb page={[WEB_ROUTES.DASHBOARD_CONFIGURATION, WEB_ROUTES.DASHBOARD_CONFIGURATION.WIDGET_BY_ROLE, WEB_ROUTES.DASHBOARD_CONFIGURATION.WIDGET_BY_ROLE_DETAIL]} />
          <div className="go-back d-flex align-items-center">
            <span onClick={history.goBack}>{WEB_ROUTES.DASHBOARD_CONFIGURATION.WIDGET_BY_ROLE_DETAIL.name}</span>
          </div>
          {masterCodes[MASTER_CODE.DASHBOARD_WIDGET]?.length > 0 && (
            <div className="tabsContainer">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row mb-4">
                    <div className="col-lg-8 col-12 offset-lg-2 row">
                      <div className="col-lg-5 mb-3">
                        <SearchableCheckList
                          title="Widgets"
                          options={nonAssignedWidgets.sort((a, b) => a.value > b.value)}
                          placeholder="Search"
                          onChange={(list) => {
                            setSelectedNonAssignedWidget(list);
                          }}
                          hideOptionAll
                        />
                      </div>
                      <div className="col-lg-2 d-flex align-items-center flex-column justify-content-center">
                        <button type="button" className="btn btn-sec mb-3" onClick={addWidget}>
                          {'Add >'}
                        </button>
                        <button type="button" className="btn btn-sec mb-3" onClick={removeWidget}>
                          {'< Remove'}
                        </button>
                        <button type="button" className="btn btn-sec mb-3" onClick={removeAllWidget}>
                          {'< Remove All'}
                        </button>
                      </div>
                      <div className="col-lg-5">
                        <SearchableCheckList
                          title="Assigned Widgets"
                          options={assignedWidgets.sort((a, b) => a.value > b.value)}
                          placeholder="Search"
                          onChange={(list) => {
                            setSelectedAssignedWidget(list);
                          }}
                          hideOptionAll
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mb-5">
                <button type="button" className="btn btn-sec m-1" onClick={history.goBack}>
                  Cancel
                </button>
                <button type="button" className="btn btn-pri m-1" onClick={onSave}>
                  Save
                </button>
              </div>
            </div>
          )}

          <InPageLoading isLoading={isLoading} />
          <Footer />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ global, adminReducers: { widgetByRoleDetail } }, ownProps) => ({
  ...ownProps,
  ...widgetByRoleDetail,
  masterCodes: global.data.masterCodes,
});

const mapDispatchToProps = {
  saveAction,
  getMastercodeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WidgetByRoleDetail));
