import React from 'react';
import { Field, ErrorMessage, connect, getIn } from 'formik';
import _ from 'lodash';
import moment from 'moment';

import SearchableCheckList from 'components/common/searchable-check-list';
import SingleDatePickerInput from 'components/common/singleDatePicker';
import SingleDatePickerV2 from 'components/common/single-date-picker';
import TimePicker from 'components/common/timePicker';
import Select from 'components/common/select';
import DebounceInput from 'components/common/formik/debounce-input';
import CheckBox from 'components/common/checkbox';
import DropBox from 'components/common/dropbox';

import { dateFromString } from 'utils';

import './style.scss';
import DebounceTextarea from '../debounce-textarea';

class ValidationField extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { name, formik, options, disabled, inputComponent, isOutsideRange, alwaysUpdate } = this.props;
    if (alwaysUpdate) return true;
    let result = false;
    if (nextProps.name !== name) {
      result = true;
    }
    if (nextProps.disabled !== disabled) {
      result = true;
    }
    if (nextProps.inputComponent !== inputComponent) {
      result = true;
    }
    if (_.differenceWith(nextProps.options, options, _.isEqual).length > 0) {
      result = true;
    }

    const nextTouched = getIn(nextProps.formik.touched, name);
    const previousTouched = getIn(formik.touched, name);
    if (nextTouched !== previousTouched) {
      result = true;
    }

    const nextValue = getIn(nextProps.formik.values, name);
    const previousValue = getIn(formik.values, name);
    if (nextValue !== previousValue) {
      result = true;
    }

    const nextError = getIn(nextProps.formik.errors, name);
    const previousError = getIn(formik.errors, name);
    if (_.differenceWith(nextError, previousError, _.isEqual).length > 0) {
      result = true;
    }
    if (nextError !== previousError) {
      result = true;
    }

    if (inputComponent === 'singleDatePicker' && isOutsideRange) {
      result = true;
    }
    return result;
  }

  render() {
    const {
      noDebounce,
      id,
      name,
      type,
      value,
      placeholder,
      children,
      inputClassName,
      inputComponent,
      errorComponent,
      errorClassName,
      selectClassName,
      noPortal,
      hideError,
      onChange,
      rows,
      disabled,
      options,
      // optionsCompareField = 'value',
      isOutsideRange,
      // * singleDatePickerV2
      minDate,
      maxDate,
      // * Select
      isAsync,
      loadOptions,
      isClearable = true,
      // *
      formik,
      // small,
      appendToBody,
      withPortal,
      label,
      use12Hours,
      showSecond,
      title,
      submissionType,
      dateFormat = 'DD/MM/YYYY',
      deleteLocally,
      min,
      innerRef,
    } = this.props;

    const error = getIn(formik.errors, name);
    const touched = getIn(formik.touched, name);
    const isError = error && touched;
    const fieldProps = {
      className: `${inputComponent === 'checkbox' ? '' : 'form-control'} ${inputClassName} ${isError ? 'form-error' : ''}`,
    };
    if (id) fieldProps.id = id;
    if (inputComponent) fieldProps.component = inputComponent;
    if (type) fieldProps.type = type;
    if (name) fieldProps.name = name;
    if (placeholder) fieldProps.placeholder = placeholder;
    if (disabled !== undefined && disabled !== null) fieldProps.disabled = disabled;
    if (min) fieldProps.min = min;
    //if (rows) fieldProps.rows = rows;
    fieldProps.rows = rows || 3;
    if (onChange) fieldProps.onChange = onChange;
    if (value) fieldProps.value = value;

    const renderField = () => {
      const currentValue = getIn(formik.values, name);
      const { setFieldValue } = formik;

      if (inputComponent === 'select') {
        return (
          <div className="form-group">
            <div className={`showList ${selectClassName}`}>
              <Field {...fieldProps}>{children}</Field>
            </div>
          </div>
        );
      }

      if (inputComponent === 'react-select') {
        const selectedValue = options ? options.find((option) => option.value === currentValue || option.label === currentValue) || '' : '';
        return (
          <Select
            loadOptions={loadOptions}
            isAsync={isAsync}
            isAppendToBody={!noPortal}
            name={name}
            placeholder={placeholder}
            value={selectedValue}
            options={options || []}
            isClearable={isClearable}
            isDisabled={disabled}
            noDefaultValue
            isError={isError}
            className={selectClassName}
            small
            onChange={(item) => {
              const value = item?.value || undefined;
              if (setFieldValue) setFieldValue(name, value);
              if (onChange) onChange(value);
            }}
          />
        );
      }

      if (inputComponent === 'react-multi-select') {
        let arrayValue = currentValue;
        if (typeof arrayValue === 'string') {
          arrayValue = arrayValue.split(',');
        }
        const temp = arrayValue || [];
        const selectedValue = options ? options.filter((option) => temp.includes(option.value) || temp.includes(option.label)) || [] : [];
        return (
          <Select
            menuPortalTarget={document.body}
            name={name}
            placeholder={placeholder}
            value={selectedValue}
            options={options || []}
            isClearable={isClearable}
            isDisabled={disabled}
            noDefaultValue
            isError={isError}
            className={selectClassName}
            small
            isMulti
            onChange={(values) => {
              if (setFieldValue) setFieldValue(name, values);
              if (onChange) onChange(values);
            }}
          />
        );
      }

      if (inputComponent === 'searchable-check-list') {
        const selectedValue = options ? options.filter((option) => currentValue && currentValue.includes(option.value)) || [] : [];

        return (
          <SearchableCheckList
            name={name}
            placeholder={placeholder}
            isError={isError}
            className={selectClassName}
            options={options || []}
            data={selectedValue}
            title={title}
            onChange={(list) => {
              const values = list.map((item) => item.value);
              if (setFieldValue) setFieldValue(name, values);
              if (onChange) onChange(values);
            }}
          />
        );
      }

      if (inputComponent === 'timePicker') {
        return (
          <TimePicker
            inputClassName={`form-control ${inputClassName} ${isError ? 'form-error' : ''} m-1`}
            time={currentValue}
            placeholder={placeholder}
            use12Hours={use12Hours}
            showSecond={showSecond}
            onChangeTime={(time) => {
              if (setFieldValue) setFieldValue(name, time);
              if (onChange) onChange(time);
            }}
          />
        );
      }

      if (inputComponent === 'singleDatePicker') {
        const date = currentValue ? dateFromString(currentValue) : null;
        return (
          <SingleDatePickerInput
            date={date}
            className={`${inputClassName} ${isError ? 'form-error' : ''}`}
            isOutsideRange={isOutsideRange}
            appendToBody={appendToBody}
            withPortal={withPortal}
            placeholder={placeholder}
            onChangeDate={(date) => {
              const value = date ? moment(date).format(dateFormat) : '';
              if (setFieldValue) setFieldValue(name, value);
              if (onChange) onChange(value);
            }}
          />
        );
      }

      if (inputComponent === 'singleDatePickerV2') {
        const date = currentValue ? dateFromString(currentValue) : undefined;
        return (
          <SingleDatePickerV2
            date={date}
            placeholder={placeholder}
            className={`${inputClassName} ${isError ? 'form-error' : ''}`}
            onChangeDate={(date) => {
              const value = date ? moment(date).format(dateFormat) : '';
              if (setFieldValue) setFieldValue(name, value);
              if (onChange) onChange(value);
            }}
            minDate={minDate}
            maxDate={maxDate}
          />
        );
      }

      if (type === 'radio') {
        return (
          <input
            {...fieldProps}
            className={`form-input ${inputClassName} ${isError ? 'form-error' : ''}`}
            checked={currentValue === value}
            onChange={() => {
              formik.setFieldValue(name, value);
              if (onChange) onChange(value);
            }}
          />
        );
      }

      if (inputComponent === 'dropbox') {
        const fileList = currentValue || [];
        return (
          <DropBox
            size="sm"
            submissionType={submissionType}
            fileIdList={fileList.map(({ fileId }) => fileId)}
            deleteLocally={deleteLocally}
            onChange={(fileList) => {
              if (setFieldValue) {
                const fileIds = fileList.map((file) => ({ fileId: file.fileId, fileName: file?.fileName || '' }));
                setFieldValue(name, fileIds);
              }
              if (onChange) {
                onChange(fileList);
              }
            }}
          />
        );
      }

      if (inputComponent === 'checkbox') {
        return (
          <CheckBox
            {...fieldProps}
            checked={currentValue}
            label={label}
            onChange={(e) => {
              if (setFieldValue) setFieldValue(name, e?.target?.checked || false);
              if (onChange) onChange(e?.target?.checked || false);
            }}
          />
        );
      }

      const setInputValue = (event) => {
        const { value } = event.target;
        formik.setFieldValue(name, value);
      };

      if (inputComponent === 'textarea') {
        return (
          <DebounceTextarea
            {...fieldProps}
            value={currentValue}
            onBlur={(debounceValue) => {
              formik.setFieldTouched(name, true, false);
              formik.setFieldValue(name, debounceValue);
              if (onChange) onChange(debounceValue);
            }}
          />
        );
      }

      return noDebounce ? (
        <input
          {...fieldProps}
          value={currentValue}
          onChange={(event) => {
            event.persist();
            setInputValue(event);
          }}
          onBlur={() => formik.setFieldTouched(name, true)}
          ref={innerRef}
        />
      ) : (
        <DebounceInput
          {...fieldProps}
          value={currentValue}
          onBlur={(debounceValue) => {
            formik.setFieldTouched(name, true, false);
            formik.setFieldValue(name, debounceValue);
            if (onChange) onChange(debounceValue);
          }}
        />
      );
    };

    return (
      <>
        {renderField()}
        {!hideError && <ErrorMessage className={`col-form-error-label ${errorClassName}`} name={name} component={errorComponent || 'div'} />}
      </>
    );
  }
}

export default connect(ValidationField);
