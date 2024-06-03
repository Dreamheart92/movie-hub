import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { EMPTY, Observable, map, take } from "rxjs";
import { User } from "../types/user.type";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private auth: AuthService, private db: AngularFireDatabase) { }

    getUserData() {
        const userId = this.auth.user()?.uid;

        if (userId !== undefined) {
            return this.db.list('users', ref => ref.orderByChild('uid').equalTo(userId)).valueChanges()
                .pipe(
                    take(1),
                    map(result => {
                        return result[0] as User;
                    })
                )
        }
        return null;
    }
}