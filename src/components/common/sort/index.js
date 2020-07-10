import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { isEmpty } from 'lodash';
import uuid from 'uuid/v4';

import { ReactComponent as SortDescBlue } from 'assets/svg/sort.svg';
import { ReactComponent as SortDescWhite } from 'assets/svg/sort-white.svg';
import { ReactComponent as SortAscBlue } from 'assets/svg/sort-asc.svg';
import { ReactComponent as SortAscWhite } from 'assets/svg/sort-asc-white.svg';

import './style.scss';

class Sort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
  }

  handleDocumentClick = (event) => {
    const { open } = this.state;
    if (open) {
      if (!findDOMNode(this).contains(event.target)) {
        this.setState({ open: false });
      }
    }
  };

  handleToggleState = (event) => {
    event.preventDefault();
    this.setState((oldState) => ({
      open: !oldState.open,
    }));
  };

  render() {
    const { className, value, desc, data, onChange } = this.props;
    const { open } = this.state;

    const isActive = !isEmpty(value);
    let Icon = null;

    if (desc) {
      Icon = isActive || open ? <SortDescWhite /> : <SortDescBlue />;
    } else {
      Icon = isActive || open ? <SortAscWhite /> : <SortAscBlue />;
    }

    const uniqeId = uuid();
    return (
      <ul className={`sortby__toggle  ${className || ''}`}>
        <li className={`nav-item dropdown position-static cursor-pointer text-blue ${isActive ? 'active' : ''} ${open ? 'show' : ''}`}>
          <span className="nav-link dropdown-toggle" id={`${uniqeId}_navbarSortDropdown`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={this.handleToggleState}>
            Sort: {value.label}
            <div style={{ marginLeft: 8, display: 'inline', pointerEvents: 'none' }}>{Icon}</div>
          </span>
          <div className={`dropdown-menu ${open ? 'show' : ''}`} aria-labelledby={`${uniqeId}_navbarSortDropdown`}>
            <div className="clearfix">
              <div className="sortList">
                <ul>
                  {data
                    .filter((item) => typeof item.Header === 'string' && !item.hideInSort)
                    .map((item, index) => {
                      const header = item.sortHeader || item.Header;
                      const accessor = item.sortAccessor || item.accessor;
                      return (
                        <li key={`popup_sort__${index.toString()}`}>
                          <span
                            className={`text-blue cursor-pointer ${value.label === header ? 'active' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              onChange({ ...item, id: accessor, label: header, desc, Cell: undefined });
                            }}>
                            {header}
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </div>

              <div className="sortBtnsCont">
                <div className="custom-radio paddingBottom5">
                  <input
                    className="form-input"
                    type="radio"
                    id={`${uniqeId}_ascending`}
                    name={`${uniqeId}_radio-group`}
                    checked={desc === false}
                    onChange={(e) => {
                      e.stopPropagation();
                      onChange({ ...value, desc: false });
                    }}
                  />
                  <label className="form-label" htmlFor={`${uniqeId}_ascending`}>
                    Ascending
                  </label>
                </div>
                <div className="custom-radio">
                  <input
                    className="form-input"
                    type="radio"
                    id={`${uniqeId}_descending`}
                    name={`${uniqeId}_radio-group`}
                    checked={desc === true}
                    onChange={(e) => {
                      e.stopPropagation();
                      onChange({ ...value, desc: true });
                    }}
                  />
                  <label className="form-label" htmlFor={`${uniqeId}_descending`}>
                    Descending
                  </label>
                </div>
                <div className="clearfix" />
              </div>
            </div>
          </div>
        </li>
      </ul>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Sort);
