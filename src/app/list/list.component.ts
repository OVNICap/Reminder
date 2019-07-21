import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '@ovnigames/framework';
import { Subject } from 'rxjs';
import { ApolloQueryResult } from 'apollo-client';
import { MatDatetimepicker } from '@mat-datetimepicker/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  @ViewChild('dueDatePicker', {static: false}) private dueDatePicker: MatDatetimepicker<Date>;

  private listItemsFields = `
    id
    name
    hours
    start
    end
    quantity
  `;

  constructor(private api: ApiService, private listsService: ListsService, private activatedRoute: ActivatedRoute) {
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
      })
    ).subscribe();
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
        const hoursNumber = parseInt(hours);
        const minutesNumber = parseInt(minutes) | 0;

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
