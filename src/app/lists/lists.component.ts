import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatetimepicker } from '@mat-datetimepicker/core';
import { ListsService, RemindGroup } from '../lists.service';

const date = new Date();
date.setTime(date.getTime() + 14 * 24 * 3600 * 1000);

@Component({
  selector: 'rm-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})
export class ListsComponent implements OnInit, OnDestroy {
  public submitting = false;
  public newListForm = new FormGroup({
    name: new FormControl(''),
  });
  public lists: RemindGroup[] = null;

  @ViewChild('dueDatePicker', {static: false}) private dueDatePicker: MatDatetimepicker<Date>;

  constructor(private listsService: ListsService) {
  }

  public logout(): void {
    this.listsService.logout();
  }

  public ngOnInit(): void {
    this.listsService.getLists().subscribe(lists => {
      this.lists = lists;
    });
  }

  public ngOnDestroy(): void {
  }

  public create(): void {
    if (!this.newListForm.valid) {
      return;
    }

    const value = this.newListForm.value;

    this.listsService.createList(value.name).subscribe(() => {
      this.submitting = false;
    });

    this.submitting = true;
  }
}
