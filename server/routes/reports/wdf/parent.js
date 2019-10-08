// Local Authority user's report
'use strict';

// external node modules
const moment = require('moment');
const fs = require('fs');
const walk = require('walk');
const JsZip = new require('jszip');

const Establishment = require('../../../models/classes/establishment').Establishment;
const parentWDFData = rfr('server/data/parentWDFReport');

// for database
const models = require('../../../models');


// Constants string needed by this file in several places
const folderName = 'template';
const overviewSheetName = 'xl/worksheets/sheet1.xml';
const establishmentsSheetName = 'xl/worksheets/sheet2.xml';
const workersSheetName = 'xl/worksheets/sheet3.xml';
const sharedStringsName = 'xl/sharedStrings.xml';
const schema = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const isNumberRegex = /^[0-9]+(\.[0-9]+)?$/;
// const debuglog = console.log.bind(console);
const debuglog = () => {};

// XML DOM manipulation helper functions
const { DOMParser, XMLSerializer } = new (require('jsdom').JSDOM)().window;

const parseXML = fileContent =>
  (new DOMParser()).parseFromString(fileContent.toString('utf8'), 'application/xml');

const serializeXML = dom =>
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
  (new XMLSerializer()).serializeToString(dom);

// helper function to set a spreadsheet cell's value
const putStringTemplate = (
  sheetDoc,
  stringsDoc,
  sst,
  sharedStringsUniqueCount,
  element,
  value
) => {
  let vTag = element.querySelector('v');
  const hasVTag = vTag !== null;
  const textValue = String(value);
  const isNumber = isNumberRegex.test(textValue);

  if (!hasVTag) {
    vTag = sheetDoc.createElementNS(schema, 'v');

    element.appendChild(vTag);
  }

  if (isNumber) {
    element.removeAttribute('t');
    vTag.textContent = textValue;
  } else {
    element.setAttribute('t', 's');

    const si = stringsDoc.createElementNS(schema, 'si');
    const t = stringsDoc.createElementNS(schema, 't');

    sst.appendChild(si);
    si.appendChild(t);

    t.textContent = textValue;
    vTag.textContent = sharedStringsUniqueCount[0];

    sharedStringsUniqueCount[0] += 1;
  }
};

const getReportData = async (date, thisEstablishment) => {
  // for the report
  const establishmentId = thisEstablishment.id;

  // first run the report, which means running the `cqc.parentWdfReport` function.
  // this function runs in a single transaction
  // the function returns true or false; encapsulating any SQL exceptions.
  const params = {
    establishmentId: establishmentId
  };

  debuglog('wdf parent excel report data started:', params);

  const establishmentData = await parentWDFData.getEstablishmentData(params);
  debugger;

  const reportData = {
    date: date.toISOString(),
    parentName: 'Parent Name',

    establishments: [{
      // overview tab
      subsidiaryName: 'Subsidiary Name',
      subsidiarySharingPermissions: false,
      currentWdfEligibilityStatus: false,
      dateEligibilityAchieved: '2019-09-18',
      isDataFullyCompleted: false,
      updatedInCurrentFinancialYear: false,
      totalWorkersCount: 10,
      workerRecordsCount: 9,
      completedWorkerRecordsCount: 8,
      completedWorkerRecordsPercentage: 100.0,

      // establishments tab
      establishmentType: 'Establishment Type',
      mainService: 'Main Service',
      mainServiceCapacity: 10,
      mainServiceUtilisation: 9,
      otherServices: 'Other Services',
      serviceUsers: 'Service Users',
      investorsInPeopleStatus: false,
      updatedLastDate: '2017-09-19',
      workersWithRecordsPercentage: 90.0,
      startersInLast12Months: 5,
      leaversInLast12Months: 6,
      vacanciesOnCompletionDateCount: 1,
      leavingReasonsCountEqualsLeavers: true,
      leavingDestinationCountEqualsLeavers: true,
      startersByJobRoleCountEqualsTotalStarters: true,
      leaversByJobRoleEqualsTotalLeavers: true,
      vacanciesByJobRoleEqualsTotalVacancies: true,
      totalWorkersCountGTEWorkerRecords: false
    }],

    workers: [{
      localId: 'Local Id',
      subsidiaryName: 'Subsidary Name',
      gender: 'Gender',
      dateOfBirth: '2019-09-17',
      nationality: 'Nationality',
      mainJobRole: 'Main Job Role',
      mainJobDateStarted: '2019-09-19',
      recruitmentSource: 'Recruitment Source',
      employmentStatus: 'Employment Status',
      contractedHours: '37.5',
      additionalHours: '0',
      fullTimeStatus: 'Full Time Status',
      isZeroHoursContract: false,
      sicknessDays: '1',
      payInterval: 'Pay Interval',
      rateOfPay: '60',
      inductionStatus: 'Induction Status',
      careCertificate: 'Care Certificate',
      highestQualificationHeld: 'Highest Qualification Held',
      lastFullyUpdatedDate: '2019-09-19'
    }]
  };

  debuglog('LA user report data finished:', params, reportData.establishments.length, reportData.workers.length);

  return reportData;
};

const styleLookup = {
  BLACK: {
    OVRREGULAR: {
      A: 2,
      B: 6,
      C: 7,
      D: 8,
      E: 9,
      F: 15,
      G: 11,
      H: 12,
      I: 12,
      J: 12,
      K: 13
    },
    OVRLAST: {
      A: 2,
      B: 16,
      C: 17,
      D: 18,
      E: 19,
      F: 20,
      G: 21,
      H: 22,
      I: 22,
      J: 22,
      K: 23
    },
    ESTREGULAR: {
      A: 2,
      B: 6,
      C: 7,
      D: 24,
      E: 15,
      F: 12,
      G: 12,
      H: 15,
      I: 15,
      J: 15,
      K: 26,
      L: 27,
      M: 12,
      N: 28,
      O: 27,
      P: 12,
      Q: 29,
      R: 24,
      S: 15,
      T: 15,
      U: 15,
      V: 15,
      W: 26
    },
    ESTLAST: {
      A: 2,
      B: 16,
      C: 17,
      D: 31,
      E: 20,
      F: 22,
      G: 22,
      H: 20,
      I: 20,
      J: 20,
      K: 32,
      L: 33,
      M: 22,
      N: 34,
      O: 33,
      P: 22,
      Q: 35,
      R: 31,
      S: 20,
      T: 20,
      U: 20,
      V: 20,
      W: 32
    },
    WKRREGULAR: {
      A: 2,
      B: 38,
      C: 15,
      D: 15,
      E: 15,
      F: 15,
      G: 15,
      H: 15,
      I: 15,
      J: 15,
      K: 25,
      L: 25,
      M: 10,
      N: 39,
      O: 12,
      P: 15,
      Q: 25,
      R: 15,
      S: 15,
      T: 15,
      U: 60,
      V: 61
    },
    WKRLAST: {
      A: 2,
      B: 41,
      C: 20,
      D: 20,
      E: 20,
      F: 20,
      G: 20,
      H: 20,
      I: 20,
      J: 20,
      K: 22,
      L: 22,
      M: 20,
      N: 42,
      O: 22,
      P: 20,
      Q: 22,
      R: 20,
      S: 20,
      T: 20,
      U: 62,
      V: 63
    }
  },
  RED: {
    OVRREGULAR: {
      A: 2,
      B: 6,
      C: 7,
      D: 8,
      E: 9,
      F: 15,
      G: 11,
      H: 12,
      I: 12,
      J: 12,
      K: 13
    },
    OVRLAST: {
      A: 2,
      B: 16,
      C: 17,
      D: 18,
      E: 19,
      F: 20,
      G: 21,
      H: 22,
      I: 22,
      J: 22,
      K: 23
    },
    ESTREGULAR: {
      A: 2,
      B: 6,
      C: 7,
      D: 24,
      E: 15,
      F: 12,
      G: 12,
      H: 15,
      I: 15,
      J: 15,
      K: 26,
      L: 27,
      M: 12,
      N: 28,
      O: 27,
      P: 12,
      Q: 29,
      R: 24,
      S: 15,
      T: 15,
      U: 15,
      V: 15,
      W: 26
    },
    ESTLAST: {
      A: 2,
      B: 16,
      C: 17,
      D: 31,
      E: 20,
      F: 22,
      G: 22,
      H: 20,
      I: 20,
      J: 20,
      K: 32,
      L: 33,
      M: 22,
      N: 34,
      O: 33,
      P: 22,
      Q: 35,
      R: 31,
      S: 20,
      T: 20,
      U: 20,
      V: 20,
      W: 32
    },
    WKRREGULAR: {
      A: 2,
      B: 38,
      C: 15,
      D: 15,
      E: 15,
      F: 15,
      G: 15,
      H: 15,
      I: 15,
      J: 15,
      K: 25,
      L: 25,
      M: 10,
      N: 39,
      O: 12,
      P: 15,
      Q: 25,
      R: 15,
      S: 15,
      T: 15,
      U: 60,
      V: 61
    },
    WKRLAST: {
      A: 2,
      B: 41,
      C: 20,
      D: 20,
      E: 20,
      F: 20,
      G: 20,
      H: 20,
      I: 20,
      J: 20,
      K: 22,
      L: 22,
      M: 20,
      N: 42,
      O: 22,
      P: 20,
      Q: 22,
      R: 20,
      S: 20,
      T: 20,
      U: 62,
      V: 63
    }
  }
};

const setStyle = (cellToChange, columnText, rowType, isRed) => {
  cellToChange.setAttribute('s', styleLookup[isRed ? 'RED' : 'BLACK'][rowType][columnText]);
};

const updateOverviewSheet = (
  overviewSheet,
  reportData,
  sharedStrings,
  sst,
  sharedStringsUniqueCount
) => {
  debuglog('updating overview sheet');

  const putString = putStringTemplate.bind(null, overviewSheet, sharedStrings, sst, sharedStringsUniqueCount);

  // set headers
  putString(
    overviewSheet.querySelector("c[r='B6']"),
    `Parent name : ${reportData.parentName}`
  );

  putString(
    overviewSheet.querySelector("c[r='B7']"),
    `Date: ${moment(reportData.date).format('DD/MM/YYYY')}`
  );

  // clone the row the apropriate number of times
  const templateRow = overviewSheet.querySelector("row[r='13']");
  let currentRow = templateRow;
  let rowIndex = 14;

  if (reportData.establishments.length > 1) {
    for (let i = 0; i < reportData.establishments.length - 1; i++) {
      const tempRow = templateRow.cloneNode(true);

      tempRow.setAttribute('r', rowIndex);

      tempRow.querySelectorAll('c').forEach(elem => {
        elem.setAttribute('r', String(elem.getAttribute('r')).replace(/\d+$/, '') + rowIndex);
      });

      templateRow.parentNode.insertBefore(tempRow, currentRow.nextSibling);

      currentRow = tempRow;
      rowIndex++;
    }

    currentRow = templateRow;
  } else if (reportData.establishments.length === 0) {
    templateRow.remove();
    rowIndex = 13;
  }

  // fix the last row in the table
  overviewSheet.querySelector('sheetData row:last-child').setAttribute('r', rowIndex);

  // fix the dimensions tag value
  const dimension = overviewSheet.querySelector('dimension');
  dimension.setAttribute('ref', String(dimension.getAttribute('ref')).replace(/\d+$/, '') + rowIndex);

  // TODO: fix the bottom 2 merge cells
  /////////////////////////////////////

  // fix the page footer timestamp

  // update the cell values
  for (let row = 0; row < reportData.establishments.length; row++) {
    debuglog('updating overview', row);

    const rowType = row === reportData.establishments.length - 1 ? 'OVRLAST' : 'OVRREGULAR';
    let nextSibling = {};

    for (let column = 0; column < 11; column++) {
      const columnText = String.fromCharCode(column + 65);
      const isRed = false;

      console.log(columnText);

      const cellToChange = (typeof nextSibling.querySelector === 'function') ? nextSibling : currentRow.querySelector(`c[r='${columnText}${row + 11}']`);

      switch (columnText) {
        case 'A': {
        } break;

        case 'B': {
          putString(
              cellToChange,
              reportData.establishments[row].subsidiaryName
            );
        } break;

        case 'C': {
          putString(
              cellToChange,
              reportData.establishments[row].subsidiarySharingPermissions
            );
        } break;

        case 'D': {
          putString(
              cellToChange,
              reportData.establishments[row].currentWdfEligibilityStatus
            );
        } break;

        case 'E': {
          putString(
              cellToChange,
              reportData.establishments[row].dateEligibilityAchieved
            );
        } break;

        case 'F': {
          putString(
              cellToChange,
              reportData.establishments[row].isDataFullyCompleted
            );
        } break;

        case 'G': {
          putString(
              cellToChange,
              reportData.establishments[row].updatedInCurrentFinancialYear
            );
        } break;

        case 'H': {
          putString(
              cellToChange,
              reportData.establishments[row].totalWorkersCount
            );
        } break;

        case 'I': {
          putString(
              cellToChange,
              reportData.establishments[row].workerRecordsCount
            );
        } break;

        case 'J': {
          putString(
              cellToChange,
              reportData.establishments[row].completedWorkerRecordsCount
            );
        } break;

        case 'K': {
          putString(
              cellToChange,
              reportData.establishments[row].completedWorkerRecordsPercentage
            );
        } break;
      }

      //TODO: duplicate the hyperlinked fields
      ////////////////////////////////////////

      nextSibling = cellToChange ? cellToChange.nextSibling : {};
    }

    currentRow = currentRow.nextSibling;
  }

  debuglog('overview updated');

  return overviewSheet;
};

const updateEstablishmentsSheet = (
  establishmentsSheet,
  reportData,
  sharedStrings,
  sst,
  sharedStringsUniqueCount
) => {
  debuglog('updating establishments sheet');

  const putString = putStringTemplate.bind(null, establishmentsSheet, sharedStrings, sst, sharedStringsUniqueCount);

  // set headers
  putString(
    overviewSheet.querySelector("c[r='B6']"),
    `Parent name : ${reportData.parentName}`
  );

  putString(
    overviewSheet.querySelector("c[r='B7']"),
    `Date: ${moment(reportData.date).format('DD/MM/YYYY')}`
  );

  // clone the row the apropriate number of times
  const templateRow = establishmentsSheet.querySelector("row[r='13']");
  let currentRow = templateRow;
  let rowIndex = 14;

  if (reportData.establishments.length > 1) {
    for (let i = 0; i < reportData.establishments.length - 1; i++) {
      const tempRow = templateRow.cloneNode(true);

      tempRow.setAttribute('r', rowIndex);

      tempRow.querySelectorAll('c').forEach(elem => {
        elem.setAttribute('r', String(elem.getAttribute('r')).replace(/\d+$/, '') + rowIndex);
      });

      templateRow.parentNode.insertBefore(tempRow, currentRow.nextSibling);

      currentRow = tempRow;
      rowIndex++;
    }

    currentRow = templateRow;
  } else if (reportData.establishments.length === 0) {
    templateRow.remove();
    rowIndex = 13;
  }

  // fix the last row in the table
  establishmentsSheet.querySelector('sheetData row:last-child').setAttribute('r', rowIndex);

  // fix the dimensions tag value
  const dimension = establishmentsSheet.querySelector('dimension');
  dimension.setAttribute('ref', String(dimension.getAttribute('ref')).replace(/\d+$/, '') + rowIndex);

  // update the cell values
  for (let row = 0; row < reportData.establishments.length; row++) {
    debuglog('updating establishment', row);

    const rowType = row === reportData.establishments.length - 1 ? 'ESTLAST' : 'ESTREGULAR';
    let nextSibling = {};

    for (let column = 0; column < 24; column++) {
      const columnText = String.fromCharCode(column + 65);
      const isRed = false;

      const cellToChange = (typeof nextSibling.querySelector === 'function') ? nextSibling : currentRow.querySelector(`c[r='${columnText}${row + 13}']`);

      switch (columnText) {
        case 'A': {
        } break;

        case 'B': {
          putString(
              cellToChange,
              reportData.establishments[row].subsidiaryName
            );
        } break;

        case 'C': {
          putString(
              cellToChange,
              reportData.establishments[row].subsidiarySharingPermissions
            );
        } break;

        case 'D': {
          putString(
              cellToChange,
              reportData.establishments[row].establishmentType
            );
        } break;

        case 'E': {
          putString(
              cellToChange,
              reportData.establishments[row].mainService
            );
        } break;

        case 'F': {
          putString(
              cellToChange,
              reportData.establishments[row].mainServiceCapacity
            );
        } break;

        case 'G': {
          putString(
              cellToChange,
              reportData.establishments[row].mainServiceUtilisation
            );
        } break;

        case 'H': {
          putString(
              cellToChange,
              reportData.establishments[row].otherServices
            );
        } break;

        case 'I': {
          putString(
              cellToChange,
              reportData.establishments[row].serviceUsers
            );
        } break;

        case 'J': {
          putString(
              cellToChange,
              reportData.establishments[row].investorsInPeopleStatus
            );
        } break;

        case 'K': {
          putString(
              cellToChange,
              reportData.establishments[row].updatedLastDate
            );
        } break;

        case 'L': {
          putString(
              cellToChange,
              reportData.establishments[row].totalWorkersCount
            );
        } break;

        case 'M': {
          putString(
              cellToChange,
              reportData.establishments[row].workerRecordsCount
            );
        } break;

        case 'N': {
          putString(
              cellToChange,
              reportData.establishments[row].workersWithRecordsPercentage
            );
        } break;

        case 'O': {
          putString(
              cellToChange,
              reportData.establishments[row].startersInLast12Months
            );
        } break;

        case 'P': {
          putString(
              cellToChange,
              reportData.establishments[row].leaversInLast12Months
            );
        } break;

        case 'Q': {
          putString(
              cellToChange,
              reportData.establishments[row].vacanciesOnCompletionDateCount
            );
        } break;

        case 'R': {
          putString(
              cellToChange,
              reportData.establishments[row].leavingReasonsCountEqualsLeavers
            );
        } break;

        case 'S': {
          putString(
              cellToChange,
              reportData.establishments[row].leavingDestinationCountEqualsLeavers
            );
        } break;

        case 'T': {
          putString(
              cellToChange,
              reportData.establishments[row].startersByJobRoleCountEqualsTotalStarters
            );
        } break;

        case 'U': {
          putString(
              cellToChange,
              reportData.establishments[row].leaversByJobRoleEqualsTotalLeavers
            );
        } break;

        case 'V': {
          putString(
              cellToChange,
              reportData.establishments[row].vacanciesByJobRoleEqualsTotalVacancies
            );
        } break;

        case 'W': {
          putString(
              cellToChange,
              reportData.establishments[row].totalWorkersCountGTEWorkerRecords
            );
        } break;
      }

      nextSibling = cellToChange ? cellToChange.nextSibling : {};
    }

    currentRow = currentRow.nextSibling;
  }

  debuglog('establishments updated');

  return establishmentsSheet;
};

const updateWorkersSheet = (
  workersSheet,
  reportData,
  sharedStrings,
  sst,
  sharedStringsUniqueCount
) => {
  debuglog('updating workers sheet');

  const putString = putStringTemplate.bind(null, workersSheet, sharedStrings, sst, sharedStringsUniqueCount);

  // set headers
  putString(
    overviewSheet.querySelector("c[r='B6']"),
    `Parent name : ${reportData.parentName}`
  );

  putString(
    overviewSheet.querySelector("c[r='B7']"),
    `Date: ${moment(reportData.date).format('DD/MM/YYYY')}`
  );

  // clone the row the apropriate number of times
  const templateRow = workersSheet.querySelector("row[r='13']");
  let currentRow = templateRow;
  let rowIndex = 14;

  if (reportData.workers.length > 1) {
    for (let i = 0; i < reportData.workers.length - 1; i++) {
      const tempRow = templateRow.cloneNode(true);

      tempRow.setAttribute('r', rowIndex);

      tempRow.querySelectorAll('c').forEach(elem => {
        elem.setAttribute('r', String(elem.getAttribute('r')).replace(/\d+$/, '') + rowIndex);
      });

      templateRow.parentNode.insertBefore(tempRow, currentRow.nextSibling);

      currentRow = tempRow;
      rowIndex++;
    }

    currentRow = templateRow;
  } else if (reportData.workers.length === 0) {
    templateRow.remove();
    rowIndex = 13;
  }

  // fix the last row in the table
  workersSheet.querySelector('sheetData row:last-child').setAttribute('r', rowIndex);

  // fix the dimensions tag value
  const dimension = workersSheet.querySelector('dimension');
  dimension.setAttribute('ref', String(dimension.getAttribute('ref')).replace(/\d+$/, '') + rowIndex);

  // update the cell values
  for (let row = 0; row < reportData.workers.length; row++) {
    debuglog('updating worker', row);

    const rowType = row === reportData.workers.length - 1 ? 'ESTLAST' : 'ESTREGULAR';
    let nextSibling = {};

    for (let column = 0; column < 24; column++) {
      const columnText = String.fromCharCode(column + 65);
      const isRed = false;

      const cellToChange = (typeof nextSibling.querySelector === 'function') ? nextSibling : currentRow.querySelector(`c[r='${columnText}${row + 13}']`);

      switch (columnText) {
        case 'A': {
        } break;

        case 'B': {
          putString(
              cellToChange,
              reportData.workers[row].localId
            );
        } break;

        case 'C': {
          putString(
              cellToChange,
              reportData.workers[row].subsidiaryName
            );
        } break;

        case 'D': {
          putString(
              cellToChange,
              reportData.workers[row].gender
            );
        } break;

        case 'E': {
          putString(
              cellToChange,
              reportData.workers[row].dateOfBirth
            );
        } break;

        case 'F': {
          putString(
              cellToChange,
              reportData.workers[row].nationality
            );
        } break;

        case 'G': {
          putString(
              cellToChange,
              reportData.workers[row].mainJobRole
            );
        } break;

        case 'H': {
          putString(
              cellToChange,
              reportData.workers[row].mainJobDateStarted
            );
        } break;

        case 'I': {
          putString(
              cellToChange,
              reportData.workers[row].recruitmentSource
            );
        } break;

        case 'J': {
          putString(
              cellToChange,
              reportData.workers[row].employmentStatus
            );
        } break;

        case 'K': {
          putString(
              cellToChange,
              reportData.workers[row].contractedHours
            );
        } break;

        case 'L': {
          putString(
              cellToChange,
              reportData.workers[row].additionalHours
            );
        } break;

        case 'M': {
          putString(
              cellToChange,
              reportData.workers[row].fullTimeStatus
            );
        } break;

        case 'N': {
          putString(
              cellToChange,
              reportData.workers[row].isZeroHoursContract
            );
        } break;

        case 'O': {
          putString(
              cellToChange,
              reportData.workers[row].sicknessDays
            );
        } break;

        case 'P': {
          putString(
              cellToChange,
              reportData.workers[row].payInterval
            );
        } break;

        case 'Q': {
          putString(
              cellToChange,
              reportData.workers[row].rateOfPay
            );
        } break;

        case 'R': {
          putString(
              cellToChange,
              reportData.workers[row].inductionStatus
            );
        } break;

        case 'S': {
          putString(
              cellToChange,
              reportData.workers[row].careCertificate
            );
        } break;

        case 'T': {
          putString(
              cellToChange,
              reportData.workers[row].highestQualificationHeld
            );
        } break;

        case 'U': {
          putString(
              cellToChange,
              reportData.workers[row].lastFullyUpdatedDate
            );
        } break;
      }

      nextSibling = cellToChange ? cellToChange.nextSibling : {};
    }

    currentRow = currentRow.nextSibling;
  }

  debuglog('workers updated');

  return overviewSheet;
};

const getReport = async (date, thisEstablishment) => {
  const reportData = await getReportData(date, thisEstablishment);

  if (reportData === null) {
    return null;
  }

  return (new Promise(resolve => {
    const thePath = `${__dirname}/${folderName}`;
    const walker = walk.walk(thePath);
    const outputZip = new JsZip();

    let overviewSheet, establishmentsSheet, workersSheet, sharedStrings;

    debuglog('iterating filesystem', thePath);

    walker.on('file', (root, fileStats, next) => {
      const pathName = root.replace(thePath, '').replace(/^\//, '');
      const zipPath = (pathName === '' ? '' : pathName + '/') + fileStats.name;

      debuglog('file found', `${thePath}/${zipPath}`);

      fs.readFile(`${thePath}/${zipPath}`, (err, fileContent) => {
        debuglog('content read', zipPath);

        if (!err) {
          switch (zipPath) {
            case overviewSheetName: {
              overviewSheet = parseXML(fileContent);
            } break;

            case establishmentsSheetName: {
              establishmentsSheet = parseXML(fileContent);
            } break;

            case workersSheetName: {
              workersSheet = parseXML(fileContent);
            } break;

            case sharedStringsName: {
              sharedStrings = parseXML(fileContent);
            } break;

            default: {
              outputZip.file(zipPath, fileContent);
            } break;
          }
        }

        next();
      });
    });

    walker.on('end', () => {
      debuglog('all files read');

      if (sharedStrings) {
        const sst = sharedStrings.querySelector('sst');

        const sharedStringsUniqueCount = [parseInt(sst.getAttribute('uniqueCount'), 10)];

        // update the overview sheet with the report data and add it to the zip
        outputZip.file(overviewSheetName, serializeXML(updateOverviewSheet(
          overviewSheet,
          reportData,
          sharedStrings,
          sst,
          sharedStringsUniqueCount // pass unique count by reference rather than by value
        )));

        // update the establishments sheet with the report data and add it to the zip
        outputZip.file(establishmentsSheetName, serializeXML(updateEstablishmentsSheet(
          establishmentsSheet,
          reportData,
          sharedStrings,
          sst,
          sharedStringsUniqueCount // pass unique count by reference rather than by value
        )));

        // update the workplaces sheet with the report data and add it to the zip
        outputZip.file(workersSheetName, serializeXML(updateWorkersSheet(
          workersSheet,
          reportData,
          sharedStrings,
          sst,
          sharedStringsUniqueCount // pass unique count by reference rather than by value
        )));

        // update the shared strings counts we've been keeping track of
        sst.setAttribute('uniqueCount', sharedStringsUniqueCount[0]);

        // add the updated shared strings to the zip
        outputZip.file(sharedStringsName, serializeXML(sharedStrings));
      }

      debuglog('wdf parent report: creating zip file');

      resolve(outputZip);
    });
  }))

    .then(outputZip => outputZip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE'
    }));
};

// gets report
// NOTE - the Local Authority report is driven mainly by pgsql (postgres functions) and therefore does not
//    pass through the Establishment/Worker entities. This is done for performance, as these reports
//    are expected to operate across large sets of data
const express = require('express');
const router = express.Router();

router.route('/').get(async (req, res) => {
  // req.setTimeout(config.get('app.reports.parentWdf.timeout')*1000);

  try {debugger
    // first ensure this report can only be run by those establishments with a Local Authority employer type
    const thisEstablishment = new Establishment(req.username);

    if (await thisEstablishment.restore(req.establishment.id, false)) {
      if (thisEstablishment.isParent) {
        const date = new Date();
        const report = await getReport(date, thisEstablishment);

        if (report) {
          res.setHeader('Content-disposition',
            `attachment; filename=${moment(date).format('YYYY-MM-DD')}-SFC-Parent-Wdf-Report.xlsx`);
          res.setHeader('Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Length', report.length);

          console.log('report/wdf/parent - 200 response');

          return res.status(200).end(report);
        } else {
          // failed to run the report
          console.error('report/wdf/parent - failed to run the report');

          return res.status(503).send('ERR: Failed to run report');
        }
      } else {
        // only allow on those establishments being a parent

        console.log('report/wdf/parent 403 response');

        return res.status(403).send();
      }
    } else {
      console.error('report/wdf/parent - failed restoring establisment', err);
      return res.status(503).send('ERR: Failed to restore establishment');
    }
  } catch (err) {
    console.error('report/wdf/parent - failed', err);
    return res.status(503).send('ERR: Failed to retrieve report');
  }
});

module.exports = router;
