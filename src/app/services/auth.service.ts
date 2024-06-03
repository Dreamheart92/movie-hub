import { Injectable, Signal, WritableSignal, computed, effect, inject, signal } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { BehaviorSubject, Observable, catchError, from, takeUntil, tap, throwError } from "rxjs";
import firebase from "firebase/compat/app"
import { FirebaseError } from "@angular/fire/app";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { UserModel } from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    isLoaded = new BehaviorSubject(false);

    user: WritableSignal<firebase.User | null | undefined> = signal(undefined);

    isLoggedIn = computed(() => {
        if (this.user() !== null) {
            return true;
        }
        return false;
    })

    constructor(
        private afAuth: AngularFireAuth,
        private db: AngularFireDatabase
    ) {
        effect(() => {
            if (this.user() !== undefined) {
                this.isLoaded.next(true);
            }
        });
    }

    initiateUser() {
        this.afAuth.authState
            .subscribe(user => {
                this.user.set(user);
            })
    }


    signUp(email: string, password: string) {
        return from(this.afAuth.createUserWithEmailAndPassword(email, password))
            .pipe(
                catchError(err => {
                    const errMessage = this.handleFirebaseError(err);
                    throw new Error(errMessage);
                })
            )
    }

    signIn(email: string, password: string) {
        return from(this.afAuth.signInWithEmailAndPassword(email, password))
            .pipe(
                catchError(err => {
                    const errMessage = this.handleFirebaseError(err);
                    throw new Error(errMessage);
                })
            )
    }

    signOut() {
        this.afAuth.signOut();
    }

    registerUserToDb(username: string, email: string, uid: string) {
        const user = new UserModel(username, email, uid);
        this.db.list('users').push(user);
    }

    handleFirebaseError(err: FirebaseError) {
        const errorMessage = err.code.split('/')[1];
        if (errorMessage === 'weak-password') {
            return 'Password should be at least 6 characters'
        } else if (errorMessage === 'email-already-in-use') {
            return 'Email is already registered'
        } else if (errorMessage === 'invalid-email') {
            return 'Email adress is invalid'
        } else if (errorMessage === 'invalid-credential') {
            return 'Wrong email adress or password'
        }

        return err.code;
    }
}