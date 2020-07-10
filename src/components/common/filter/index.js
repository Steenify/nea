import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { debounce, isEqual, forEach } from 'lodash';
import uuid from 'uuid/v4';

import { ReactComponent as FiltersIcon } from 'assets/svg/filter.svg';
import { ReactComponent as FiltersWhiteIcon } from 'assets/svg/filter-white.svg';

// import './style.scss';

export const FilterType = {
  SELECT: 'SELECT',
  SINGLE_SELECT: 'SINGLE_SELECT',
  SEARCH: 'SEARCH',
  COMPARE: 'COMPARE',
};

class Filter extends Component {
  constructor(props) {
    super(props);
    const { data } = props;
    const filteredDataValues = data.map((item) => {
      if (item.type === FilterType.SEARCH) {
        return item.values;
      }
      return null;
    });
    const selectedValues = data.map((item) => {
      if (item.type === FilterType.COMPARE) return { type: FilterType.COMPARE, values: [] };
      return item?.default || [];
    });
    this.state = {
      filteredDataValues,
      selectedValues,
      open: false,
    };

    this.filterSearch = debounce(this.filterSearch, 500);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.data, prevState.data)) {
      const { data } = nextProps;
      const filteredDataValues = data.map((item) => {
        if (item.type === FilterType.SEARCH) {
          return item.values;
        }
        return null;
      });
      const selectedValues = data.map((item) => {
        if (item.type === FilterType.COMPARE) return { type: FilterType.COMPARE, values: [] };
        return item?.default || [];
      });
      return { data: nextProps.data, filteredDataValues, selectedValues };
    }
    return null;
  }

  handleDocumentClick = (event) => {
    const { open } = this.state;
    if (open) {
      if (!findDOMNode(this).contains(event.target)) {
        this.setState({ open: false });
      }
    }
  };

  handleToggleState = (event) => {
    if (event) {
      event.preventDefault();
    }

    this.setState((oldState) => ({
      open: !oldState.open,
    }));
  };

  filterSearch = (index, text) => {
    const { data } = this.props;
    const { filteredDataValues } = this.state;
    const filteredValues = data[index].values.filter((item) => item.toLowerCase().includes(text.toLowerCase()));
    const newDataValues = filteredDataValues;
    newDataValues[index] = filteredValues;
    this.setState({
      filteredDataValues: newDataValues,
    });
  };

  onChangeValue = (index, value) => {
    const { selectedValues } = this.state;
    if (selectedValues[index].type === FilterType.COMPARE) {
      const { values } = selectedValues[index];
      const i = values.map((item) => item.comparision).indexOf(value.comparision);
      if (i >= 0) {
        values.splice(i, 1);
      } else {
        values.push(value);
      }
      selectedValues[index].values = values;
    } else {
      const i = selectedValues[index].indexOf(value);
      if (i >= 0) {
        selectedValues[index].splice(i, 1);
      } else {
        selectedValues[index].push(value);
      }
    }
    this.setState({
      selectedValues,
    });
  };

  onChangeSingleValue = (index, value) => {
    const { selectedValues } = this.state;
    const i = selectedValues[index].indexOf(value);
    const temp = selectedValues.map((item, index1) => {
      if (index === index1) {
        return i >= 0 ? [] : [value];
      }
      return item;
    });
    this.setState({
      selectedValues: temp,
    });
  };

  onCheckAll = (index) => {
    const { data } = this.props;
    const { selectedValues } = this.state;
    if (data[index].type === FilterType.COMPARE) {
      const isCheckedAll = selectedValues[index].values.length === data[index].values.length;
      selectedValues[index].values = isCheckedAll ? [] : data[index].values.map((item) => item);
    } else {
      const isCheckedAll = selectedValues[index].length === data[index].values.length;
      selectedValues[index] = isCheckedAll ? [] : data[index].values.map((item) => item);
    }
    this.setState({
      selectedValues,
    });
  };

  onClear = () => {
    const { onChange, data } = this.props;
    const returnData = {};
    const selectedValues = [];
    const filteredDataValues = [];

    data.forEach((item) => {
      selectedValues.push(item.type === FilterType.COMPARE ? { values: [], type: FilterType.COMPARE } : []);
      filteredDataValues.push(item.type === FilterType.SEARCH ? item.values : null);
      returnData[item.id] = [];
    });

    this.setState({
      selectedValues,
      filteredDataValues,
    });

    // this.handleToggleState();

    onChange(returnData);
  };

  onApply = () => {
    const { onChange, data } = this.props;
    const { selectedValues } = this.state;
    const returnData = {};
    const filteredDataValues = [];
    data.forEach((item, index) => {
      filteredDataValues.push(item.type === FilterType.SEARCH ? item.values : null);
      returnData[item.id] = selectedValues[index];
    });
    this.handleToggleState();
    onChange(returnData);
    this.setState({
      filteredDataValues,
    });
  };

  render() {
    const { className, data } = this.props;
    const { filteredDataValues, selectedValues, open } = this.state;
    const componentIndex = uuid();
    let isSelected = false;
    forEach(selectedValues, (item) => {
      if (item.length) {
        isSelected = true;
      }
      if (item.type === 'COMPARE' && item.values.length) {
        isSelected = true;
      }
    });

    return (
      <ul className={`filter__toggle  ${className || ''}`}>
        <li className={`nav-item dropdown position-static cursor-pointer text-blue ${isSelected ? 'active' : ''} ${open ? 'show' : ''}`}>
          <span className="nav-link dropdown-toggle" onClick={this.handleToggleState}>
            Filter
            <div style={{ marginLeft: 8, display: 'inline-block', pointerEvents: 'none' }}>{open || isSelected ? <FiltersWhiteIcon /> : <FiltersIcon />}</div>
          </span>
          <div className={`dropdown-menu ${open ? 'show' : ''}`}>
            <div className="filterColsCont">
              {data.map((item, index) => (
                <div
                  // className={`col-md-${12 / data.length}`}
                  className={`filterCols ${index === data.length - 1 ? 'filterColsLastItem' : ''}`}
                  key={`filter_item__${index.toString()}`}>
                  <div className="paddingBottom10 bold-font">{item.title}</div>
                  {item.type === FilterType.SEARCH && (
                    <>
                      {item.values.length > 0 && (
                        <div className="searchWrapper">
                          <input type="text" className="searchTextfield" placeholder={`Search ${item.title}`} onChange={(e) => this.filterSearch(index, e.target.value)} />
                        </div>
                      )}
                      <div className="chkboxCont">
                        {item.values.length > 0 && (
                          <div className="custom-control custom-checkbox paddingBottom5" key="filter_select_value__All">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`custom_select_check__${index + 1}_All_${componentIndex}`}
                              checked={selectedValues[index] && selectedValues[index].length === item.values.length}
                              onChange={() => this.onCheckAll(index)}
                            />
                            <label className="custom-control-label" htmlFor={`custom_select_check__${index + 1}_All_${componentIndex}`}>
                              All
                            </label>
                          </div>
                        )}
                        {filteredDataValues[index].map((value, i) => (
                          <div className="custom-control custom-checkbox paddingBottom5" key={`filter_search_value__${index.toString()}_${i.toString()}`}>
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`custom_search_check__${index + 1}_${i}_${componentIndex}`}
                              checked={selectedValues[index].includes(value)}
                              onChange={() => this.onChangeValue(index, value)}
                            />
                            <label className="custom-control-label" htmlFor={`custom_search_check__${index + 1}_${i}_${componentIndex}`}>
                              {value}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {item.type === FilterType.SELECT && (
                    <>
                      {item.values.length > 0 && (
                        <div className="custom-control custom-checkbox paddingBottom5" key="filter_select_value__All">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id={`custom_select_check__${index + 1}_All_${componentIndex}`}
                            checked={selectedValues[index] && selectedValues[index].length === item.values.length}
                            onChange={() => this.onCheckAll(index)}
                          />
                          <label className="custom-control-label" htmlFor={`custom_select_check__${index + 1}_All_${componentIndex}`}>
                            All
                          </label>
                        </div>
                      )}

                      <div style={{ overflowY: 'auto', overflowX: 'hidden', height: 152 }}>
                        {item.values.map((value, i) => (
                          <div className="custom-control custom-checkbox paddingBottom5" key={`filter_select_value__${i + 1}`}>
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`custom_select_check__${index + 1}_${i}_${componentIndex}`}
                              checked={selectedValues[index].includes(value)}
                              onChange={() => this.onChangeValue(index, value)}
                            />
                            <label className="custom-control-label" htmlFor={`custom_select_check__${index + 1}_${i}_${componentIndex}`}>
                              {value}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {item.type === FilterType.COMPARE && (
                    <>
                      {item.values.length > 0 && (
                        <div className="custom-control custom-checkbox paddingBottom5" key="filter_compare_value__All">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id={`custom_compare_check__${index + 1}_All_${componentIndex}`}
                            checked={selectedValues[index] && selectedValues[index].values.length === item.values.length}
                            onChange={() => this.onCheckAll(index)}
                          />
                          <label className="custom-control-label" htmlFor={`custom_compare_check__${index + 1}_All_${componentIndex}`}>
                            All
                          </label>
                        </div>
                      )}

                      <div style={{ overflowY: 'auto', overflowX: 'hidden', height: 152 }}>
                        {item.values.map((value, i) => (
                          <div className="custom-control custom-checkbox paddingBottom5" key={`filter_compare_value__${i + 1}`}>
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`custom_compare_check__${index + 1}_${i}_${componentIndex}`}
                              checked={selectedValues[index].values.map((a) => a.comparision).includes(value.comparision)}
                              onChange={() => this.onChangeValue(index, value)}
                            />
                            <label className="custom-control-label" htmlFor={`custom_compare_check__${index + 1}_${i}_${componentIndex}`}>
                              {value.title}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {item.type === FilterType.SINGLE_SELECT && (
                    <>
                      <div style={{ overflowY: 'auto', overflowX: 'hidden', height: 175 }}>
                        {item.values.map((value, i) => (
                          <div className="custom-control custom-checkbox paddingBottom5" key={`filter_select_value__${i + 1}`}>
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`custom_select_check__${index + 1}_${i}_${componentIndex}`}
                              checked={selectedValues[index].includes(value)}
                              onChange={() => this.onChangeSingleValue(index, value)}
                            />
                            <label className="custom-control-label" htmlFor={`custom_select_check__${index + 1}_${i}_${componentIndex}`}>
                              {value}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
              <div className="clearfix" />
            </div>

            <div className="filterBtnsCont">
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
              <div className="clearfix" />
            </div>
          </div>
        </li>
      </ul>
    );
  }
}

Filter.defaultProps = {
  statusFilter: true,
};

export default Filter;

// const mapStateToProps = () => ({});

// const mapDispatchToProps = {};

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(Filter);
