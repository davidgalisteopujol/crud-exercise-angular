import { Component, OnInit } from '@angular/core';
import { FormService } from '../../services/crud.service';
import { User } from '../../interfaces/user.interface';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-table-user',
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.css']
})


export class TableUserComponent implements OnInit{

  public users: User[] = []

  constructor(private formService: FormService){}


  ngOnInit(): void {
    this.getUsers();

    this.formService.getUserAddedObservable().subscribe((addedUser) => {
      this.users.push(addedUser);
    });

    this.formService.getSelectedUserUpdatedObservable().subscribe(() => {
      this.getUsers()
    })
  };

  getUsers() {
    this.formService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }


  deleteUser( id: number ): void {
    const idUser = id.toString()
    this.formService.deleteUserById(idUser)
      .pipe(
        switchMap( (_) => this.formService.getUsers() )
      )
      .subscribe((users) => {
        this.users = users;
      })
  };


  editUser( user: User ) {
    this.formService.setSelectedUser(user);
  };

}