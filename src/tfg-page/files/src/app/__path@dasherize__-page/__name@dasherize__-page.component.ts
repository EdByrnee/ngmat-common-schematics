import { Component, OnInit } from '../../../../../tfg-data-service/files/src/app/__path@dasherize__-page/node_modules/@angular/core';
import { ActivatedRoute, Router } from '../../../../../tfg-data-service/files/src/app/__path@dasherize__-page/node_modules/@angular/router';
import { MatSnackBar}  from '@angular/material/snack-bar';

<% const name = path.split("/").pop(); %>

@Component({
  selector: '<%= dasherize(name) %>-page',
  templateUrl: './<%= dasherize(name) %>-page.component.html',
  styleUrls: ['./<%= dasherize(name) %>-page.component.scss']
})
export class <%= classify(name) %>PageComponent implements OnInit {

  loading:boolean = false;
  error:boolean = true;

  constructor(
    private dataService: DataService,
    private snackbar: SnackbarService,
    private route: ActivatedRoute,
    private router: Router) {
      super(snackbar);
  }
  
  ngOnInit() {
    this.initPageLoad();
  }

  initPageLoad(){
    this.loading = true;
    this.error = false;
    return Promise.all([
      this.loadData()
    ]).then(data=>{
      this.loading = false;
    }).catch(err=>{
      this.handleHttpError(err,true);
    })
  }

  loadData(){
    return this.dataService.loadObjects({
      'limit' : 1000
    }).then(data=>{
      this.data = data['data'];
    })
  }



}