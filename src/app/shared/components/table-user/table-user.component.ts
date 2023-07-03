import { Component, OnInit } from '@angular/core';
import { FormService } from '../../services/form.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-table-user',
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.css']
})


export class TableUserComponent implements OnInit{

  public users: User[] = []

  constructor(private formService: FormService){}


  getUsersAPI() {
    this.formService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }


  ngOnInit(): void {
    this.getUsersAPI();

    this.formService.getUserAddedObservable().subscribe((addedUser) => {
      this.users.push(addedUser);
    });

    this.formService.getSelectedUserUpdatedObservable().subscribe(() => {
      this.getUsersAPI()
    })
  };


  deleteUser( id: number ): void {
    const idUser = id.toString()
    this.formService.deleteUserById(idUser).subscribe(response => {
      this.getUsersAPI();
    })
  };


  editUser( user: User ) {
    this.formService.setSelectedUser(user);
  };

}