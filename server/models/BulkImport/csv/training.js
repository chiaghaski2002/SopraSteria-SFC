const BUDI = require('../BUDI').BUDI;
const moment = require('moment');

class Training {
  constructor(currentLine, lineNumber) {
    this._currentLine = currentLine;
    this._lineNumber = lineNumber;
    this._validationErrors = [];
    this._headers_v1 = ["LOCALESTID","UNIQUEWORKERID","CATEGORY","DESCRIPTION","DATECOMPLETED","EXPIRYDATE","ACCREDITED","NOTES"];

    this._localeStId = null;
    this._uniqueWorkerId = null;
    this._dateCompleted = null;
    this._expiry = null;
    this._description = null;
    this._category = null;
    this._accredited = null;
    this._notes= null;
  };

  static get UNCHECKED_WORKER_ERROR() { return 996; }
  static get UNCHECKED_ESTABLISHMENT_ERROR() { return 997; }
  static get HEADERS_ERROR() { return 999; }
  static get LOCALESTID_ERROR() { return 1000; }
  static get UNIQUE_WORKER_ID_ERROR() { return 1010; }
  static get DATE_COMPLETED_ERROR() { return 1020; }
  static get EXPIRY_DATE_ERROR() { return 1030; }
  static get DESCRIPTION_ERROR() { return 1040; }
  static get CATEGORY_ERROR() { return 1050; }
  static get ACCREDITED_ERROR() { return 1060; }
  static get NOTES_ERROR() { return 1070; }
  static get WORKER_DOB_TRAINING_WARNING() { return 1080; }

  static get DATE_COMPLETED_WARNING() { return 2020; }
  static get EXPIRY_DATE_WARNING() { return 2030; }
  static get DESCRIPTION_WARNING() { return 2040; }
  static get CATEGORY_WARNING() { return 2050; }
  static get ACCREDITED_WARNING() { return 2060; }
  static get NOTES_WARNING() { return 2070; }


  get headers() {
    return this._headers_v1.join(",");
  }

  get lineNumber() {
    return this._lineNumber;
  }

  get currentLine() {
    return this._currentLine;
  }

  get localeStId() {
    return this._localeStId;
  }
  get uniqueWorkerId() {
    return this._uniqueWorkerId;
  }
  get completed() {
    this._dateCompleted;
  }
  get expiry() {
    this._expiry;
  }
  get description() {
    return this._description;
  }
  get category() {
    return _category;
  }
  get accredited() {
    return this._accredited;
  }
  get notes() {
    return this._notes;
  }

  _validateLocaleStId() {
    const myLocaleStId = this._currentLine.LOCALESTID;
    const MAX_LENGTH = 50;

    if (!myLocaleStId || myLocaleStId.length == 0) {
      this._validationErrors.push({
        worker: this._currentLine.UNIQUEWORKERID,
        name: this._currentLine.LOCALESTID,
        lineNumber: this._lineNumber,
        errCode: Training.LOCALESTID_ERROR,
        errType: `LOCALESTID_ERROR`,
        error: "LOCALESTID has not been supplied",
        source: this._currentLine.LOCALESTID,
      });
      return false;
    } else if (myLocaleStId.length > MAX_LENGTH) {
      this._validationErrors.push({
        worker: this._currentLine.UNIQUEWORKERID,
        name: this._currentLine.LOCALESTID,
        lineNumber: this._lineNumber,
        errCode: Training.LOCALESTID_ERROR,
        errType: `LOCALESTID_ERROR`,
        error: `LOCALESTID is longer than ${MAX_LENGTH} characters`,
        source: this._currentLine.LOCALESTID,
      });
      return false;
    } else {
      this._localeStId = myLocaleStId;
      return true;
    }
  }

  _validateUniqueWorkerId() {
    const myUniqueId = this._currentLine.UNIQUEWORKERID;
    const MAX_LENGTH = 50;

    if (!myUniqueId || myUniqueId.length == 0) {
      this._validationErrors.push({
        worker: this._currentLine.UNIQUEWORKERID,
        name: this._currentLine.LOCALESTID,
        lineNumber: this._lineNumber,
        errCode: Training.UNIQUE_WORKER_ID_ERROR,
        errType: `UNIQUE_WORKER_ID_ERROR`,
        error: "UNIQUEWORKERID has not been supplied",
        source: this._currentLine.UNIQUEWORKERID,
      });
      return false;
    } else if (myUniqueId.length > MAX_LENGTH) {
      this._validationErrors.push({
        worker: this._currentLine.UNIQUEWORKERID,
        name: this._currentLine.LOCALESTID,
        lineNumber: this._lineNumber,
        errCode: Training.UNIQUE_WORKER_ID_ERROR,
        errType: `UNIQUE_WORKER_ID_ERROR`,
        error: `UNIQUEWORKERID is longer than ${MAX_LENGTH} characters`,
        source: this._currentLine.UNIQUEWORKERID,
      });
      return false;
    } else {
      this._uniqueWorkerId = myUniqueId;
      return true;
    }
  }

  _validateDateCompleted() {
    // optional
    const myDateCompleted = this._currentLine.DATECOMPLETED;
    const dateFormatRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;
    const actualDate = moment.utc(myDateCompleted, "DD/MM/YYYY");

    if (myDateCompleted) {
      if (!dateFormatRegex.test(myDateCompleted)) {
        this._validationErrors.push({
          worker: this._currentLine.UNIQUEWORKERID,
          name: this._currentLine.LOCALESTID,
          lineNumber: this._lineNumber,
          errCode: Training.DATE_COMPLETED_ERROR,
          errType: `DATE_COMPLETED_ERROR`,
          error: "DATECOMPLETED is incorrectly formatted",
          source: this._currentLine.DATECOMPLETED,
        });
        return false;
      } else if (!actualDate.isValid()) {
        this._validationErrors.push({
          worker: this._currentLine.UNIQUEWORKERID,
          name: this._currentLine.LOCALESTID,
          lineNumber: this._lineNumber,
          errCode: Training.DATE_COMPLETED_ERROR,
          errType: `DATE_COMPLETED_ERROR`,
          error: "DATECOMPLETED is invalid",
          source: this._currentLine.DATECOMPLETED,
        });
        return false;
      } else if (actualDate.isAfter(moment())) {
        this._validationErrors.push({
          worker: this._currentLine.UNIQUEWORKERID,
          name: this._currentLine.LOCALESTID,
          lineNumber: this._lineNumber,
          errCode: Training.DATE_COMPLETED_ERROR,
          errType: `DATE_COMPLETED_ERROR`,
          error: "DATECOMPLETED is in the future",
          source: this._currentLine.DATECOMPLETED,
        });
        return false;
      } else {

        this._dateCompleted = actualDate;
        return true;
      }
    } else {
      return true;
    }
  }

  _validateExpiry() {
    // optional
    const myDateExpiry = this._currentLine.EXPIRYDATE;
    const dateFormatRegex =  /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;
    const actualDate = moment.utc(myDateExpiry, "DD/MM/YYYY");
    const myDateCompleted = this._currentLine.DATECOMPLETED;
    const actualDateCompleted = moment.utc(myDateCompleted, "DD/MM/YYYY");

    if (myDateExpiry) {
      if (!dateFormatRegex.test(myDateExpiry)) {
        this._validationErrors.push({
          worker: this._currentLine.UNIQUEWORKERID,
          name: this._currentLine.LOCALESTID,
          lineNumber: this._lineNumber,
          errCode: Training.EXPIRY_DATE_ERROR,
          errType: `EXPIRY_DATE_ERROR`,
          error: "EXPIRYDATE is incorrectly formatted",
          source: this._currentLine.EXPIRYDATE,
        });
        return false;
      } else if (!actualDate.isValid()) {
        this._validationErrors.push({
          worker: this._currentLine.UNIQUEWORKERID,
          name: this._currentLine.LOCALESTID,
          lineNumber: this._lineNumber,
          errCode: Training.EXPIRY_DATE_ERROR,
          errType: `EXPIRY_DATE_ERROR`,
          error: "EXPIRYDATE is invalid",
          source: this._currentLine.EXPIRYDATE,
        });
        return false;
      } else if (actualDate.isBefore(actualDateCompleted, 'day')) {
          this._validationErrors.push({
            worker: this._currentLine.UNIQUEWORKERID,
            name: this._currentLine.LOCALESTID,
            lineNumber: this._lineNumber,
            errCode: Training.EXPIRY_DATE_ERROR,
            errType: `EXPIRY_DATE_ERROR`,
            error: "EXPIRYDATE is before DATECOMPLETED",
            source: this._currentLine.EXPIRYDATE,
          });
          return false;
      } else {

        this._expiry = actualDate;
        return true;
      }
    } else {
      return true;
    }
  }

  _validateDescription() {
    const myDescription = this._currentLine.DESCRIPTION;
    const MAX_LENGTH = 120;

    if (!myDescription || myDescription.length == 0) {
      this._validationErrors.push({
        worker: this._currentLine.UNIQUEWORKERID,
        name: this._currentLine.LOCALESTID,
        lineNumber: this._lineNumber,
        errCode: Training.DESCRIPTION_ERROR,
        errType: `DESCRIPTION_ERROR`,
        error: "DESCRIPTION has not been supplied",
        source: this._currentLine.DESCRIPTION,
      });
      return false;
    } else if (myDescription.length > MAX_LENGTH) {
      this._validationErrors.push({
        worker: this._currentLine.UNIQUEWORKERID,
        name: this._currentLine.LOCALESTID,
        lineNumber: this._lineNumber,
        errCode: Training.DESCRIPTION_ERROR,
        errType: `DESCRIPTION_ERROR`,
        error: `DESCRIPTION is longer than ${MAX_LENGTH} characters`,
        source: this._currentLine.DESCRIPTION,
      });
      return false;
    } else {
      this._description = myDescription;
      return true;
    }
  }

  _validateCategory() {
    const myCategory = parseInt(this._currentLine.CATEGORY);
    if (Number.isNaN(myCategory) || !BUDI.trainingCaterogy(BUDI.TO_ASC, this._currentLine.CATEGORY)) {
      this._validationErrors.push({
        worker: this._currentLine.UNIQUEWORKERID,
        name: this._currentLine.LOCALESTID,
        lineNumber: this._lineNumber,
        errCode: Training.CATEGORY_ERROR,
        errType: `CATEGORY_ERROR`,
        error: "CATEGORY is invalid",
        source: this._currentLine.CATEGORY,
      });
      return false;
    } else {
      this._category = myCategory;
      return true;
    }
  }

  _validateAccredited() {
    const myAccredited = parseInt(this._currentLine.ACCREDITED);
    const ALLOWED_VALUES = [0,1,999];
    if (Number.isNaN(myAccredited) || !ALLOWED_VALUES.includes(myAccredited)) {
      this._validationErrors.push({
        worker: this._currentLine.UNIQUEWORKERID,
        name: this._currentLine.LOCALESTID,
        lineNumber: this._lineNumber,
        errCode: Training.ACCREDITED_ERROR,
        errType: `ACCREDITED_ERROR`,
        error: "ACCREDITED is invalid",
        source: this._currentLine.ACCREDITED,
      });
      return false;
    } else {
      switch (myAccredited) {
        case 0:
          this._accredited = 'No';
          break;
        case 1:
          this._accredited = 'Yes';
          break;
        case 999:
          this._accredited = 'Don\'t know';
          break;
        }
      return true;
    }
  }

  _transformTrainingCategory() {
    if (this._category) {
      const mappedCategory = BUDI.trainingCaterogy(BUDI.TO_ASC, this._category);
      if (mappedCategory === null) {
        this._validationErrors.push({
          worker: this._currentLine.UNIQUEWORKERID,
          name: this._currentLine.LOCALESTID,
          lineNumber: this._lineNumber,
          errCode: Training.CATEGORY_ERROR,
          errType: `CATEGORY_ERROR`,
          error: "CATEGORY is invalid",
          source: this._currentLine.CATEGORY,
        });
      } else {
        this._category = mappedCategory;
      }
    }
  }

  _validateNotes() {
    const myNotes = this._currentLine.NOTES;
    const MAX_LENGTH = 1000;

    if (myNotes && myNotes.length > 0) {
      if (myNotes.length > MAX_LENGTH) {
        this._validationErrors.push({
          worker: this._currentLine.UNIQUEWORKERID,
          name: this._currentLine.LOCALESTID,
          lineNumber: this._lineNumber,
          errCode: Training.NOTES_ERROR,
          errType: `NOTES_ERROR`,
          error: `NOTES is longer than ${MAX_LENGTH} characters`,
          source: this._currentLine.NOTES,
        });
        return false;
      } else {
        this._notes = myNotes;
        return true;
      }
    }
  }

  preValidate(header) {
    return this._validateHeaders(header);
  }

  static isContent(data) {
    const contentRegex = /LOCALESTID,UNIQUEWORKERID,CATEGORY,DESCRIPTION,DAT/;
    return contentRegex.test(data.substring(0,50));
  }

  _validateHeaders(headers) {
    // only run once for first line, so check _lineNumber
    if (this._headers_v1.join(',') !== headers) {
      this._validationErrors.push({
        worker: this._currentLine.UNIQUEWORKERID,
        name: this._currentLine.LOCALESTID,
        lineNumber: 1,
        errCode: Training.HEADERS_ERROR,
        errType: `HEADERS_ERROR`,
        error: `Training headers (HEADERS) can contain, ${this._headers_v1}`,
        source: headers
      });
      return false;
    }
    return true;
  }

  // add unchecked establishment reference validation error
  dobTrainingMismatch() {
    return {
      origin: 'Training',
      lineNumber: this._lineNumber,
      errCode: Training.WORKER_DOB_TRAINING_WARNING,
      errType: `WORKER_DOB_TRAINING_WARNING`,
      error: `DATECOMPLETED is before staff record’s 14th birthday`,
      source: this._currentLine.LOCALESTID,
      worker: this._currentLine.UNIQUEWORKERID,
      name: this._currentLine.LOCALESTID,
    };
  }

  uncheckedEstablishment() {
    return {
      origin: 'Training',
      lineNumber: this._lineNumber,
      errCode: Training.UNCHECKED_ESTABLISHMENT_ERROR,
      errType: `UNCHECKED_ESTABLISHMENT_ERROR`,
      error: `LOCALESTID does not exist in Workplace File`,
      source: this._currentLine.LOCALESTID,
      worker: this._currentLine.UNIQUEWORKERID,
      name: this._currentLine.LOCALESTID,
    };
  }

  // add unchecked establishment reference validation error
  uncheckedWorker() {
    return {
      origin: 'Training',
      lineNumber: this._lineNumber,
      errCode: Training.UNCHECKED_WORKER_ERROR,
      errType: `UNCHECKED_WORKER_ERROR`,
      error: `UNIQUEWORKERID and LOCALESTID does not match staff record file details`,
      source: this._currentLine.UNIQUEWORKERID,
      worker: this._currentLine.UNIQUEWORKERID,
      name: this._currentLine.LOCALESTID,
    };
  }

  // returns true on success, false is any attribute of Training fails
  validate() {
    let status = true;
    status = !this._validateLocaleStId() ? false : status;
    status = !this._validateUniqueWorkerId() ? false : status;
    status = !this._validateDateCompleted() ? false : status;
    status = !this._validateExpiry() ? false : status;
    status = !this._validateDescription() ? false : status;
    status = !this._validateCategory() ? false : status;
    status = !this._validateAccredited() ? false : status;
    status = !this._validateNotes() ? false : status;

    return status;
  }

  transform() {
    let status = true;

    status = !this._transformTrainingCategory() ? false : status;

    return status;
  }

  toJSON() {
    return {
      localeStId: this._localeStId,
      uniqueWorkerId: this._uniqueWorkerId,
      completed: this._dateCompleted ? this._dateCompleted.format('DD/MM/YYYY') : undefined,
      expiry: this._expiry ? this._expiry.format('DD/MM/YYYY') : undefined,
      description: this._description,
      category: this._category,
      accredited: this._accredited,
      notes: this._notes,
    };
  };

  toAPI() {
    const changeProperties = {
      trainingCategory: {
        id: this._category
      },
      completed: this._dateCompleted ? this._dateCompleted.format('YYYY-MM-DD') : undefined,
      expires: this._expiry ? this._expiry.format('YYYY-MM-DD') : undefined,
      title: this._description ? this._description : undefined,
      notes: this._notes ? this._notes : undefined,
      accredited: this._accredited ? this._accredited : undefined,
    };

    return changeProperties;
  };

  get validationErrors() {
    // include the "origin" of validation error
    return this._validationErrors.map(thisValidation => {
      return {
        origin: 'Training',
        ...thisValidation,
      };
    });
  };

  // maps Entity (API) validation messages to bulk upload specific messages (using Entity property name)
  addAPIValidations(errors, warnings) {
/*     errors.forEach(thisError => {
      thisError.properties ? thisError.properties.forEach(thisProp => {
        const validationError = {
          lineNumber: this._lineNumber,
          error: thisError.message,
          name: this._currentLine.LOCALESTID,
          worker: this._currentLine.UNIQUEWORKERID,
        };

        switch (thisProp) {
          case 'TrainingCategory':
            // this generates multiple errors, which are already covered in validation above
            // validationError.errCode = Training.CATEGORY_ERROR;
            // validationError.errType = 'CATEGORY_ERROR';
            // validationError.source  = `${this._currentLine.CATEGORY}`;
            break;
          case 'Title':
            validationError.errCode = Training.DESCRIPTION_ERROR;
            validationError.errType = 'DESCRIPTION_ERROR';
            validationError.source  = `${this._currentLine.DESCRIPTION}`;
            break;
          case 'Accredited':
            validationError.errCode = Training.ACCREDITED_ERROR;
            validationError.errType = 'ACCREDITED_ERROR';
            validationError.source  = `${this._currentLine.ACCREDITED}`;
            break;
          case 'Completed':
            validationError.errCode = Training.DATE_COMPLETED_ERROR;
            validationError.errType = 'DATE_COMPLETED_ERROR';
            validationError.source  = `${this._currentLine.DATECOMPLETED}`;
            break;
          case 'Expires':
            validationError.errCode = Training.EXPIRY_DATE_ERROR;
            validationError.errType = 'EXPIRY_DATE_ERROR';
            validationError.source  = `${this._currentLine.EXPIRYDATE}`;
            break;
          case 'Notes':
            validationError.errCode = Training.NOTES_ERROR;
            validationError.errType = 'NOTES_ERROR';
            validationError.source  = `${this._currentLine.NOTES}`;
            break;
          default:
            validationError.errCode = thisError.code;
            validationError.errType = 'Undefined';
            validationError.source  = thisProp;
        }
        this._validationErrors.push(validationError);
      }) : true;
    });


    warnings.forEach(thisWarning => {
      thisWarning.properties ? thisWarning.properties.forEach(thisProp => {
        const validationWarning = {
          lineNumber: this._lineNumber,
          warning: thisWarning.message,
          name: this._currentLine.LOCALESTID,
          worker: this._currentLine.UNIQUEWORKERID,
        };

        switch (thisProp) {
          case 'TrainingCategory':
            validationWarning.warnCode = Training.CATEGORY_WARNING;
            validationWarning.warnType = 'CATEGORY_WARNING';
            validationWarning.source  = `${this._currentLine.CATEGORY}`;
            break;
          case 'Title':
            validationWarning.warnCode = Training.DESCRIPTION_WARNING;
            validationWarning.warnType = 'DESCRIPTION_WARNING';
            validationWarning.source  = `${this._currentLine.DESCRIPTION}`;
            break;
          case 'Accredited':
            validationWarning.warnCode = Training.ACCREDITED_WARNING;
            validationWarning.warnType = 'ACCREDITED_WARNING';
            validationWarning.source  = `${this._currentLine.ACCREDITED}`;
            break;
          case 'Completed':
            validationWarning.warnCode = Training.DATE_COMPLETED_WARNING;
            validationWarning.warnType = 'DATE_COMPLETED_WARNING';
            validationWarning.source  = `${this._currentLine.DATECOMPLETED}`;
            break;
          case 'Expires':
            validationWarning.warnCode = Training.EXPIRY_DATE_WARNING;
            validationWarning.warnType = 'EXPIRY_DATE_WARNING';
            validationWarning.source  = `${this._currentLine.EXPIRYDATE}`;
            break;
          case 'Notes':
            validationWarning.warnCode = Training.NOTES_WARNING;
            validationWarning.warnType = 'NOTES_WARNING';
            validationWarning.source  = `${this._currentLine.NOTES}`;
            break;
          default:
            validationWarning.warnCode = thisWarning.code;
            validationWarning.warnType = 'Undefined';
            validationWarning.source  = thisProp;
        }

        this._validationErrors.push(validationWarning);
      }) : true;
    }); */
  }

  _csvQuote(toCsv) {
    if (toCsv.replace(/ /g, '').match(/[\s,"]/)) {
      return '"' + toCsv.replace(/"/g, '""') + '"';
    } else {
      return toCsv;
    }
  }

  // input is date in ISO format YYYY-MM-DDYhh:mm:ss.000
  _fromDateToCsv(convertThis) {
    if (convertThis) {
      const datePart = convertThis.toISOString().substring(0,10);
      const dateParts = datePart.split('-');

      return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    } else {
      return '';
    }
  }

  // takes the given Training entity and writes it out to CSV string (one line)
  toCSV(establishmentId, workerId, entity) {
    // ["LOCALESTID","UNIQUEWORKERID","CATEGORY","DESCRIPTION","DATECOMPLETED","EXPIRYDATE","ACCREDITED","NOTES"]
    const columns = [];
    columns.push(this._csvQuote(establishmentId));
    columns.push(this._csvQuote(workerId));

    columns.push(BUDI.trainingCaterogy(BUDI.FROM_ASC, entity.category.id));
    columns.push(entity.title ? this._csvQuote(entity.title) : '');

    columns.push(this._fromDateToCsv(entity.completed)); // in UK date format dd/mm/yyyy (Training stores as `Javascript date`)
    columns.push(this._fromDateToCsv(entity.expires)); // in UK date format dd/mm/yyyy (Training stores as `Javascript date`)

    switch (entity.accredited) {
      case null:
        columns.push('');
        break;
      case 'Yes':
        columns.push(1);
        break;
      case 'No':
        columns.push(0);
        break;
      case 'Don\'t know':
        columns.push(999);
        break;
    }
    columns.push(entity.notes ? this._csvQuote(entity.notes) : '');

    return columns.join(',');
  }

};

module.exports.Training = Training;
