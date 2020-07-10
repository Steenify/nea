import React from 'react';
import { connect } from 'react-redux';

import ReactPaginate from 'react-paginate';

import './style.scss';

const Pagination = (props) => {
  const { className, totalPages, number, onClickPager, disabled } = props;

  if (totalPages <= 1) return <></>;
  return (
    <div className={`pagination__main ${className || ''}`}>
      <div className="paginationCont">
        {!disabled && (
          <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            breakLabel="..."
            initialPage={number}
            forcePage={number}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={({ selected }) => onClickPager(selected)}
            activeClassName="active"
            pageClassName="cursor-pointer"
            nextClassName={`cursor-pointer ${number >= totalPages - 1 && 'd-none'}`}
            previousClassName={`cursor-pointer ${number <= 0 && 'd-none'}`}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
