import { Component, OnInit } from '../../../../../tfg-data-service/files/src/app/__path@dasherize__-page/node_modules/@angular/core';
import { ActivatedRoute, Router } from '../../../../../tfg-data-service/files/src/app/__path@dasherize__-page/node_modules/@angular/router';

    this.newJobsFormGroup = new FormGroup({
        "undefined" : [null]
    })
  
newJobsFormGroup:FormGroup;
import { MatSnackBar}  from '@angular/material/snack-bar';



@Component({
  selector: 'page-list-page',
  templateUrl: './page-list-page.component.html',
  styleUrls: ['./page-list-page.component.scss']
})
export class PageListPageComponent implements OnInit {

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
      this.snackbar.open("Successfully loaded data for page","DISMISS", {'duration' : 3000});
      this.loading = false;
      this.error = true;
    }).catch(err=>{
      this.handleHttpError(err,true);
    })
  

  loadData(){
    return this.dataService.loadObjects({
      'limit' : 1000
    ).then(data=>{
      this.data = data['data'];
    )
  

    /////////////////////////////////////////
    // ACCOUNTSLIST TABLE BELOW
    /////////////////////////////////////////
    
    accounts_list_rows:any = [];
    accounts_list_limit: number = 15;
    accounts_list_count: number = 0;
    accounts_list_current_page: number = 1;
    displayedColumns: string[] = ["account_name","account_type_name","count"];
    
    accounts_list_order_by:any = null;
    accounts_list_order_direction:any = null;
    
    
    orderAccountsListTableData(sort:any){
        this.accounts_list_order_by = sort.active;
        this.accounts_list_order_direction = sort.direction;
        this.loadAccountsListTableData()
    }
    
    changePageAccountsList($event){
        this.accounts_list_current_page = $event.pageIndex + 1;
        this.accounts_list_limit = $event.pageSize;
        this.router.navigate(
          [], 
          {
            relativeTo: this.route,
            queryParams: { page: this.accounts_list_current_page, limit: this.accounts_list_limit },
            queryParamsHandling: "merge"
          });
    }
  
    updateFiltersFromQueryParams(){
      let queryParams = this.route.snapshot.queryParams;
      if (queryParams["page"]) this.accounts_list_current_page = queryParams["page"];
      if (queryParams["limit"]) this.accounts_list_limit = queryParams["limit"];
    }


  loadAccountsListTableData(){
    this.dataService.loadDemo({
        orderBy: this.accounts_list_order_by,
        orderDirection: this.accounts_list_order_direction,
        limit: this.accounts_list_limit,
        page: this.accounts_list_current_page
    }).then(data=>{

      this.accounts_list_rows = data['data'];
      this.accounts_list_limit = data['limit'];
      this.accounts_list_count = data['count'];
      this.accounts_list_current_page = data['page'];

    })
  }
  
  /////////////////////////////////////////
  // ACCOUNTSLIST TABLE ABOVE
  /////////////////////////////////////////
  

 




    /////////////////////////////////////////
    // ACCOUNTSLIST TABLE BELOW
    /////////////////////////////////////////
    
    accounts_list_rows:any = [];
    accounts_list_limit: number = 15;
    accounts_list_count: number = 0;
    accounts_list_current_page: number = 1;
    displayedColumns: string[] = ["account_name","account_type_name","count"];
    
    accounts_list_order_by:any = null;
    accounts_list_order_direction:any = null;
    
    
    orderAccountsListTableData(sort:any){
        this.accounts_list_order_by = sort.active;
        this.accounts_list_order_direction = sort.direction;
        this.loadAccountsListTableData()
    }
    
    changePageAccountsList($event){
        this.accounts_list_current_page = $event.pageIndex + 1;
        this.accounts_list_limit = $event.pageSize;
        this.router.navigate(
          [], 
          {
            relativeTo: this.route,
            queryParams: { page: this.accounts_list_current_page, limit: this.accounts_list_limit },
            queryParamsHandling: "merge"
          });
    }
  
    updateFiltersFromQueryParams(){
      let queryParams = this.route.snapshot.queryParams;
      if (queryParams["page"]) this.accounts_list_current_page = queryParams["page"];
      if (queryParams["limit"]) this.accounts_list_limit = queryParams["limit"];
    }


  loadAccountsListTableData(){
    this.dataService.loadDemo({
        orderBy: this.accounts_list_order_by,
        orderDirection: this.accounts_list_order_direction,
        limit: this.accounts_list_limit,
        page: this.accounts_list_current_page
    }).then(data=>{

      this.accounts_list_rows = data['data'];
      this.accounts_list_limit = data['limit'];
      this.accounts_list_count = data['count'];
      this.accounts_list_current_page = data['page'];

    })
  }
  
  /////////////////////////////////////////
  // ACCOUNTSLIST TABLE ABOVE
  /////////////////////////////////////////
  

 
}

