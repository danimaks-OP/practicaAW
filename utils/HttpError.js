export default class HttpError extends Error{
    constructor(status, message, campos = null){
        super(message);
        this.status = status;
        this.campos = campos;
    }
}