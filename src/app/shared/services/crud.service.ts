import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Country } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private countryUrl = 'http://api.countrylayer.com/v2';
  private apiKey = environment.api_key;
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { };
  
  getCountries(): Observable<Country[] | []> {
    return this.http.get<Country[]>(`${this.countryUrl}/all?access_key=${this.apiKey}`);
  };

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl)
  };

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  };

  deleteUserById(id: string): Observable<User> {
    return this.http.delete<User>(`${this.baseUrl}/${id}`);
  };

  updateUser(user: User): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${user.id}`, user);
  };


}