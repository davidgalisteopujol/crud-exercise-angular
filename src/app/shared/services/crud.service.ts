import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject, of, tap } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Country } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private countryUrl = 'http://api.countrylayer.com/v2'; 
  private apiKey = environment.api_key;

  private baseUrl = environment.baseUrl;
  private userAddedSubject: Subject<User> = new Subject<User>();
  private selectedUserSubject: Subject<User> = new Subject<User>(); 
  private selectedUserUpdatedSubject: Subject<User> = new Subject<User>();
  

  constructor(private http: HttpClient) {}


  getCountries(): Observable<Country[] | []> {
      return this.http.get<Country[]>(`${this.countryUrl}/all?access_key=${this.apiKey}`); 
  };
  
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  };


  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user).pipe(
      tap((addedUser: User) => {
        this.userAddedSubject.next(addedUser);  //set user y usar esta linea 38
      })
    );
  };


  getUserAddedObservable(): Observable<User> {
    return this.userAddedSubject.asObservable();
  };


  deleteUserById(id:string):Observable<User> {
    return this.http.delete<User>(`${this.baseUrl}/${id}`);
  };
  

  setSelectedUser(user: User): void {  
    this.selectedUserSubject.next(user);
  }


  getSelectedUserObservable():Observable<User> {
    return this.selectedUserSubject.asObservable();
  }


  getSelectedUserUpdatedObservable(): Observable<User> {  
    return this.selectedUserUpdatedSubject.asObservable();
  }


  updateUser(user:User):Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${user.id}`,user).pipe(
      tap((updatedUser: User) => {
        this.selectedUserUpdatedSubject.next(updatedUser);
      })
    );
  };

 

}