const fastSort = require('fast-sort');
const _ = require('lodash');
const moment = require('moment');

const dateTimeFormatStrings = [
  'DD/MM/YYYY',
  'DD/MM/YYYY hh:mm',
  'DD/MM/YYYY hh:mm A',
  'DD/MM/YYYY HH:mm',
  'DD/MM/YYYY HH:mm:ss',
  'MM/DD/YYYY HH:mm:ss',
  'YYYY/MM/DD HH:mm:ss',
  'hh:mm A',
  'YYYY-MM-DD',
  'HH:mm:ss',
  'YYYY-MM-DD HH:mm:ss',
  'MMMM',
];

export const dateTimeDBFormatString = 'YYYY-MM-DD HH:mm:ss';

const filterFunc = (item, filterData) => {
  const { searchText, searchType, filterValue, datePickerValue } = filterData;
  let check = true;
  if (searchType && searchText) {
    check = searchText === '' || (item[searchType] && item[searchType].toString().toLowerCase().includes(searchText.toLowerCase()));
  }
  if (datePickerValue) {
    const { startDate, endDate, selectedValue, useExactField } = datePickerValue;
    let dateStr = '';
    if (useExactField) {
      dateStr = item[selectedValue];
    } else {
      dateStr = `${item[`${selectedValue}Date`]} ${item[`${selectedValue}Time`]}`;
    }

    const dateCompare = moment(dateStr, dateTimeFormatStrings);
    if (endDate) {
      check = moment(endDate, 'DD/MM/YYYY hh:mm A', true).diff(dateCompare) >= 0 && check;
    }
    if (startDate) {
      check = dateCompare.diff(moment(startDate, 'DD/MM/YYYY hh:mm A', true)) >= 0 && check;
    }
  }
  if (filterValue) {
    const keys = Object.keys(filterValue);
    keys.forEach((key) => {
      if (filterValue[key].type === 'COMPARE') {
        const floatValue = parseFloat(item[key]);
        if (isNaN(floatValue)) {
          check = false;
        } else {
          const { values } = filterValue[key];
          let count = 0;
          values.forEach((value) => {
            const valueCheck = Function(`return ${floatValue} ${value.comparision} `)();

            if (valueCheck === true) {
              count += 1;
            }
          });
          if (values.length > 0) check = count > 0 && check;
        }
      } else if (filterValue[key].length > 0 && item[key]) {
        check = check && filterValue[key].includes(item[key]);
      } else if (!item[key] && filterValue[key].length > 0) {
        check = check && false;
      }
    });
  }
  return check;
};

const sortFuncV2 = (a, b, sortValue) => {
  const { id, desc, combineDateTime, isTimePeriod, sortType } = sortValue;
  const first = `${a[id] || ''}`.trim().toLowerCase();
  const second = `${b[id] || ''}`.trim().toLowerCase();
  // if (sortType === 'date') {
  //   let firstDate = null;
  //   let secondDate = null;
  //   if (combineDateTime) {
  //     firstDate = moment(`${a[`${id}Date`]} ${a[`${id}Time`]}`, dateTimeFormatStrings, true);
  //     secondDate = moment(`${b[`${id}Date`]} ${b[`${id}Time`]}`, dateTimeFormatStrings, true);
  //   } else if (isTimePeriod) {
  //     firstDate = moment(first.split(' to ')[0] || '', dateTimeFormatStrings, true);
  //     secondDate = moment(second.split(' to ')[0] || '', dateTimeFormatStrings, true);
  //   } else {
  //     firstDate = moment(first, dateTimeFormatStrings, true);
  //     secondDate = moment(second, dateTimeFormatStrings, true);
  //   }

  //   if (firstDate.isValid() && !secondDate.isValid()) {
  //     return -1;
  //   }
  //   if (!firstDate.isValid() && secondDate.isValid()) {
  //     return 1;
  //   }
  //   if (firstDate.isValid() && secondDate.isValid()) {
  //     if (desc) {
  //       return firstDate.format('x') < secondDate.format('x') ? -1 : 1;
  //     }
  //     return firstDate.format('x') > secondDate.format('x') ? -1 : 1;
  //   }
  // }
  if (sortType === 'date') {
    let firstDate = null;
    let secondDate = null;
    firstDate = moment(first, 'DD/MM/YYYY', true).format(dateTimeDBFormatString);
    secondDate = moment(second, 'DD/MM/YYYY', true).format(dateTimeDBFormatString);
    if (desc) {
      return firstDate < secondDate ? -1 : 1;
    }
    return firstDate > secondDate ? -1 : 1;
  }
  if (sortType === 'time') {
    let firstDate = null;
    let secondDate = null;
    firstDate = moment(first, ['hh:mm A'], true).format(dateTimeDBFormatString);
    secondDate = moment(second, ['hh:mm A'], true).format(dateTimeDBFormatString);
    if (desc) {
      return firstDate < secondDate ? -1 : 1;
    }
    return firstDate > secondDate ? -1 : 1;
  }

  if (sortType === 'number') {
    const firstNumber = Number(first);
    const secondNumber = Number(second);
    if (isFinite(firstNumber) && isFinite(secondNumber)) {
      if (desc) {
        return firstNumber <= secondNumber ? 1 : -1;
      }
      return firstNumber >= secondNumber ? 1 : -1;
    }
    if (isNaN(firstNumber) && isFinite(secondNumber)) return 1;
    if (isFinite(firstNumber) && isNaN(secondNumber)) return -1;
  }

  if (_.isBoolean(a[id]) && _.isBoolean(b[id])) {
    const firstBool = a[id] ? 'Yes' : 'No';
    const secondBool = b[id] ? 'Yes' : 'No';
    if (desc) {
      return firstBool < secondBool ? 1 : -1;
    }
    return firstBool > secondBool ? 1 : -1;
  }

  if (first && !second) return -1;
  if (!first && second) return 1;

  if (desc) {
    return first < second ? -1 : 1;
  }
  return first > second ? -1 : 1;
};

// Respond to message from parent thread
self.addEventListener('message', (e) => {
  const { list = [], filterData } = e.data;
  const { searchText, filterValue, sortValue, datePickerValue } = filterData;
  const filterRequired =
    searchText ||
    datePickerValue ||
    Object.keys(filterValue || {})
      .map((key) => filterValue[key].length)
      .reduce((total, current) => total + current, 0) > 0;
  const newList = filterRequired ? list.filter((item) => filterFunc(item, filterData)) : list;
  const tagSorter = fastSort.default.createNewInstance({
    comparer: (a, b) => sortFuncV2(a, b, sortValue),
  });
  const sortedList = tagSorter(newList).desc();
  self.postMessage(sortedList);
});

self.addEventListener('error', (e) => {
  e.preventDefault();
  self.postMessage([]);
});
