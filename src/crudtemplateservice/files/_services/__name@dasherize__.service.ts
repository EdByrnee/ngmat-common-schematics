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

  loadById(id): Promise<<%= classify(name) %>>{
    return Promise.resolve({});
  }

  loadAll(query): Promise<<%= classify(name) %>>{
    return Promise.resolve({});
  }

  create(data): Promise<<%= classify(name) %>>{
    return Promise.resolve({});
  }

  delete(): Promise<<%= classify(name) %>>{
    return Promise.resolve({});
  }

  update(data): Promise<<%= classify(name) %>>{
    return Promise.resolve({});
  }


}