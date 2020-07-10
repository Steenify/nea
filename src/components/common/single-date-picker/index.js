import React, {
  // useEffect, useState,
  PureComponent,
} from 'react';
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import moment from 'moment';
import enGb from 'date-fns/locale/en-GB';
import DatePicker, { registerLocale } from 'react-datepicker';

import ResetButton from 'components/common/reset-button';

import 'react-datepicker/dist/react-datepicker.css';

import { ReactComponent as CalendarIcon } from 'assets/svg/calendar.svg';
import { ReactComponent as ArrowLeft } from 'assets/svg/cal-left.svg';
import { ReactComponent as ArrowRight } from 'assets/svg/cal-right.svg';

import './style.scss';

registerLocale('en-gb', enGb);

class CustomInput extends PureComponent {
  render() {
    const { onClick, className } = this.props;
    return (
      <>
        <InputGroup>
          <Input {...this.props} className={`${className} textfield react-datepicker__input wf-150`} />
          <InputGroupAddon addonType="append" onClick={onClick}>
            <InputGroupText>
              <CalendarIcon width="20px" height="20px" />
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </>
    );
  }
}

const SingleDatePicker = (props) => {
  const { className, date, onChangeDate, placeholder, minDate, maxDate, inline, monthsShown, portalId, showReset = true } = props;

  const _date = moment.isMoment(date) ? date.toDate() : date;
  const _minDate = moment.isMoment(minDate) ? minDate.toDate() : minDate || moment().add(-process.env.REACT_APP_REPORT_PAST_YEAR, 'years').toDate();
  const _maxDate = moment.isMoment(maxDate) ? maxDate.toDate() : maxDate || moment().add(process.env.REACT_APP_REPORT_PAST_YEAR, 'years').toDate();

  const handleDateChange = (date) => {
    if (!date) {
      return;
    }
    if (onChangeDate) onChangeDate(moment(date));
  };

  return (
    <div className={`singleDatePickerV2 ${className}`}>
      <DatePicker
        // withPortal={isUsingPortal}
        // popperPlacement="bottom"
        popperModifiers={{
          flip: {
            behavior: ['bottom'], // don't allow it to flip to be above
          },
          preventOverflow: {
            enabled: false, // tell it not to try to stay within the view (this prevents the popper from covering the element you clicked)
          },
          hide: {
            enabled: false, // turn off since needs preventOverflow to be enabled
          },
        }}
        monthsShown={monthsShown}
        inline={inline}
        portalId={portalId}
        locale="en-gb"
        placeholderText={placeholder}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        peekNextMonth={false}
        dateFormat="dd/MM/yyyy"
        customInput={<CustomInput />}
        selected={_date}
        onChange={handleDateChange}
        renderDayContents={(day) => <span>{day}</span>}
        nextMonthButtonLabel={<ArrowRight width="20px" height="20px" />}
        previousMonthButtonLabel={<ArrowLeft width="20px" height="20px" />}
        minDate={_minDate}
        maxDate={_maxDate}>
        {showReset && <ResetButton onReset={() => onChangeDate(undefined)} />}
      </DatePicker>
    </div>
  );
};

export default SingleDatePicker;
