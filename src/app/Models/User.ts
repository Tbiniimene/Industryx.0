
export class User {
    public id: string;
    public username: string;
    public userPersonalInformations: {email: string,
        phone: string }
    public userMinimalInformations: { firstName:string,
        lastName: string }

    constructor() {

    }
}
