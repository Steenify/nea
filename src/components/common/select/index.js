import React from 'react';
import ReactSelect, { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import { ReactComponent as ArrowDownIcon } from 'assets/svg/down-arrow.svg';
import './style.scss';

const Select = (props) => {
  const {
    onChange,
    className,
    // selectClassName,
    name,
    // id,
    // label,
    options,
    // tag,
    value,
    inputValue,
    noRightCorner,
    noDefaultValue,
    isError,
    isClearable,
    isDisabled,
    small,
    isMulti,
    placeholder,
    isAppendToBody = true,
    // Props for Async Select
    isAsync,
    loadOptions,
    defaultOptions = true,
    cacheOptions,
    onKeyDown,
    selectRef,
  } = props;

  const reactSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderTopRightRadius: noRightCorner ? 0 : 10,
      borderBottomRightRadius: noRightCorner ? 0 : 10,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      minHeight: 40,
      boxShadow: 0,
      borderColor: isError ? 'red' : state.isFocused ? '#1c8ec6' : ' #ced4da',
      '&:hover': {
        borderColor: isError ? 'red' : '#1c8ec6',
      },
    }),
    input: (provided) => ({
      ...provided,
      padding: small ? '0 0' : '0 10px',
      color: '#1c8ec6',
    }),
    placeholder: (provided) => ({
      ...provided,
      padding: small ? 0 : 10,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#1c8ec6',
      padding: small ? 0 : 10,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#1c8ec6' : 'white',
      color: state.isSelected ? 'white' : '#1c8ec6',
      '&:hover': {
        backgroundColor: state.isSelected ? '#1c8ec6' : '#f4f4f4',
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 1000,
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 1000,
    }),
  };

  const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
      <ArrowDownIcon height={16} width={16} className="m-1" />
    </components.DropdownIndicator>
  );

  return (
    <div className={`form-group select_custom ${isMulti ? 'select_multi' : ''} ${className}`}>
      {isAsync ? (
        <AsyncSelect
          menuPortalTarget={isAppendToBody ? document.body : undefined}
          name={name}
          value={value}
          inputValue={inputValue}
          components={{ DropdownIndicator }}
          defaultValue={noDefaultValue ? (isMulti ? [] : null) : options[0]}
          styles={reactSelectStyles}
          isClearable={isClearable}
          isDisabled={isDisabled}
          placeholder={placeholder}
          openMenuOnFocus
          onChange={(item) => {
            if (isMulti) {
              if (onChange) onChange((item || []).map((a) => a.value));
            } else if (onChange) onChange(item);
          }}
          isMulti={isMulti}
          cacheOptions={cacheOptions}
          loadOptions={loadOptions}
          defaultOptions={defaultOptions}
          onKeyDown={onKeyDown}
          ref={selectRef}
          // closeMenuOnSelect={false}
        />
      ) : (
        <ReactSelect
          menuPortalTarget={isAppendToBody ? document.body : undefined}
          name={name}
          value={value}
          options={options}
          components={{ DropdownIndicator }}
          defaultValue={noDefaultValue ? (isMulti ? [] : null) : options[0]}
          styles={reactSelectStyles}
          isClearable={isClearable}
          isDisabled={isDisabled}
          placeholder={placeholder}
          onChange={(item) => {
            if (isMulti) {
              if (onChange) onChange((item || []).map((a) => a.value));
            } else if (onChange) onChange(item || undefined);
          }}
          isMulti={isMulti}
        />
      )}
    </div>
  );
};

Select.defaultProps = {
  onChange: () => {},
  options: [],
  className: '',
  name: '',
  id: '',
};

export default Select;
