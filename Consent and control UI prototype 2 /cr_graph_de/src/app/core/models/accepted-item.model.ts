import { AuditableRecord } from './audit/auditable-record';

export class AcceptedItem extends AuditableRecord {
    path: string[];

    constructor(init?: Partial<AcceptedItem>) {
        super();
        Object.assign(this, init);
    }
}
