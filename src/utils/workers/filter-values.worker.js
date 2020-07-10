/* eslint-disable */
// const fastSort = require('fast-sort');
// const _ = require('lodash');

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
};

const getFilterArrayOfListForKey = (list, key) =>
  Array.from(
    new Set(
      (list || [])
        .map((item) => item[key])
        .filter((item) => item)
        .sort(sortNumAlpha),
    ),
  );

// Respond to message from parent thread
self.addEventListener('message', (e) => {
  const { data = [], original = [] } = e.data;
  const temp = data.map((item) => {
    const values = item.values || getFilterArrayOfListForKey(original, item.id);
    return { ...item, values };
  });
  self.postMessage(temp);
});

self.addEventListener('error', (e) => {
  console.log('filter-values.worker error', e);
  e.preventDefault();
  self.postMessage([]);
});
