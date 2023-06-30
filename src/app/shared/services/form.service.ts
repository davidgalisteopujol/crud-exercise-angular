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
  private selectedUserSubject: Subject<User> = new Subject<User>(); 
  private selectedUserUpdatedSubject: Subject<void> = new Subject<void>() 

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
  

  setSelectedUser(user: User): void {  //brrar
    this.selectedUserSubject.next(user);
    // this.selectedUserUpdatedSubject.next(user);
  }

  getSelectedUserObservable():Observable<User> {
    return this.selectedUserSubject.asObservable();
  }

  getSelectedUserUpdatedObservable(): Observable<void> {  //brrar
    return this.selectedUserUpdatedSubject.asObservable();
  }

  updateUser(user:User):Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/${user.id}`,user).pipe(
      tap((updatedUser: User) => {
        console.log("updatedUser observable tap")
        this.selectedUserUpdatedSubject.next(void 0 );
        console.log(updatedUser)
      })
    );
  }


}