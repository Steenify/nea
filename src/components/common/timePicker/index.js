import React from 'react';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import { dateFromString } from 'utils';
import 'rc-time-picker/assets/index.css';

import { ReactComponent as TimePickerIcon } from 'assets/img/time-picker-icon.png';

const TimePickerInput = (props) => {
  const { onChangeTime, time, className, inputClassName, onOpen, onClose, placeholder = 'Time', use12Hours = true, showSecond = false } = props;
  const selectedTime = time ? dateFromString(time) || moment().minute(0) : null;

  const format = use12Hours ? (showSecond ? 'hh:mm:ss A' : 'hh:mm A') : showSecond ? 'HH:mm:ss' : 'HH:mm';

  const handleChangeTime = (time) => {
    if (onChangeTime) onChangeTime(time?.format(format) || '');
  };

  return (
    <TimePicker
      showSecond={showSecond}
      // defaultValue={selectedTime}
      value={selectedTime}
      className={className}
      onChange={handleChangeTime}
      inputClassName={inputClassName}
      format={format}
      use12Hours={use12Hours}
      placeholder={placeholder}
      inputIcon={TimePickerIcon}
      clearIcon={null}
      allowEmpty={false}
      onOpen={onOpen}
      onClose={onClose}
    />
  );
};

export default TimePickerInput;
