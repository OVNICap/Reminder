import { EventEmitter, Injectable } from '@angular/core';
import { ApiService, QueryInterface } from '@ovnigames/framework';
import { ApolloQueryResult } from 'apollo-client';
import { combineLatest, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface RemindGroup {
  id?: string;
  name?: string;
  room?: string;
  items?: RemindItem[];
  __typename: string;
}

interface RemindItem {
  id?: string;
  name?: string;
  hours?: string[];
  start?: string;
  end?: string;
  quantity?: string;
  room?: string;
  __typename: string;
}

export interface RemindGroupResult {
  remindGroups: QueryInterface<RemindGroup[]>;
}

export interface CreateRemindGroupResult {
  createRemindGroup: RemindGroup;
}

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  protected userLoggedOut: EventEmitter<void> = new EventEmitter();
  protected lists: RemindGroup[] = null;
  protected listsFields = `
    id
    name
  `;
  protected listsWithItemsFields = `
    id
    name
    items {
      id
      name
      hours
      start
      end
      quantity
    }
  `;

  constructor(private api: ApiService) {
  }

  public logout(): void {
    this.userLoggedOut.emit();
  }

  public get logoutPing() {
    return this.userLoggedOut.asObservable();
  }

  public getLists(): Observable<RemindGroup[]> {
    if (this.lists) {
      return of(this.lists);
    }

    return this.api.query('remindGroups', null, this.listsFields).pipe(
      map((result: ApolloQueryResult<RemindGroupResult>) => result.data.remindGroups.data),
      tap(lists => this.lists = lists),
    );
  }

  public createList(name: string): Observable<RemindGroup> {
    return this.api.mutate<CreateRemindGroupResult>('createRemindGroup', {
      name,
    }, this.listsFields).pipe(
      map((result: ApolloQueryResult<CreateRemindGroupResult>) => result.data.createRemindGroup),
      tap(list => this.lists.push(list)),
    );
  }

  public getCachedListName(id: string | number): string | null {
    const lists = (this.lists || []).filter(list => list.id + '' === id + '');

    return lists.length ? lists[0].name : null;
  }

  public getList(id: string | number): Observable<RemindGroup> {
    return combineLatest([
      this.getLists(),
      this.api.query('remindGroups', {id}, this.listsWithItemsFields)
    ]).pipe(
      map(latest => latest[1]),
      map((result: ApolloQueryResult<RemindGroupResult>) => result.data.remindGroups.data),
      tap(lists => {
        lists.forEach(list => {
          this.lists.forEach(existingList => {
            if (existingList.id + '' === list.id + '') {
              Object.assign(existingList, list);
            }
          });
        });
      }),
      map(lists => lists[0]),
    );
  }
}
