import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CrudService } from '../../services/crud.service';
import { User } from '../../interfaces/user.interface';
import { Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-table-user',
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.css']
})
export class TableUserComponent implements OnInit, OnDestroy {

  public users: User[] = [];
  private unsubscribe$ = new Subject<void>();

  @Input() newUserAdded: boolean = false;
  @Output() onEditUser: EventEmitter<User> = new EventEmitter();


  constructor(private crudService: CrudService) { }


  ngOnInit(): void {
    this.getUsers();
  };

  getUsers(): void {
    this.crudService.users$.subscribe((users) => {
      this.users = users;
    });
    this.crudService.getUsers().subscribe();
  };


  deleteUser(id: number): void {
    const idUser = id.toString();
    this.crudService.deleteUserById(idUser)
      .pipe(
        switchMap((_) => this.crudService.getUsers()),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((users) => {
        this.users = users;
      });
  };


  editUser(user: User) {
    this.onEditUser.emit(user);
  };

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  };


}