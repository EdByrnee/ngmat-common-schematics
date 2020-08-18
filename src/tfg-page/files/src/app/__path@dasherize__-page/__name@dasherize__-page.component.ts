import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar}  from '@angular/material/snack-bar';
import { DataService } from 'src/app/_services/data.service';

<% const name = path.split("/").pop(); %>

@Component({
  selector: '<%= dasherize(name) %>-page',
  templateUrl: './<%= dasherize(name) %>-page.component.html',
  styleUrls: ['./<%= dasherize(name) %>-page.component.scss']
})
export class <%= classify(name) %>PageComponent implements OnInit {

  loading:boolean = false;
  error:boolean = false;

  constructor(
    private dataService: DataService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router) {
  }
  
  ngOnInit() {
    this.initPageLoad();
  }

  data;
  initPageLoad(){
    this.loading = true;
    this.error = false;
    return Promise.all([
      this.load<%= classify(name) %>()
    ]).then(data=>{
      this.loading = false;
    }).catch(err=>{
      this.handlePageError(err,true);
      switch(err.status){
        default:
        this.snackbar.open('There was an eror loading the page, please try again later', 'DISMISS', {'duration': 3000})
      }
    })
  }

  handlePageError(err,fullPageError){
    console.log(err);
    this.error = fullPageError;
  }


  load<%= classify(name) %>(){
    return Promisel.resolve();
    return this.dataService.loadObject({
      'limit' : 1000
    }).then(data=>{
      this.data = data['data'];
    })
  }



}