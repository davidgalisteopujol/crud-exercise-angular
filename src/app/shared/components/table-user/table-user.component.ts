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

  ngOnInit(): void {
    this.formService.getUsers().subscribe((users) => {
      this.users = users;
    });

    this.formService.getUserAddedObservable().subscribe((addedUser) => {
      this.users.push(addedUser);
    });
  }

  deleteUser(id: number):void {
    const idUser = id.toString()
    this.formService.deleteUserById(idUser).subscribe(response => console.log(response))
    
    this.formService.getUsers().subscribe((users) => {
      this.users = users;
    });

  }

  editUser(user: User) {
    this.formService.setSelectedUser(user);
  }


}