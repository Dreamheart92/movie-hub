export class UserModel {
    username: string | undefined;
    email: string | undefined;
    uid: string | undefined;

    constructor(username: string, email: string, uid: string) {
        this.username = username;
        this.email = email;
        this.uid = uid;
    }
} 