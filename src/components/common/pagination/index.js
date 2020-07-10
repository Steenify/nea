import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import ReactPaginate from 'react-paginate';

import './style.scss';

const Pagination = (props) => {
  const { className, totalPages, number, onClickPager, disabled } = props;
  const inputRef = useRef(null);

  const debounceChangePage = _.debounce((page) => {
    if (_.isFinite(page)) onClickPager(page);
  }, 500);

  const roundedTotalPage = Math.round(totalPages) < totalPages ? Math.round(totalPages) + 1 : Math.round(totalPages);

  const onChangeJumper = (e) => {
    const page = parseInt(e.target.value);
    // if (page > 0 && page <= roundedTotalPage) {
    //   debounceChangePage(page - 1);
    // }
    let target = page - 1;
    if (page <= 0) target = 0;
    if (page > roundedTotalPage) target = roundedTotalPage - 1;
    debounceChangePage(target);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = number + 1;
    }
  }, [number]);

  // if (roundedTotalPage <= 1) return <></>;
  return (
    <div className={`pagination__main ${className || ''}`}>
      <div className="paginationCont">
        {!disabled && roundedTotalPage > 1 && (
          <>
            <ReactPaginate
              previousLabel="Previous"
              nextLabel="Next"
              breakLabel="..."
              initialPage={number}
              forcePage={number}
              pageCount={roundedTotalPage}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={({ selected }) => onClickPager(selected)}
              activeClassName="active"
              pageClassName="cursor-pointer"
              nextClassName={`cursor-pointer ${number >= roundedTotalPage - 1 && 'd-none'}`}
              previousClassName={`cursor-pointer ${number <= 0 && 'd-none'}`}
            />
            <div>
              Go to page{' '}
              <input ref={inputRef} type="number" className="textfield wf-100 m-1 form-control d-inline" onChange={onChangeJumper} min={1} max={roundedTotalPage} defaultValue={number + 1} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
