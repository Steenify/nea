/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { connect } from 'react-redux';

import Select from 'components/common/select';

import './style.scss';

const ShowList = (props) => {
  const { className, pageSize, totalItems, onChangePageSize, title, showListHidden, showListPosition, rightTitle, rightHeaderContent, disabled } = props;

  const options = [
    { label: 'Show 5', value: 5 },
    { label: 'Show 10', value: 10 },
    { label: 'Show 20', value: 20 },
    { label: 'Show 50', value: 50 },
  ];

  return (
    <div className={`showlist__main d-flex ${className || ''}`}>
      <div className="showListCont d-flex align-items-center flex-grow-1 pb-3 pt-3">
        {title && (
          <div className="showingTxt">
            <h3 className="d-inline mr-1">{title}</h3>
          </div>
        )}
        {!showListHidden && (
          <div className={`d-flex align-items-center justify-content-${showListPosition}`} style={{ flex: 1 }}>
            <div className="showingTxt">
              Showing {pageSize > totalItems ? totalItems : pageSize} of {totalItems}{' '}
            </div>
            <Select className="wf-150" options={options} onChange={onChangePageSize} isDisabled={disabled} />
          </div>
        )}
        {rightTitle && (
          <div className="showingTxt ml-auto">
            <h3 className="d-inline mr-1">{rightTitle}</h3>
          </div>
        )}
      </div>
      {rightHeaderContent}
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ShowList);
