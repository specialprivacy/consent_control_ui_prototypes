import { AuditableRecord } from '../../../core/models/audit/auditable-record';


export class AppUser extends AuditableRecord {
    uid: string;
    email: string;
    isQuestionnaireable: boolean;
    isAdmin: boolean = false;

    constructor(init?: Partial<AppUser>, key?: string) {
        super();
        this.uid = key;
        Object.assign(this, init);
    }

}
