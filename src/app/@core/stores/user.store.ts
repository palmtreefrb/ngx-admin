import { Injectable } from '@angular/core';
import { User } from '../interfaces/common/users';
import { BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  constructor(private storage: LocalStorageService) {}
  private user: User;

  protected userState$ = new BehaviorSubject<User | {}>({});

  private get currentUser(): User {
    this.user = this.storage.retrieve('user');
    return this.user;
  }
  private set currentUser(value: User) {
    this.user = value;
    this.storage.store('user', this.user);
  }


  getUser(): User {
    return this.currentUser;
  }

  setUser(paramUser: User) {
    this.user = paramUser;
    this.currentUser = this.user;
    this.changeUserState(this.user);
  }

  onUserStateChange() {
    return this.userState$.pipe(share());
  }

  changeUserState(paramUser: User) {
    this.userState$.next(paramUser);
  }

  setSetting(themeName: string) {
    if (this.user) {
      if (this.user.settings) {
        this.user.settings.themeName = themeName;
      } else {
        this.user.settings = { themeName: themeName };
      }
      this.currentUser = this.user;
      this.changeUserState(this.user);
    }
  }
}
