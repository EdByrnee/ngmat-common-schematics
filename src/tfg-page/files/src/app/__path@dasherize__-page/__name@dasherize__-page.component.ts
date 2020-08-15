import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppPageComponent } from 'src/app/app-page.component';
import { MatSnackBar } from '@angular/material/snack-bar';
<% const name = path.split("/").pop(); %>

@Component({
  selector: '<%= dasherize(name) %>-page',
  templateUrl: './<%= dasherize(name) %>-page.component.html',
  styleUrls: ['./<%= dasherize(name) %>-page.component.scss']
})
export class <%= classify(name) %>PageComponent extends AppPageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, snackbar: MatSnackBar ) {
    super(snackbar);
  }
  
  ngOnInit() {
    this.initPageLoad();
  }

  initPageLoad(){
    this.loading = true;
    this.error = false;
    // return Promise.all([
      
    // ]).then(data=>{
    //   this.displayMessage("Successfully loaded data for page");
    //   this.loading = false;
    // }).catch(err=>{
    //   this.handleHttpError(err,true);
    // })
  }


}