import React, { useState, useEffect, useRef } from 'react';
import { findDOMNode } from 'react-dom';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';

import { randomString } from 'utils';

import { ReactComponent as CalendarIcon } from 'assets/svg/calendar.svg';

import './style.scss';

const SingleDatePickerInput = (props) => {
  const { date, onChangeDate, placeholder, numberOfMonths = 1, showCalendar, isOutsideRange = (day) => moment().diff(day) < 1, appendToBody, withPortal, renderCalendarInfo } = props;

  const fixedFocusedState = showCalendar === 'never' ? false : showCalendar === 'always';

  const [focused, setFocused] = useState(showCalendar ? fixedFocusedState : false);
  const datePickerRef = useRef(null);

  const today = moment();

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (focused && !appendToBody) {
        if (!findDOMNode(datePickerRef.current).contains(event.target)) {
          setFocused(showCalendar ? fixedFocusedState : false);
        }
      }
    };
    document.addEventListener('click', handleDocumentClick, false);

    return function cleanup() {
      document.removeEventListener('click', handleDocumentClick, false);
    };
  });

  const handleResize = () => {
    const dateRangePickerWrapper = document.getElementsByClassName('SingleDatePicker_picker')[0];
    // using setTimeout to use async stack and 'wait' while DateRangePicker_picker appending to the DOM
    setTimeout(() => {
      if (dateRangePickerWrapper) {
        const transforms = dateRangePickerWrapper.style.transform;
        // delete our previous translate();
        const initialTransforms = transforms.replace(/translate((-?\d+(?:.\d*)?)px, (-?\d+(?:.\d*)?)px)/g, '');
        // add transforms according to window pageYOffset
        dateRangePickerWrapper.style.transform = `${initialTransforms} translate(0, ${window.pageYOffset}px)`;
      }
    }, 1);
  };

  useEffect(() => {
    if (appendToBody) handleResize();
  }, [focused, appendToBody]);

  const handleDateChange = (date) => {
    if (!date) {
      return;
    }
    if (onChangeDate) onChangeDate(date);
  };

  const renderDate = (data) => <span>{data.date()}</span>;
  const initialVisibleMonth = () => date || today;

  return (
    <div className={`${props?.className}`}>
      <SingleDatePicker
        date={date}
        onDateChange={handleDateChange}
        focused={focused}
        onFocusChange={({ focused }) => setFocused(showCalendar ? fixedFocusedState : focused)}
        id={randomString()}
        ref={datePickerRef}
        noBorder
        displayFormat="DD/MM/YYYY"
        firstDayOfWeek={1}
        numberOfMonths={numberOfMonths}
        initialVisibleMonth={initialVisibleMonth}
        isOutsideRange={isOutsideRange}
        customInputIcon={<CalendarIcon width="20px" height="20px" />}
        inputIconPosition="after"
        placeholder={placeholder}
        renderDayContents={renderDate}
        appendToBody={appendToBody}
        withPortal={withPortal}
        disableScroll={withPortal}
        openDirection="down"
        renderCalendarInfo={renderCalendarInfo}
      />
    </div>
  );
};

SingleDatePickerInput.defaultProps = {
  renderCalendarInfo: () => {},
};

export default SingleDatePickerInput;
