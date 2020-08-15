import { Component, OnInit } from './node_modules/@angular/core';
import { ActivatedRoute, Router } from './node_modules/@angular/router';
import { AppPageComponent } from './node_modules/src/app/app-page.component';
import { MatSnackBar } from './node_modules/@angular/material/snack-bar';
import { AppService } from './node_modules/src/app/app.service';

<% const name = path.split("/").pop(); %>

@Component({
  selector: '<%= dasherize(name) %>-page',
  templateUrl: './<%= dasherize(name) %>-page.component.html',
  styleUrls: ['./<%= dasherize(name) %>-page.component.scss']
})
export class <%= classify(name) %>PageComponent implements OnInit {

  loading:boolean = false;
  error:boolean = true;

  constructor(private snackbar: SnackbarService, private route: ActivatedRoute, private router: Router) {
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
      this.snackbar.open("Successfully loaded data for page","DISSMISS", {'duration' : 3000});
      this.loading = false;
    }).catch(err=>{
      this.handleHttpError(err,true);
    })
  }

  loadData(): Promise<any>{
    return this.dataService.loadObjects({
      'limit' : 1000
    }).then(data=>{
      this.data = data['data'];
    })
  }


}