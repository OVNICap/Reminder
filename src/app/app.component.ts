import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'apollo-client/util/Observable';
import { ApiService, IUser, UserService, User } from '@ovnigames/framework';
import { environment } from '../environments/environment';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { ApolloQueryResult } from 'apollo-client';
import { ListsService } from './lists.service';

export interface ILoginLocalhostResult {
  loginLocalhost: User | null;
}

@Component({
  selector: 'rm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  guestPage: boolean;
  loading = true;
  navigating = false;
  user: IUser;

  private querySubscription: Subscription;

  constructor(private api: ApiService, private userService: UserService, private listsService: ListsService, private router: Router) {
    userService.setUserDataFields(`
      id
      timezone
      room
    `);
    api.config(environment);
    const params = {};
    location.search.split('&').forEach(chunk => {
      const [key, value] = (chunk.replace(/^\?/, '') + '=').split('=');

      params[key] = value;
    });

    if ('localhost-id' in params && 'localhost-token' in params) {
      const [id, token] = [params['localhost-id'], params['localhost-token']];
      console.log({
        id,
        token,
      });
      this.api.mutate<ILoginLocalhostResult>('loginLocalhost', {
        id,
        token,
      }, userService.getUserDataFields()).subscribe((result: ApolloQueryResult<ILoginLocalhostResult>) => {
        if (!result.data.loginLocalhost) {
          return;
        }

        const user = new User(result.data.loginLocalhost, undefined, (properties: IUser) => {
          if (user) {
            properties.id = user.id;
          }
          this.api.mutate<{updateUser: IUser}>('updateUser', properties, 'updated_at')
            .subscribe((updateResult: ApolloQueryResult<{updateUser: IUser}>) => {
              if (updateResult.data.updateUser) {
                user.updated_at = updateResult.data.updateUser.updated_at;
              }
            });
        });
        userService.registerUser(user, true);
        this.user = user;
      });
    }
  }

  ngOnInit() {
    this.listsService.logoutPing.subscribe(() => {
      this.user = undefined;
      this.userService.logout();
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.navigating = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.navigating = false;
        this.guestPage = /^\/?doc(\/.*)?$/.test(this.router.url);
      }
    });
    this.querySubscription = this.userService.getCurrent().subscribe((user: User) => {
      this.loading = false;
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
