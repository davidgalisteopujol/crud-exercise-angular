import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject, of, tap } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Country } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private countryUrl = 'http://api.countrylayer.com/v2'; 
  private apiKey = environment.api_key;

  private baseUrl = environment.baseUrl;

  private usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public users$: Observable<User[]> = this.usersSubject.asObservable();


  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[] | []> {
    return this.http.get<Country[]>(`${this.countryUrl}/all?access_key=${this.apiKey}`); 
};

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl).pipe(
      tap((users) => this.usersSubject.next(users))
    );
  }


  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user)
  };


  deleteUserById(id:string):Observable<User> {
    return this.http.delete<User>(`${this.baseUrl}/${id}`);
  };

  updateUser(user:User):Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${user.id}`,user)
  };
 


}

  
  //  addUser(user: User): Observable<User> {
  //    return this.http.post<User>(this.baseUrl, user).pipe(
  //      tap((addedUser: User) => {
  //        this.userAddedSubject.next(addedUser);  //set user y usar esta linea 38
  //      })
  //    );
  //  };


  //  getUserAddedObservable(): Observable<User> {
  //    return this.userAddedSubject.asObservable();
  //  };


 

  //  setSelectedUser(user: User): void {  
  //    this.selectedUserSubject.next(user);
  //  }


  //  getSelectedUserObservable():Observable<User> {
  //    return this.selectedUserSubject.asObservable();
  //  }


  //  getSelectedUserUpdatedObservable(): Observable<User> {  
  //    return this.selectedUserUpdatedSubject.asObservable();
  //  }


  //  updateUser(user:User):Observable<User> {
  //    return this.http.patch<User>(`${this.baseUrl}/${user.id}`,user).pipe(
  //      tap((updatedUser: User) => {
  //        this.selectedUserUpdatedSubject.next(updatedUser);
  //      })
  //    );
  //  };

  

