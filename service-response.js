class ResponseEntity {
    constructor(error, data) {
        this._error = error;
        this._data = data;
    }
    
    get error() {
        return this._error;
    }

    get data() {
        return this._data;
    }
}

class ServiceHelper {
    duplicate(data) {
        return new ResponseEntity('duplicate', data);
    }

    ok(data) {
        return new ResponseEntity(null, data);
    }

    illegal(expectedParams) {
        return new ResponseEntity('illegal', expectedParams);
    }

    error(data) {
        return new ResponseEntity('error', data);
    }
}

module.exports = {
    ResponseEntity,
    ServiceHelper
};
