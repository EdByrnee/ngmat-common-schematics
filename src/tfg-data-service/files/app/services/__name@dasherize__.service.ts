import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class <%= classify(name) %>Service {

  api:string; 
  constructor(private http: HttpClient) {
    this.api = environment.company_api + "/portal/public";
  }

  loadById(id): Promise<any>{
    return this.http.get(this.api + '/<%=classify(name)%>' + '/' + id).toPromise();
  }

  loadAll(query): Promise<any>{
    return this.http.get(this.api + '/<%=classify(name)%>' + '/' + toQueryString(query)).toPromise();
  }

  create(data): Promise<any>{
    return this.http.post(this.api + '/<%=classify(name)%>', data).toPromise();
  }

  delete(): Promise<any>{
    return this.http.delete(this.api + '/<%=classify(name)%>').toPromise();
  }

  update(data): Promise<any>{
    return this.http.post(this.api + '/<%=classify(name)%>' + '/' + id, data).toPromise();
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