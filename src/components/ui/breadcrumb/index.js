import uuid from 'uuid/v4';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { isObject } from 'lodash';

import './style.scss';

const BreadCrumb = (props) => {
  const { className, page, history } = props;

  const onClickUrl = (url) => {
    const index = history.previous.lastIndexOf(url);
    if (index > -1) {
      history.go(-(history.previous.length - index));
    } else {
      history.replace(url);
    }
  };

  const renderPage = () => {
    if (Array.isArray(page)) {
      return page.map((p, index) => (
        <React.Fragment key={uuid()}>
          /
          <li>
            <span
              onClick={() => {
                if (index !== page.length - 1) onClickUrl(p.url || '/');
              }}
              className={`cursor-pointer ${index === page.length - 1 ? 'text-blue' : ''}`}>
              {p.name}
            </span>
          </li>
        </React.Fragment>
      ));
    }

    if (isObject(page)) {
      return (
        <React.Fragment key={uuid()}>
          /
          <li>
            <span onClick={() => onClickUrl(page.url || '/')} className="cursor-pointer text-blue">
              {page.name}
            </span>
          </li>
        </React.Fragment>
      );
    }

    return null;
  };

  return (
    <nav className={`breadcrumb__main ${className || ''}`}>
      <div className="breadcrumbWrapper">
        <ul>
          <li>
            <span onClick={() => onClickUrl('/')} className="cursor-pointer">
              Home
            </span>
          </li>
          /
          <li>
            <span onClick={() => onClickUrl('/')} className="cursor-pointer">
              Vector Control System 2
            </span>
          </li>
          {/* {parent ? (
            <>
              /
              <li>
                <a href="#">{parent}</a>
              </li>
            </>
          ) : (
            ''
          )} */}
          {page && renderPage()}
        </ul>
      </div>
    </nav>
  );
};

BreadCrumb.defaultProps = {
  parent: '',
  page: '',
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BreadCrumb));
