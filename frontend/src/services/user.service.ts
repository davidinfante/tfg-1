import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';

import { User } from '../interfaces/user';
import { Query } from '../interfaces/query';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private path = '/api/user';

  private currentUser: User;
  userStateChangedNotifier = new EventEmitter();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private urlService: UrlService
  ) {
    this.authService.loginStateChangedNotifier.subscribe(data => {
      if (data && data.logout) {
        this.currentUser = null;
      } else {
        this.fetchAndSetCurrentUser();
      }
    });
  }

  setCurrentUser(username: string) {
    return this.getUser(username).pipe(map(user => {
      this.currentUser = user;
    }));
  }

  clearCurrentUser() {
    this.currentUser = null;
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  userLoggedIn(): boolean {
    return !!this.currentUser;
  }

  fetchAndSetCurrentUser(): void {
    this.httpClient.get(this.urlService.getBackendUrl() + this.path, {
        headers: this.authService.getXAccessTokenHeader()
      }
    ).subscribe(result => {
      if (result) {
        this.currentUser = result as User;
        this.userStateChangedNotifier.emit();
      }
    });
  }

  updateUser(email: string, userData: User): Observable<any> {
    return this.httpClient.put(this.urlService.getBackendUrl() + this.path, {
        email,
        data: userData
      }, {
        headers: this.authService.getXAccessTokenHeader()
      }
    );
  }

  removeUser(email: string): Observable<any> {
    const url = this.urlService.getBackendUrl() + this.path;
    return this.httpClient.request('delete', url, {
        body: {
          email
        },
        headers: this.authService.getXAccessTokenHeader()
      }
    );
  }

  getUser(username: string): Observable<any> {
    const url = this.urlService.getBackendUrl() + this.path + '/' + username;
    return this.httpClient.get(url, {
        headers: this.authService.getXAccessTokenHeader()
      }
    );
  }

  queryUser(query: Query): Observable<any> {
    return this.httpClient.post(this.urlService.getBackendUrl() + this.path + '/query', {
        ...query
      }, {
        headers: this.authService.getXAccessTokenHeader()
      }
    );
  }

  addUser(user: User): Observable<any> {
    return this.httpClient.post(this.urlService.getBackendUrl() + this.path, {
        ...user
      }, {
        headers: this.authService.getXAccessTokenHeader()
      }
    );
  }
}
