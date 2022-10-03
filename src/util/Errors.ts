export enum ERROR_CODE_INTERNAL {
    REPOSITORIES_NOT_LOADED_ACCESS,
    REPOSITORIES_NOT_LOADED_SAVE,
    CONFIG_NOT_LOADED_ACCESS,
    CONFIG_NOT_LOADED_SAVE
}

export enum ERROR_CODE_APPLICATION {}
class DomainError extends Error {
    constructor(errorType: ERROR_CODE_INTERNAL | ERROR_CODE_APPLICATION | string) {
        super(errorType.toString());
        this.name = this.constructor.name;
    }
}

export class ObjectNotFoundError extends DomainError {
    constructor(objectName: string, id: string) {
        super(`Could not find object ${objectName} for id ${id}`);
    }
}

export class InternalError extends DomainError {}
