import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from 'src/environments/environments';
import { Observable, Subject, of, tap } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Country } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private apiUrl:string= 'http://api.countrylayer.com/v2';
  private apiKey:string ='?access_key=e1be57df5a24912850cacb61bfc6f82e'  

  private baseUrl: string = environments.baseUrl;
  private userAddedSubject: Subject<User> = new Subject<User>();
  private selectedUserSubject: Subject<User> = new Subject<User>(); 
  private selectedUserUpdatedSubject: Subject<void> = new Subject<void>();
  

  constructor(private http: HttpClient) {}


  getCountries(): Observable<Country[] | []> {
      return this.http.get<Country[]>(`${this.apiUrl}/all${this.apiKey}`); 
  };
  
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  };


  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user).pipe(
      tap((addedUser: User) => {
        this.userAddedSubject.next(addedUser);
      })
    );
  };


  getUserAddedObservable(): Observable<User> {
    return this.userAddedSubject.asObservable();
  };


  deleteUserById(id:string):Observable<User> {
    return this.http.delete<User>(`${this.baseUrl}/users/${id}`);
  };
  

  setSelectedUser(user: User): void {  
    this.selectedUserSubject.next(user);
  }


  getSelectedUserObservable():Observable<User> {
    return this.selectedUserSubject.asObservable();
  }


  getSelectedUserUpdatedObservable(): Observable<void> {  
    return this.selectedUserUpdatedSubject.asObservable();
  }


  updateUser(user:User):Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/${user.id}`,user).pipe(
      tap((updatedUser: User) => {
        this.selectedUserUpdatedSubject.next(void 0 );
      })
    );
  };

}