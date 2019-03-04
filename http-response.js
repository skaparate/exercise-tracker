class HttpResponse {
    constructor(responseObj, serviceResponse) {
        this._responseObj = responseObj;
        console.debug('HttpResponse: ', serviceResponse);
        
        if (serviceResponse.error) {
            const data = this._builData(serviceResponse.data, serviceResponse.error);
            switch (serviceResponse.error) {
                case 'not found':
                case 'duplicate':
                case 'illegal':
                    this._status = 400;
                    break;

                case 'error':
                    this._status = 500;
                    break;
            }
            this._body = data;
        } else {
            this._status = 200;
            this._body = serviceResponse.data;
        }
    }

    _builData(data, error) {
        if (data.hasOwnProperty('entity')) {
            const entity = data.entity;
            delete data.entity;
            return {
                error: this._formatError(error, entity),
                data
            };
        }
        return {
            error,
            data
        };
    }

    get status() {
        return this._status;
    }

    get body() {
        return this._body;
    }

    buildResponse() {
        return this._responseObj.status(this.status)
            .send(this.body);
    }

    _formatError(entity, error) {
        if (error == 'not found') {
            return entity + ' ' + error;
        }
        return error + ' ' + entity;
    }
}

module.exports = HttpResponse;
