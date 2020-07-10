import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './style.scss';

const MonthYearPicker = ({ label = '', selected = null, onChange = () => {}, dateFormat = 'MM/yyyy', minDate = null, maxDate = null }) => (
  <div>
    <b className="text-body">{label}</b>
    <DatePicker showMonthYearPicker showYearDropdown selected={selected} onChange={onChange} dateFormat={dateFormat} minDate={minDate} maxDate={maxDate} />
  </div>
);

export default MonthYearPicker;
