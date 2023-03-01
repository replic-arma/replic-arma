export class ReplicArmaError extends Error {
    public description: string;
    public source: string;
    constructor(message: { description: string; source: string }) {
        super(message.description);
        this.description = message.description;
        this.source = message.source;
    }
}

export function isReplicArmaError(err: unknown): err is ReplicArmaError {
    if (typeof err === 'object') {
        return err !== null && 'description' in err;
    }
    return false;
}
