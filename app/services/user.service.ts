import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  api:string; 
  constructor(private http: HttpClient) {
    this.api = environment.company_api + "/portal/public";
  }

  loadUserById(id): Promise<any>{
    return this.http.get(this.api + '/users/' + id).toPromise();
  }

  loadUsers(query): Promise<any>{
    return this.http.get(this.api + '/users' + toQueryString(query)).toPromise();
  }

  createUser(data): Promise<any>{
    return this.http.post(this.api + '/users', data).toPromise();
  }

  deleteUser(id: number): Promise<any>{
    return this.http.delete(this.api + '/users/' + id).toPromise();
  }

  updateUser(id,data): Promise<any>{
    return this.http.post(this.api + '/users/' + id, data).toPromise();
  }


}

////////////////////////////////////////////
//           HELPER FUNCTIONS             //
///////////////////////////////////////////
function toQueryString(json){
  let query = "?";
  Object.keys(json).forEach(key=>{
    query += key + '=' + json[key]
  })
}