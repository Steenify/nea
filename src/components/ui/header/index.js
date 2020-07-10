import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BroadcastMessageSlider from 'components/ui/broadcast-online-message-slider';

import Button from 'components/common/button';

import { ReactComponent as Avatar } from 'assets/svg/avatar.svg';
import { ReactComponent as Bell } from 'assets/svg/bell.svg';
import { ReactComponent as Megaphone } from 'assets/svg/megaphone.svg';
import { common } from 'assets';

import {
  toggleMenu,
  changeFontsize,
  listInAppNotificationAction,
  getAllFunctionsForRoleAction,
  getBroadcastOnlineMessageAction,
  toggleBroadcastOnlineMessageAction,
  logoutAction,
} from 'store/actions';

import { WEB_ROUTES, FUNCTION_NAMES } from 'constants/index';

import './style.scss';
import { storeData, getData } from 'utils';

class Header extends React.PureComponent {
  componentDidMount() {
    const { listInAppNotificationAction, getAllFunctionsForRoleAction, functionNameCallback, getBroadcastOnlineMessageAction, history } = this.props;
    const token = getData('token');
    if (token) {
      getAllFunctionsForRoleAction((data) => {
        if (functionNameCallback) functionNameCallback(data);
        if (data?.includes(FUNCTION_NAMES.getInAppNotificationList)) {
          listInAppNotificationAction({ showAll: false });
        }
        if (data?.includes(FUNCTION_NAMES.broadcastOnlineMessage)) {
          getBroadcastOnlineMessageAction();
        }
      });
    } else {
      history.push('/blocked');
    }
  }

  handleChangeFontSize = (event) => {
    event.preventDefault();
    const size = event.target.getAttribute('size');
    const { changeFontsizeAction } = this.props;
    changeFontsizeAction(size);
  };

  handleGotoNoti = (noti) => {
    const { history } = this.props;
    history.push(`${WEB_ROUTES.NON_FUNCTIONAL.INAPP_NOTIFICATION_DETAIL.url}`, {
      detail: noti,
    });
  };

  onLogOut = () => {
    const { history, logoutAction } = this.props;

    logoutAction(() => {
      storeData('token', '');
      storeData('comingFromLogin', '');
      storeData('functionNameList', '');
      history.push('/login');
    });
  };

  render() {
    const { className, toggleMenuAction, showMenu, userRole, notifications, broadcastOnlineMessages, isShowBroadcastOnlineMessages, toggleBroadcastOnlineMessageAction } = this.props;
    const isComingFromLogin = getData('comingFromLogin');
    return (
      <header className={`header__main ${className || ''}`}>
        <div className="bg-light-grey govtSite">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <img src={common.national__icon} alt="national__icon" />A Singapore Government Agency Website
              </div>
            </div>
          </div>
        </div>
        <div className="header">
          <div className="container">
            <div className="row paddingTop10 paddingBottom10">
              <div className="col-md-3 col-lg-2 col-5">
                <a href="/" title="NEA">
                  <img src={common.logo} alt="NEA" className="logoImg" />
                </a>
              </div>
              <div className="col-md-9 col-lg-10 col-7 text-right">
                <ul className="headerRHS">
                  <li>
                    <ul className="fontIncrease">
                      <li>
                        <span className="smallFont" size={14} onClick={this.handleChangeFontSize}>
                          A
                        </span>
                      </li>
                      <li>
                        <span className="mediumFont" size={16} onClick={this.handleChangeFontSize}>
                          A
                        </span>
                      </li>
                      <li>
                        <span className="bigFont" size={18} onClick={this.handleChangeFontSize}>
                          A
                        </span>
                      </li>
                    </ul>
                  </li>
                  {/* <li>
                    <Avatar className="avatarImg" />
                    <div className="userName">Ben Wong</div>
                  </li> */}
                  <li>
                    {process.env.REACT_APP_BUILD !== 'uat' && isComingFromLogin === 'true' ? (
                      <div className="notification">
                        <Avatar className="avatarImg" />
                        <span className="text-blue cursor-pointer userName">{userRole.name}</span>
                        <div className="notification__container wrap-content">
                          <div className="notification__list">
                            <span className="text-blue cursor-pointer notification__item" onClick={this.onLogOut}>
                              Log out
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link to="/login" className="userName">
                        {userRole.name}
                      </Link>
                    )}
                  </li>
                  <li className="p-0">
                    <div className="notification cursor-pointer">
                      <Megaphone className="bellImg notification__icon" onClick={broadcastOnlineMessages.length > 0 ? toggleBroadcastOnlineMessageAction : null} />
                      {!isShowBroadcastOnlineMessages && broadcastOnlineMessages.length > 0 && <div className="notification__available" />}
                    </div>
                  </li>
                  <li className="p-0">
                    <div className="notification cursor-pointer">
                      <Bell className="bellImg notification__icon" />
                      {notifications.filter((item) => !item.readFlag).length > 0 && <div className="notification__number">{notifications.filter((item) => !item.readFlag).length}</div>}
                      <div className="notification__container">
                        <div className="notification__list">
                          {notifications.length > 0 && (
                            <>
                              {notifications.map((item, index) => (
                                <Button onClick={this.handleGotoNoti} data={item} type="link" key={`notification_item_${index + 1}`} className={`notification__item ${!item.readFlag ? 'seen' : ''}`}>
                                  <div>
                                    <strong className="notification__name">{item.content}</strong>
                                    <p className="notification__des">{item.soeId}</p>
                                    <span className="notification__time">{item.submittedDate}</span>
                                  </div>
                                </Button>
                              ))}
                              <div className="notification__item text-center">
                                <Link to={WEB_ROUTES.NON_FUNCTIONAL.INAPP_NOTIFICATION_LIST.url}>
                                  <strong className="notification__name text-blue cursor-pointer">See All</strong>
                                </Link>
                              </div>
                            </>
                          )}
                          {notifications.length === 0 && (
                            <>
                              <div className="notification__item">
                                <strong className="notification__name">No Notifications</strong>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="ipadNavCont">
                    <button type="button" className="btn-link header__toggle" onClick={toggleMenuAction}>
                      <div className={`ipadNav ${showMenu ? 'on' : ''}`}>
                        <span />
                        <span />
                        <span />
                      </div>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {isShowBroadcastOnlineMessages && <BroadcastMessageSlider messages={broadcastOnlineMessages} onClose={toggleBroadcastOnlineMessageAction} />}
        </div>
      </header>
    );
  }
}

const mapStateToProps = ({ global }, ownProps) => ({
  ...ownProps,
  showMenu: global.ui.showMenu,
  userRole: global.ui.userRole,
  notifications: global.data.notifications,
  isShowBroadcastOnlineMessages: global.ui.isShowBroadcastOnlineMessages,
  broadcastOnlineMessages: global.data.broadcastOnlineMessages,
});
const mapDispatchToProps = {
  toggleMenuAction: toggleMenu,
  changeFontsizeAction: changeFontsize,
  listInAppNotificationAction,
  getAllFunctionsForRoleAction,
  getBroadcastOnlineMessageAction,
  toggleBroadcastOnlineMessageAction,
  logoutAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
