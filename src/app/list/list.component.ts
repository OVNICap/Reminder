import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService, findMyTimezone, findTimezone, ITimezone, User, UserService } from '@ovnigames/framework';
import { Subject } from 'rxjs';
import { ApolloQueryResult } from 'apollo-client';
import { MatDatetimepicker } from '@mat-datetimepicker/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { ListsService } from '../lists.service';

const date = new Date();
date.setTime(date.getTime() + 14 * 24 * 3600 * 1000);

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

interface RemindItemsResult {
  remindItems: RemindItem[];
}

interface CreateRemindItemResult {
  createRemindItem: RemindItem;
}

@Component({
  selector: 'rm-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  public destroySubject = new Subject<boolean>();
  public submitting = false;
  public now = new Date();
  public newItemForm = new FormGroup({
    name: new FormControl(''),
    start: new FormControl(''),
    end: new FormControl(''),
    hours: new FormControl(''),
    quantity: new FormControl(''),
  });
  public id: string = null;
  public name: string = null;
  public items: RemindItem[] = null;
  public timezone?: ITimezone;

  @ViewChild('dueDatePicker', {static: false}) private dueDatePicker: MatDatetimepicker<Date>;

  private user: User;
  private listItemsFields = `
    id
    name
    hours
    start
    end
    quantity
  `;

  constructor(
    private api: ApiService,
    private listsService: ListsService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
  ) {
  }

  public ngOnInit(): void {
    this.activatedRoute.params.pipe(
      takeUntil(this.destroySubject),
      tap(params => {
        this.id = params.id;
        this.name = this.listsService.getCachedListName(this.id);
      }),
      switchMap(() => this.listsService.getList(this.id)),
      tap(list => {
        this.name = list.name;
        this.items = list.items;
      }),
    ).subscribe();

    this.userService.getCurrent().pipe(
      takeUntil(this.destroySubject),
      tap((user: User) => {
        this.user = user;
        this.timezone = findTimezone(user.timezone);

        if (!this.timezone) {
          this.timezone = findMyTimezone();
          this.saveTimezone(this.timezone);
        }
      }),
    ).subscribe();
  }

  public saveTimezone(timezone: ITimezone): void {
    this.userService.updateTimezone(this.user.id, timezone).finally(() => {
      this.timezone = timezone;
    });
  }

  public updateTimezone(timezone: ITimezone): void {
    this.timezone = undefined;
    this.saveTimezone(timezone);
  }

  public ngOnDestroy(): void {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }

  public delete(item: RemindItem): void {
    this.items.splice(this.items.indexOf(item), 1);
    this.api.mutate('deleteRemindItem', {
      id: item.id,
    }).subscribe();
  }

  public create(): void {
    if (!this.newItemForm.valid) {
      return;
    }

    const value = this.newItemForm.value;
    this.api.mutate<CreateRemindItemResult>('createRemindItem', {
      group_id: this.id,
      name: value.name,
      start: value.start.toISOString(),
      end: value.end.toISOString(),
      hours: value.hours.replace(/\n/g, ',').replace(/\s/g, '').split(',').map((time: string) => {
        const [hours, minutes] = (time + ':').split(':');
        const hoursNumber = parseInt(hours, 10);
        const minutesNumber = parseInt(minutes.replace(/\D/g, ''), 10);

        if (isNaN(hoursNumber) || hoursNumber >= 24 || hoursNumber < 0 || minutesNumber >= 60 || minutesNumber < 0) {
          return null;
        }

        return [hoursNumber, minutesNumber].map(number => number < 10 ? '0' + number : number).join(':');
      }).filter((time: string | null) => time).join(','),
      quantity: value.quantity,
    }, this.listItemsFields).subscribe((result: ApolloQueryResult<CreateRemindItemResult>) => {
      this.items.push(result.data.createRemindItem);
      this.submitting = false;
    });
    this.submitting = true;
  }
}
