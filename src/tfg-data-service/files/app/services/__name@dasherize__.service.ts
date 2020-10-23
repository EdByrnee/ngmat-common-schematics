import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class <%= classify(pluralize(name)) %>Service {

  api:string; 
  constructor(private http: HttpClient) {
    this.api = environment.company_api + "portal/public";
  }

  load<%= classify(name) %>ById(id): Promise<any>{
    return this.http.get(this.api + '/<%= underscore(pluralize(name)) %>/' + id).toPromise();
  }

  load<%= classify(pluralize(name)) %>(query): Promise<any>{
    return this.http.get(this.api + '/<%= underscore(pluralize(name)) %>' + toQueryString(query)).toPromise();
  }

  create<%= classify(name) %>(data): Promise<any>{
    return this.http.post(this.api + '/<%= underscore(pluralize(name)) %>', data).toPromise();
  }

  delete<%= classify(name) %>(id: number): Promise<any>{
    return this.http.delete(this.api + '/<%= underscore(pluralize(name)) %>/' + id).toPromise();
  }

  update<%= classify(name) %>(id,data): Promise<any>{
    return this.http.post(this.api + '/<%= underscore(pluralize(name)) %>/' + id, data).toPromise();
  }


}

////////////////////////////////////////////
//           HELPER FUNCTIONS             //
///////////////////////////////////////////
function toQueryString(json){
  let query = "?";
  Object.keys(json).forEach(key=>{
    if (json[key]) query += key + '=' + json[key] + "&";
  })
  return query;
}