import moment from 'moment-timezone';
import { toast } from 'react-toastify';
import { FilterType } from 'components/common/filter';
import XLSX from 'xlsx';
import update from 'react-addons-update';
import printJS from 'print-js';

import { isString, isArray, isBoolean, isFinite } from 'lodash';

const ua = window.navigator.userAgent;
const isIE = /MSIE|Trident|Edge\//.test(ua);

export const formikValidate = (value, validators) => {
  const required = 'Required';
  const phone = 'Invalid phone number';
  const number = 'Must be a number';
  const positive = 'Must be equal or greater than 0';
  const min = 'Must be equal or greater than ';
  const idNo = 'Must be a valid UEN/NRIC/FIN number';

  let message;
  validators.forEach((validator) => {
    const checkNumber = (value) => isFinite(Number(value)) && value?.match?.(/^[0-9]*$/);
    if (validator === 'required') {
      if (!value) {
        message = required;
      }
    }

    if (validator === 'phone') {
      if (value) {
        if (!value.match(/^[6|8|9]\d{7}$|^\+65[6|8|9]\d{7}$|^\+65\s[6|8|9]\d{7}$/)) {
          message = phone;
        }
      }
    }

    if (validator === 'idNo') {
      if (value) {
        if (!isValidUEN(value) && !isValid_NRIC_FIN(value)) {
          message = idNo;
        }
      }
    }

    if (validator === 'number') {
      if (value) {
        if (!checkNumber(value)) {
          message = number;
        }
      }
    }

    if (validator === 'positive') {
      if (value) {
        if (checkNumber(value)) {
          if (Number(value) < 0) {
            message = positive;
          }
        } else {
          message = number;
        }
      }
    }

    if (validator.includes('min')) {
      const compareValue = validator.split('=')[1];
      if (value) {
        if (checkNumber(value)) {
          if (Number(value) < compareValue) {
            message = min + compareValue;
          }
        } else {
          message = number;
        }
      }
    }
  });
  return message;
};

export const storeData = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.log('storeData', error);
  }
};

export const storeObject = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log('storeData', error);
  }
};

export const getData = (key) => {
  let res = '';
  try {
    res = localStorage.getItem(key);
  } catch (error) {
    console.log('getData', error);
  }
  return res;
};

export const getObject = (key) => {
  let res = {};
  try {
    res = JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.log('getData', error);
  }
  return res;
};

export const actionCreator = (actionName, extraField = []) => {
  const actionType = {
    NAME: actionName,
    PENDING: `${actionName}_PENDING`,
    SUCCESS: `${actionName}_SUCCESS`,
    ERROR: `${actionName}_ERROR`,
  };
  extraField.forEach((field) => {
    actionType[field] = `${actionName}_${field}`;
  });

  return actionType;
};

export const actionTryCatchCreator = async (service, onPending, onSuccess, onError, ignoreError = false) => {
  const env = process.env.REACT_APP_BUILD || 'development';
  try {
    if (onPending) onPending();
    const { status, data, functionName } = await service;
    if (status === 200) {
      const errorArrayTemp = data.errors || data.errorMessage || data.errorMessages || data.errorMessageList || [];
      const errorArray = Array.from(new Set(errorArrayTemp));
      if (!data.status || data.status === 'Pass') {
        if (onSuccess) onSuccess(data);
        if (errorArray.length > 0 && !ignoreError) {
          if (errorArray.join) {
            toast.error(errorArray.join(', '));
          } else {
            toast.error(errorArray);
          }
        }
      } else if (env !== 'development') throw String(`${errorArray.join(', ')}`);
      else throw String(`${functionName}: ${errorArray.join(', ')}`);
    } else if (env !== 'development') throw String(`HTTP code ${status}`);
    else throw String(`${functionName}: HTTP code ${status}`);
  } catch (error) {
    if (onError) onError(error);
    if (ignoreError) {
      return;
    }
    if (typeof error === 'object') {
      if (env !== 'development') toast.error(`${error.message || error.Message}`);
      else toast.error(`${error.functionName}: ${error.message || error.Message}`);
    } else {
      toast.error(error);
    }
    throw error;
  }
};

export const dateTimeFormatStrings = [
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

export const dateFormatString = 'DD/MM/YYYY';
export const dateTimeFormatString = 'DD/MM/YYYY hh:mm A';
export const time12FormatString = 'hh:mm A';
export const time24FormatString = 'HH:mm';

export const dateDBFormatString = 'YYYY-MM-DD';
export const timeDBFortmatString = 'HH:mm:ss';
export const dateTimeDBFormatString = 'YYYY-MM-DD HH:mm:ss';

export const dateStringFromDate = (date) => moment(date).format(dateFormatString);
export const dateStringDBFromDate = (date) => moment(date).format(dateDBFormatString);
export const dateTimeStringFromDate = (date) => moment(date).format(dateTimeFormatString);
export const dateTimeStringDBFromDate = (date) => moment(date).format(dateTimeDBFormatString);
export const time12StringFromDate = (date) => moment(date).format(time12FormatString);
export const time24StringFromDate = (date) => moment(date).format(time24FormatString);
export const dateFromString = (string) => moment(string, dateTimeFormatStrings);

export const dbDateTimeStringFrom = (date, time) => dateTimeStringDBFromDate(dateFromString(`${date} ${time}`));
export const dateAndTimeFromDB = (dateTime) => {
  if (!dateTime) {
    return ['', ''];
  }
  const date = dateFromString(dateTime);
  return [moment(date).format(dateDBFormatString), moment(date).format(timeDBFortmatString)];
};

export const filterFunc = (item, filterData) => {
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
      check = endDate.diff(dateCompare) >= 0 && check;
    }
    if (startDate) {
      check = dateCompare.diff(startDate) >= 0 && check;
    }
  }
  if (filterValue) {
    const keys = Object.keys(filterValue);
    keys.forEach((key) => {
      if (filterValue[key].type === FilterType.COMPARE) {
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
      } else if (filterValue[key]?.length > 0 && item[key]) {
        check = check && filterValue[key].includes(item[key]);
      } else if (!item[key] && filterValue[key]?.length > 0) {
        check = check && false;
      }
    });
  }
  return check;
};

const reA = /[^a-zA-Z]/g;
const reN = /[^0-9]/g;

const sortNumAlpha = (a, b) => {
  const sA = `${a}`;
  const sB = `${b}`;
  const aA = sA.replace(reA, '');
  const bA = sB.replace(reA, '');
  const aN = parseInt(sA.replace(reN, ''), 10);
  const bN = parseInt(sB.replace(reN, ''), 10);
  if (isNaN(aN) || isNaN(bN)) return aA >= bA ? 1 : -1;
  return aN >= bN ? 1 : -1;

  // if (aN === bN) {
  //   return aA > bA ? 1 : -1;
  // }
  // return aN === bN ? 0 : aN > bN ? 1 : -1;
};

export const sortAddress = (a, b) => {
  const listA = a.split(' ');
  const listB = b.split(' ');
  const minLength = Math.min(listA.length || 0, listB.length || 0);
  if (minLength === 0) {
    return a >= b ? 1 : -1;
  }
  for (let index = 0; index < minLength; index += 1) {
    const elementA = listA[index];
    const elementB = listB[index];
    if (elementA != elementB) {
      return sortNumAlpha(elementA, elementB);
    }
  }
  return a >= b ? 1 : -1;
  // return listA.length >= listB.length ? 1 : -1;
};

// const isAddress = (key = '') => {
//   const listOfKeys = ['address', 'road', 'street', 'location'];
//   const result = listOfKeys.reduce((prev, curr) => prev || key.toLowerCase().includes(curr), false);
//   return result;
// };

export const sortFuncV2 = (a, b, sortValue) => {
  const { id, desc, combineDateTime, isTimePeriod, sortType } = sortValue;
  const first = `${a[id] || ''}`.trim().toLowerCase();
  const second = `${b[id] || ''}`.trim().toLowerCase();
  if (sortType === 'date') {
    let firstDate = null;
    let secondDate = null;
    if (combineDateTime) {
      firstDate = moment(`${a[`${id}Date`]} ${a[`${id}Time`]}`, dateTimeFormatStrings, true);
      secondDate = moment(`${b[`${id}Date`]} ${b[`${id}Time`]}`, dateTimeFormatStrings, true);
    } else if (isTimePeriod) {
      firstDate = moment(first.split(' to ')[0] || '', dateTimeFormatStrings, true);
      secondDate = moment(second.split(' to ')[0] || '', dateTimeFormatStrings, true);
    } else {
      firstDate = moment(first, dateTimeFormatStrings, true);
      secondDate = moment(second, dateTimeFormatStrings, true);
    }

    if (firstDate.isValid() && !secondDate.isValid()) {
      return -1;
    }
    if (!firstDate.isValid() && secondDate.isValid()) {
      return 1;
    }
    if (firstDate.isValid() && secondDate.isValid()) {
      if (desc) {
        return firstDate.format('x') < secondDate.format('x') ? -1 : 1;
      }
      return firstDate.format('x') > secondDate.format('x') ? -1 : 1;
    }
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

  if (isBoolean(a[id]) && isBoolean(b[id])) {
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

export const sortFunc = (a, b, sortValue) => {
  const { id, desc, combineDateTime, isTimePeriod, sortType } = sortValue;
  const first = `${a[id] || ''}`.trim().toLowerCase();
  const second = `${b[id] || ''}`.trim().toLowerCase();
  let firstDate = null;
  let secondDate = null;
  if (combineDateTime) {
    firstDate = moment(`${a[`${id}Date`]} ${a[`${id}Time`]}`, dateTimeFormatStrings, true);
    secondDate = moment(`${b[`${id}Date`]} ${b[`${id}Time`]}`, dateTimeFormatStrings, true);
  } else if (isTimePeriod) {
    firstDate = moment(first.split(' to ')[0] || '', dateTimeFormatStrings, true);
    secondDate = moment(second.split(' to ')[0] || '', dateTimeFormatStrings, true);
  } else {
    firstDate = moment(first, dateTimeFormatStrings, true);
    secondDate = moment(second, dateTimeFormatStrings, true);
  }

  if (firstDate.isValid() && secondDate.isValid()) {
    if (desc) {
      return firstDate.isSameOrBefore(secondDate) ? 1 : -1;
    }
    return firstDate.isSameOrAfter(secondDate) ? 1 : -1;
  }

  if (firstDate.isValid() && !secondDate.isValid()) {
    return -1;
  }
  if (!firstDate.isValid() && secondDate.isValid()) {
    return 1;
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

  if (isBoolean(a[id]) && isBoolean(b[id])) {
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
    return first < second ? 1 : -1;
  }
  return first > second ? 1 : -1;
};

export const randomString = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export const getFilterArrayOfListForKey = (list, key) =>
  Array.from(
    new Set(
      (list || [])
        .map((item) => item[key])
        .filter((item) => item)
        .sort(sortNumAlpha),
    ),
  );

export const toQueryString = (params) => {
  if (typeof params === 'object') {
    return Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');
  }

  return '';
};

export const byteArrayToBlob = (array) => new Blob([new Uint8Array(array)]);

export const byteArrayToBase64 = (array) => btoa(new Uint8Array(array).reduce((data, byte) => data + String.fromCharCode(byte), ''));

export const base64ToUInt8Array = (base64) =>
  new Uint8Array(
    atob(base64)
      .split('')
      .map((c) => c.charCodeAt(0)),
  );

export const base64ToBlob = (b64Data, contentType) => {
  const type = contentType || '';

  const sliceSize = 512;
  let data = b64Data;
  data = b64Data.replace(/^[^,]+,/, '');
  data = b64Data.replace(/\s/g, '');
  const byteCharacters = window.atob(data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i += 1) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type });
};

export const autoGenerateDownloadLink = (fileName, mimeType, base64) => {
  if (isIE) {
    const saveBlob = navigator.msSaveBlob.bind(window.navigator) || navigator.msSaveOrOpenBlob.bind(window.navigator);
    const blob = base64ToBlob(base64, mimeType);
    saveBlob(blob, fileName);
  } else {
    const element = document.createElement('a');
    element.setAttribute('href', `data:${mimeType};base64,${encodeURIComponent(base64)}`);
    element.setAttribute('download', fileName);

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
};

export const autoGenerateDownloadLinkWithBlob = (fileName, blob) => {
  if (isIE) {
    const saveBlob = navigator.msSaveBlob.bind(window.navigator) || navigator.msSaveOrOpenBlob.bind(window.navigator);
    saveBlob(blob, fileName);
  } else {
    const element = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    element.setAttribute('href', url);
    element.setAttribute('download', fileName);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  }
};

export const isSampleRejected = (sample) => (sample?.rejectReasonCodes && sample?.rejectReasonCodes.length > 0) || sample?.rejectReasonOther;

export const filterOutSameItem = (array) => Array.from(new Set(array));

export const getMonthFromString = (mon) => {
  const d = Date.parse(`${mon}1, 2012`);
  if (!isNaN(d)) {
    return new Date(d).getMonth() + 1;
  }
  return -1;
};

export const isImageMimeType = (mimeType) => mimeType.includes('image');

export const openNewTab = (url) => {
  const tab = window.open(url, '_blank');
  if (tab != null) {
    tab.focus();
  }
};
export const printBase64 = (data) => {
  try {
    printJS({ printable: data, type: 'pdf', base64: true });
  } catch (error) {
    console.log('printBase64', error);
  }
};

export const unitSortFunc = (a, b) => {
  const floorA = Number(a?.floorNo || -1) || -1;
  const floorB = Number(b?.floorNo || -1) || -1;
  const noA = Number(a?.unitNo || -1) || -1;
  const noB = Number(b?.unitNo || -1) || -1;
  if (floorA === floorB) {
    return noA - noB;
  }
  return floorA - floorB;
};

export function firstDayInPreviousMonth(yourDate) {
  return new Date(yourDate.getFullYear(), yourDate.getMonth() - 1, 1);
}

export const configMissingFieldMessage = (count = 0, endText = '') => `There ${count < 2 ? 'is' : 'are'} ${count} missing required field${count < 2 ? '' : 's'}${endText}.`;

export const EPI_COB1_FILTER_FUNC = {
  OUTSIDE_CLUSTER: ({ postalCode = 0, homeNo = '', mobileNo = '', isImported = false, clusterId = '' }) =>
    postalCode != '999999' && (homeNo !== '' || mobileNo !== '') && !isImported && (clusterId === '' || clusterId === '0'), // Cases outside of cluster: (“Postal Code” is not “999999”) and (“Home Phone Number” or “Mobile Number” is not “empty”) and Status is not “Imported” and “Cluster ID” = “0”
  WITHOUT_ADDRESS: ({ postalCode = 0, homeNo = '', mobileNo = '', isImported = false }) => postalCode == '999999' && (homeNo !== '' || mobileNo !== '') && !isImported, // Cases without residential address: (“Postal Code” = “999999”) and (“Home Phone Number” or “Mobile Number” is not “empty”) and Status is not “Imported”
  WITHOUT_CONTACT: ({ postalCode = 0, homeNo = '', mobileNo = '', isImported = false }) => postalCode != '999999' && homeNo === '' && mobileNo === '' && !isImported, // Cases without contact number: (“Postal Code” is not “999999”) and (“Home Phone Number” and “Mobile Number” = “empty”) and Status is not “Imported”
  WITHOUT_ADDRESS_AND_CONTACT: ({ postalCode = 0, homeNo = '', mobileNo = '', isImported = false }) => postalCode == '999999' && homeNo === '' && mobileNo === '' && !isImported, // Cases without residential address and contact number: (“Postal Code” = “999999”) and (“Home Phone Number” and “Mobile Number” = “empty”) and Status is not “Imported” and “Cluster ID” = “0”
  IN_CLUSTER: ({ postalCode = 0, homeNo = '', mobileNo = '', isImported = false, clusterId = '' }) => {
    if (
      (postalCode == '999999' && (homeNo !== '' || mobileNo !== '') && !isImported) ||
      (postalCode != '999999' && homeNo === '' && mobileNo === '' && !isImported) ||
      (postalCode == '999999' && homeNo === '' && mobileNo === '' && !isImported)
    ) {
      return false;
    }
    // Cases in cluster: “Cluster ID” is not “0” and Status is not “Imported”
    return !isImported && clusterId !== '' && clusterId !== '0';
  },
  IMPORTED: ({ _postalCode = 0, _homeNo = '', _mobileNo = '', isImported = false, _clusterId = '' }) => isImported, // Imported cases: (“Status” = “Imported”)
};

export const ordinal_suffix_of = (i) => {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) {
    return `${i}st`;
  }
  if (j === 2 && k !== 12) {
    return `${i}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${i}rd`;
  }
  return `${i}th`;
};

export const arrayHasErrorField = (array = []) => array.reduce((acc, curr) => acc + Object.keys(curr).length, 0) > 0;

export const selectOptionsFromStringArray = (array) => array.map((item) => ({ label: item, value: item }));

export const randomDate = (start = moment(), end = moment().add(30, 'days')) => {
  const unix = start.unix() + Math.random() * (end.unix() - start.unix());
  return moment.unix(unix);
};

export const alphabet = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'AA',
  'AB',
  'AC',
  'AD',
  'AE',
  'AF',
  'AG',
  'AH',
  'AI',
  'AJ',
  'AK',
  'AL',
  'AM',
  'AN',
  'AO',
  'AP',
  'AQ',
  'AR',
  'AS',
  'AT',
  'AU',
  'AV',
  'AW',
  'AX',
  'AY',
  'AZ',
  'BA',
  'BB',
  'BC',
  'BD',
  'BE',
  'BF',
  'BG',
  'BH',
  'BI',
  'BJ',
  'BK',
  'BL',
  'BM',
  'BN',
  'BO',
  'BP',
  'BQ',
  'BR',
  'BS',
  'BT',
  'BU',
  'BV',
  'BW',
  'BX',
  'BY',
  'BZ',
];
export const exportExcel = (data = [], fileName, columns = []) => {
  const tableData = data.map((item) => {
    const temp = {};
    columns.forEach((column) => {
      const value = item[column.accessor];
      if (isArray(value)) {
        temp[column.accessor] = value.join(', ');
      } else if (isBoolean(value)) {
        temp[column.accessor] = value ? 'Yes' : 'No';
      } else {
        temp[column.accessor] = value;
      }
    });
    return temp;
  });

  let ws = XLSX.utils.json_to_sheet(tableData);

  if (tableData.length === 0) {
    // const temp = {};
    // columns.forEach((column) => {
    //   temp[column.accessor] = '';
    // });
    // tableData.push(temp);
    const placeholder = [];
    for (let i = 0; i < 2; i += 1) {
      const temp = [];
      for (let k = 0; k < 100; k += 1) {
        temp.push('');
      }
      placeholder.push(temp);
    }
    ws = XLSX.utils.aoa_to_sheet(placeholder);
    ws = update(ws, {
      A1: {
        v: {
          $set: 'NO RECORD FOUND',
        },
      },
    });
  } else {
    columns.forEach((column, index) => {
      ws = update(ws, {
        [`${alphabet[index]}1`]: {
          v: {
            $set: column.Header,
          },
        },
      });
    });
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const zeroPad = (num, places) => String(num).padStart(places, '0');

export const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const fullMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const monthIntToString = (int = 0, isUseFull = false) => {
  const list = isUseFull ? fullMonthNames : monthNames;
  return list[int] || '';
};

export const isValid_NRIC_FIN = (text) => {
  const multiplyModifiers = [2, 7, 6, 5, 4, 3, 2];
  const caseOneLetters = ['J', 'Z', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
  const caseTwoLetters = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'];

  if (!text || !isString(text) || text.length !== 9) return false;

  const firstLetter = text[0];
  const lastLetter = text[8];

  let totalNricFin = firstLetter === 'G' || firstLetter === 'T' ? 4 : 0;
  text.split('').forEach((char, index) => {
    if (index > 0 && index < 8) {
      totalNricFin += multiplyModifiers[index - 1] * Number(char);
    }
  });

  const modNumber = totalNricFin % 11;
  const lastLetterToBe = firstLetter === 'S' || firstLetter === 'T' ? caseOneLetters[modNumber] : caseTwoLetters[modNumber];
  return lastLetterToBe === lastLetter;
};

export const isValidUEN = (text) => {
  const { length } = text;

  // * 1. Length of UEN number can only be either 9 or 10.
  if (length !== 9 && length !== 10) return false;

  // * 2. Make sure last letter is an alphabet.
  const lastLetter = text[length - 1];
  if (!/^[a-zA-Z]+$/.test(lastLetter)) return false;

  // * 3. If length of string = 9 [A: Business registered with ACRA]
  if (length === 9) {
    // * verify the first 8 letters are digit
    const first8Letters = text.substring(0, 8);
    if (!/^[0-9]+$/.test(first8Letters)) return false;
    return true;
  }

  // * 4. If length of string = 10
  if (length === 10) {
    const letter5To9 = text.substring(4, 9);

    // * check if digit 5-9 is number.
    if (/^[0-9]+$/.test(letter5To9)) {
      // * If yes, it will belong to [B: Local companies registered with ACRA].
      return true;
    }

    // * If not, check if digit 6-9 is number
    const letter6To9 = text.substring(5, 9);
    if (/^[0-9]+$/.test(letter6To9)) {
      // * if yes it belongs to [C: All other entities which will be issued new UEN]

      // * validate the digit 1 is alphabet
      const firstLetter = text[0];
      if (!/^[a-zA-Z]+$/.test(firstLetter)) return false;

      // * digit 2-3 is number.
      const letter2To3 = text.substring(1, 3);
      if (!/^[0-9]+$/.test(letter2To3)) return false;

      // * Digit 4-5 should be letter matched with [Entity-Type Indicator]
      const entityTypeIndicators = [
        'LP',
        'LL',
        'FC',
        'PF',
        'RF',
        'MQ',
        'MM',
        'NB',
        'CC',
        'CS',
        'MB',
        'FM',
        'GS',
        'DP',
        'CP',
        'NR',
        'CD',
        'CM',
        'MD',
        'HS',
        'VH',
        'CH',
        'MH',
        'CL',
        'XL',
        'CX',
        'RP',
        'TU',
        'TC',
        'FB',
        'FN',
        'PA',
        'PB',
        'SS',
        'MC',
        'SM',
        'GA',
        'GB',
      ];
      const letter4To5 = text.substring(3, 5);
      if (!entityTypeIndicators.includes(letter4To5)) return false;

      return true;
    }

    return false;
  }

  return false;
};

export const stringToSlug = (str) => {
  let s = str;

  s = s.replace(/^\s+|\s+$/g, ''); // trim
  s = s.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
  const to = 'aaaaeeeeiiiioooouuuunc------';
  for (let i = 0, l = from.length; i < l; i += 1) {
    s = s.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  s = s
    .replace(/[^a-z0-9 -.]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return s;
};

export const yearNumberLOVFromNumber = (numberOfPrevYear = 5, numberOfNextYear = 0) => {
  const prev = Array.from(Array(numberOfPrevYear + 1).keys()).map((year) => {
    const thisYear = moment().get('year');
    return { label: `${thisYear - (numberOfPrevYear - year)}`, value: `${thisYear - (numberOfPrevYear - year)}` };
  });
  const next = Array.from(Array(numberOfNextYear).keys()).map((year) => {
    const thisYear = moment().get('year');
    return { label: `${thisYear + year + 1}`, value: `${thisYear + year + 1}` };
  });
  return [...prev, ...next];
};

/* To Title Case © 2018 David Gouch | https://github.com/gouch/to-title-case */

// eslint-disable-next-line no-extend-native
String.prototype.toTitleCase = function () {
  const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i;
  const alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/;
  const wordSeparators = /([ :–—-])/;

  return this.split(wordSeparators)
    .map((current, index, array) => {
      if (
        /* Check for small words */
        current.search(smallWords) > -1 &&
        /* Skip first and last word */
        index !== 0 &&
        index !== array.length - 1 &&
        /* Ignore title end and subtitle start */
        array[index - 3] !== ':' &&
        array[index + 1] !== ':' &&
        /* Ignore small words that start a hyphenated phrase */
        (array[index + 1] !== '-' || (array[index - 1] === '-' && array[index + 1] === '-'))
      ) {
        return current.toLowerCase();
      }

      /* Ignore intentional capitalization */
      if (current.substr(1).search(/[A-Z]|\../) > -1) {
        return current;
      }

      /* Ignore URLs */
      if (array[index + 1] === ':' && array[index + 2] !== '') {
        return current;
      }

      /* Capitalize the first letter */
      return current.replace(alphanumericPattern, (match) => match.toUpperCase());
    })
    .join('');
};
