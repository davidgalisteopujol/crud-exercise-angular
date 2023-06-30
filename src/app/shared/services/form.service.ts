import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from 'src/environments/environments';
import { Observable, Subject, tap } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private baseUrl: string = environments.baseUrl;
  private userAddedSubject: Subject<User> = new Subject<User>();

  private selectedUser!: User |null    //brrar
  private selectedUserUpdated: Subject<User | null> = new Subject<User | null>(); //brrar

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user).pipe(
      tap((addedUser: User) => {
        this.userAddedSubject.next(addedUser);
      })
    );
  }

  getUserAddedObservable(): Observable<User> {
    return this.userAddedSubject.asObservable();
  }

  deleteUserById(id:string):Observable<User> {
    return this.http.delete<User>(`${this.baseUrl}/users/${id}`)
  }
  

  setSelectedUser(user: User | null): void {  //brrar
    this.selectedUser = user;
    this.selectedUserUpdated.next(user);
  }

  getSelectedUser() {
    return this.selectedUser
  }

  getSelectedUserUpdated(): Observable<User | null> {  //brrar
    return this.selectedUserUpdated.asObservable();
  }

  updateUser(user:User):Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/${user.id}`,user)
  }

}