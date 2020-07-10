import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { DayPickerRangeController } from 'react-dates';
import TimePicker from 'components/common/timePicker';
import SingleDatePickerInput from 'components/common/singleDatePicker';
import { isEmpty } from 'lodash';
import Moment from 'moment';

import { ReactComponent as CalendarIcon } from 'assets/svg/calendar.svg';
import { ReactComponent as CalendarWhiteIcon } from 'assets/svg/calendar-white.svg';

import { dateStringFromDate, dateFromString, dateTimeStringFromDate } from 'utils';
import { toast } from 'react-toastify';
import 'bootstrap-daterangepicker/daterangepicker.css';
import './style.scss';

export const DateRangePickerSelectMode = {
  today: 'Today',
  yesterday: 'Yesterday',
  monthToDate: 'Month To Date',
  custom: 'Custom Date Range',
};

const maxYearRange = 1;

class DateRangePickerSelect extends Component {
  constructor(props) {
    super(props);
    const { selectData, data } = this.props;

    let startDate = null;
    let endDate = null;

    const today = Moment();
    const yesterday = Moment().add(-1, 'days');
    // const oneMonthAgo = Moment().add(-30, 'days');
    const startOfMonth = Moment().startOf('month');

    switch (data?.mode) {
      case DateRangePickerSelectMode.today:
        startDate = today;
        endDate = today;
        break;
      case DateRangePickerSelectMode.yesterday:
        startDate = yesterday;
        endDate = yesterday;
        break;
      case DateRangePickerSelectMode.monthToDate:
        // startDate = `${dateStringFromDate(oneMonthAgo)} 12:00 AM`;
        startDate = startOfMonth;
        endDate = today;
        break;
      default:
        startDate = data?.startDate;
        endDate = data?.endDate;
        break;
    }
    this.state = {
      startTime: '12:00 AM',
      endTime: '11:59 PM',
      selectedValue: selectData && selectData.length > 0 ? selectData[0].value : '',
      useExactField: selectData && selectData.length > 0 ? selectData[0].useExactField : false,
      focusedInput: 'startDate',
      // focused: true,
      open: false,
      timeOpen: false,
      mode: DateRangePickerSelectMode.custom,
      ...(data || {}),
      startDate,
      endDate,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
  }

  handleDocumentClick = (event) => {
    const { open, timeOpen } = this.state;
    if (open) {
      if (!findDOMNode(this).contains(event.target) && !timeOpen) {
        this.setState({ open: false });
      }
    }
  };

  toggle = (open) => {
    this.setState((prevState) => ({
      open: open === null || open === undefined ? !prevState.open : open,
      focusedInput: 'startDate',
    }));
  };

  onChangeSelect = (value, useExactField) => {
    this.setState({
      selectedValue: value,
      useExactField,
    });
  };

  onDatesChange = ({ startDate, endDate }) => {
    this.setState({ startDate, endDate });
  };

  onClear = () => {
    const { onChange, selectData, resetValue } = this.props;
    if (resetValue) {
      this.setState(resetValue);
      this.toggle(false);
      onChange(resetValue);
      return;
    }
    const data = {
      mode: DateRangePickerSelectMode.custom,
      startDate: null,
      startTime: '12:00 AM',
      endDate: null,
      endTime: '11:59 PM',
      selectedValue: selectData && selectData.length > 0 ? selectData[0].value : '',
      useExactField: selectData[0].useExactField,
    };
    this.setState({
      ...data,
    });
    this.toggle(false);
    // onChange(data);
    onChange(null);
  };

  onApply = () => {
    const { onChange } = this.props;
    const { startDate, endDate, selectedValue, startTime, endTime, useExactField, mode } = this.state;

    if (mode === DateRangePickerSelectMode.custom && (!startDate || !endDate)) {
      toast.error('Please select date range');
      return;
    }

    let startDateStr = `${dateStringFromDate(startDate)} ${startTime}`;
    let endDateStr = `${dateStringFromDate(endDate)} ${endTime}`;

    const today = Moment();
    const yesterday = Moment().add(-1, 'days');
    // const oneMonthAgo = Moment().add(-30, 'days');
    const startOfMonth = Moment().startOf('month');

    switch (mode) {
      case DateRangePickerSelectMode.today:
        startDateStr = `${dateStringFromDate(today)} 12:00 AM`;
        endDateStr = `${dateStringFromDate(today)} 11:59 PM`;
        break;
      case DateRangePickerSelectMode.yesterday:
        startDateStr = `${dateStringFromDate(yesterday)} 12:00 AM`;
        endDateStr = `${dateStringFromDate(yesterday)} 11:59 PM`;
        break;
      case DateRangePickerSelectMode.monthToDate:
        // startDateStr = `${dateStringFromDate(oneMonthAgo)} 12:00 AM`;
        startDateStr = `${dateStringFromDate(startOfMonth)} 12:00 AM`;
        endDateStr = `${dateStringFromDate(today)} 11:59 PM`;
        break;
      default:
        break;
    }

    this.toggle(false);
    onChange({
      startDate: dateFromString(startDateStr),
      endDate: dateFromString(endDateStr),
      selectedValue,
      useExactField,
    });
  };

  renderDate = (data) => <span>{data.date()}</span>;

  onChangeMode = (mode) => {
    // const {data} = this.props;
    // let startDate = data?.startDate;
    // let endDate = data?.endDate;
    // let startTime = '12:00 AM';
    // let endTime = '11:59 PM';
    // this.setState({ mode, startDate, endDate, startTime, endTime });

    this.setState({ mode });
  };

  render() {
    const { className, selectData, timePicker, singleDatePicker, data } = this.props;
    const { selectedValue, focusedInput, open, startTime, endTime, startDate, endDate, mode } = this.state;
    const today = Moment();
    const yesterday = Moment().subtract(1, 'days');
    const dataLength = selectData?.length || 0;

    const propStartDate = data?.startDate;
    const propEndDate = data?.endDate;

    const isActive = !isEmpty(data);

    // responsive mobile
    const isMobile = window.innerWidth < 768;
    let orientation = 'horizontal';
    if (isMobile) {
      orientation = 'vertical';
    }

    const isOutsideRange = (day) => {
      // if (!startDate && !endDate) return false;
      if (startDate) {
        const diffYear = startDate.startOf('days').diff(day.startOf('days'), 'years');
        return diffYear <= -maxYearRange;
      }
      if (endDate) {
        const diffYear = endDate.startOf('days').diff(day.startOf('days'), 'years');
        return diffYear >= maxYearRange;
      }
      return false;
    };

    return (
      <ul className={`datepicker__toggle  ${className || ''}`}>
        <li className={`nav-item dropdown position-static cursor-pointer text-blue ${isActive ? 'active' : ''} ${open ? 'show' : ''}`}>
          <span
            className="nav-link dropdown-toggle"
            onClick={(e) => {
              e.preventDefault();
              this.toggle(!open);
            }}>
            {singleDatePicker
              ? propStartDate && propEndDate
                ? `${dateStringFromDate(propStartDate)}`
                : 'Single Date Picker'
              : propStartDate && propEndDate && mode === DateRangePickerSelectMode.custom
              ? timePicker
                ? `${dateTimeStringFromDate(propStartDate)} - ${dateTimeStringFromDate(propEndDate)}`
                : `${dateStringFromDate(propStartDate)} - ${dateStringFromDate(propEndDate)}`
              : mode}
            <div style={{ marginLeft: 8, display: 'inline-block', pointerEvents: 'none' }}>
              {open || isActive ? <CalendarWhiteIcon width="20px" height="20px" /> : <CalendarIcon width="20px" height="20px" />}
            </div>
          </span>
          {open && (
            <div className="dropdown-menu show">
              <div className="row">
                {dataLength > 0 &&
                  selectData.map((item, index) => {
                    const key = `date_picker_select__${index.toString()}`;
                    return (
                      <div className="paddingLeft15 paddingRight10" key={key}>
                        <div className="custom-radio">
                          <input
                            className="form-input"
                            type="radio"
                            id={key}
                            name="date-range-picker-radio-group"
                            checked={selectedValue === item.value}
                            onChange={() => this.onChangeSelect(item.value, item.useExactField)}
                          />
                          <label className="form-label" htmlFor={key}>
                            {item.label}
                          </label>
                        </div>
                      </div>
                    );
                  })}
              </div>
              {singleDatePicker && (
                <>
                  <div className="row">
                    <div className="paddingLeft15 paddingRight10">
                      <span className="cursor-pointer text-blue font-weight-bold" onClick={() => this.onDatesChange({ startDate: today, endDate: today })}>
                        <u>Today</u>
                      </span>
                    </div>
                    <div className="paddingLeft15 paddingRight10">
                      <span className="cursor-pointer text-blue font-weight-bold" onClick={() => this.onDatesChange({ startDate: yesterday, endDate: yesterday })}>
                        <u>Yesterday</u>
                      </span>
                    </div>
                  </div>
                  <div className="clearfix datePickerColsCont">
                    <div id="datepicker-controller" className="datepicker-controller single-datepicker-controller">
                      <SingleDatePickerInput date={startDate} numberOfMonths={2} onChangeDate={(date) => this.onDatesChange({ startDate: date, endDate: date })} showCalendar="always" />
                    </div>
                  </div>
                </>
              )}
              {!singleDatePicker && (
                <>
                  <div className="row">
                    {Object.keys(DateRangePickerSelectMode).map((key, index) => (
                      <div className="m-3" key={`date_picker_mode_${index + 1}`}>
                        <span className={`cursor-pointer ${mode === DateRangePickerSelectMode[key] && 'text-blue font-weight-bold'}`} onClick={() => this.onChangeMode(DateRangePickerSelectMode[key])}>
                          <span>{DateRangePickerSelectMode[key]}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                  {mode === DateRangePickerSelectMode.custom && (
                    <div className="clearfix datePickerColsCont">
                      <div className="d-inline-flex align-items-center flex-wrap">
                        <span className="d-inline-block wf-50 text-center">From</span>
                        <SingleDatePickerInput
                          className="d-inline-block"
                          placeholder="Start Date"
                          showCalendar="never"
                          date={startDate}
                          isOutsideRange={isOutsideRange}
                          onChangeDate={(date) => this.onDatesChange({ startDate: date, endDate })}
                        />
                        {timePicker && (
                          <TimePicker
                            time={startTime}
                            className="m-1"
                            inputClassName="form-control d-inline wf-150 hf-48 m-1"
                            onOpen={() => this.setState({ timeOpen: true })}
                            onClose={() => this.setState({ timeOpen: false })}
                            onChangeTime={(time) => this.setState({ startTime: time })}
                          />
                        )}
                      </div>
                      <div className="d-inline-flex align-items-center flex-wrap">
                        <span className="d-inline-block wf-50 text-center">To</span>
                        <SingleDatePickerInput
                          className="d-inline-block"
                          placeholder="End Date"
                          showCalendar="never"
                          date={endDate}
                          isOutsideRange={isOutsideRange}
                          onChangeDate={(date) => {
                            this.onDatesChange({ startDate, endDate: date });
                          }}
                        />
                        {timePicker && (
                          <TimePicker
                            time={endTime}
                            className="m-1"
                            inputClassName="form-control d-inline wf-150 hf-48 m-1"
                            onOpen={() => this.setState({ timeOpen: true })}
                            onClose={() => this.setState({ timeOpen: false })}
                            onChangeTime={(time) => this.setState({ endTime: time })}
                          />
                        )}
                      </div>
                      <div id="datepicker-controller" className="datepicker-controller">
                        <DayPickerRangeController
                          startDate={startDate}
                          endDate={endDate}
                          onDatesChange={this.onDatesChange}
                          focusedInput={focusedInput}
                          onFocusChange={(focusedInput) => focusedInput && this.setState({ focusedInput })}
                          initialVisibleMonth={() => (!startDate ? today.subtract(1, 'months') : endDate)}
                          numberOfMonths={2}
                          isOutsideRange={isOutsideRange}
                          firstDayOfWeek={1}
                          renderDayContents={this.renderDate}
                          orientation={orientation}
                          minimumNights={0}
                        />
                      </div>
                      <div>Days selected: {endDate && startDate && endDate.diff(startDate, 'days')}</div>
                    </div>
                  )}
                </>
              )}

              <div className="filterBtnsCont clearfix">
                <div className="filterBtns">
                  <button type="button" className="btn btn-pri" onClick={this.onApply}>
                    Apply
                  </button>
                </div>
                <div className="filterBtns filterBtnsLastItem">
                  <button type="button" className="btn btn-sec" onClick={this.onClear}>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </li>
      </ul>
    );
  }
}

DateRangePickerSelect.defaultProps = {
  timePicker: true,
};

export default DateRangePickerSelect;

// const mapStateToProps = () => ({});

// const mapDispatchToProps = {};

// export default connect(mapStateToProps, mapDispatchToProps)(DateRangePickerSelect);
