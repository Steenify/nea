import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';

import { connect } from 'react-redux';

// import './style.scss';

const TabNav = (props) => {
  const { className, onToggleTab, activeTab, menu } = props;

  return (
    <Nav tabs>
      {menu.map((menu, index) => (
        <NavItem key={`tab_nav_${index + 1}`}>
          <NavLink
            className={`${className} ${activeTab === index.toString() ? 'active' : ''}`}
            onClick={() => {
              onToggleTab(index.toString());
            }}>
            {menu}
          </NavLink>
        </NavItem>
      ))}
    </Nav>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TabNav);
