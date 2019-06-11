/*
 * A validation is of the format:
 *  {
 *     type: "ERROR | WARNING",
 *     code: 123,
 *     message: "The Date of Birth cannot be after Year of Arrival",
 *     properties: ["DateOfBirth", "YearOfArival"]
 *  }
 */

class ValidationMessage {
  static get ERROR() { return 'Error' };
  static get WARNING() { return 'Warning' };

  constructor(type, code, message, properties) {
    this._type = type;
    this._code = code;
    this._message = message;
    this._properties = properties;
  }

  get type() {
      return this._type;
  }

  get isError() {
    this._type === ValidationMessage.ERROR;
  }
  get isWarning() {
    this._type === ValidationMessage.WARNING;
  }

  
};

module.exports.ValidationMessage = ValidationMessage;