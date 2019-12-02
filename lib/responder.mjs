import { HTTP_HEADERS } from '../config';

export default class responder {
    constructor(response) {
        this.response = response;
        this.statusCode = 200;
        this.errorCode = undefined;
        this.data = undefined;
        this.render = undefined;
    }

    send() {
        Object.entries(HTTP_HEADERS).forEach(header => this.response.set(header[0], header[1]));
        this.response.statusCode = this.statusCode;
        try {
            if (this.render) {
                this.response.render(this.render, this.data);
                return true;
            } else {
                const message = {};
            
                message.data = this.data;
                
                this.response.json(message);
                return true;
            }
        } catch(error) {
            return false;
        }
    }
}