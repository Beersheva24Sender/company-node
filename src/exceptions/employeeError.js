import { ERROR_MESSAGES } from "./constants";

export default class EmployeeError extends Error{
    constructor(messageKey, details = ""){
        super(`${ERROR_MESSAGES[messageKey]} ${details}`);
        this.name = "EmployeeError";
    }
}