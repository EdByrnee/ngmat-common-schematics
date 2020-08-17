export function insertAfterImports(insersion:string, original:string): string{

    // Find the position of the end of the constructor
    let end_of_imports_num = original.lastIndexOf("import")
    let next_line_after_last_import = original.substr(end_of_imports_num).search("/n");

    let insert_point_num = end_of_imports_num + next_line_after_last_import;

    return original = original.substring(0,insert_point_num) + "\n" + insersion + original.substring(insert_point_num);

}



let insersion  = 'import { Toast } from "@ye/ma;"';

let original_ts = `
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppPageComponent } from 'src/app/app-page.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JobsService } from '../jobs.service';


@Component({
  selector: 'jobs-list-page',
  templateUrl: './jobs-list-page.component.html',
  styleUrls: ['./jobs-list-page.component.scss']
})
export class JobsListPageComponent extends AppPageComponent implements OnInit {


  constructor(private route: ActivatedRoute, private router: Router, snackbar: MatSnackBar, private jobsService: JobsService ) {
    super(snackbar);
    let queryParams = this.route.snapshot.queryParams;
    if (queryParams["AssignedSurveyor__c"]) this.AssignedSurveyor__c = queryParams["AssignedSurveyor__c"];
    if (queryParams["Client__c"]) this.Client__c = queryParams["Client__c"];
  }
  
  ngOnInit() {
    this.initPageLoad();
  }

  initPageLoad(){
    //this.loading = true;
    this.error = false;
    return Promise.all([
      this.loadJobListTableTableData()
    ]).then(data=>{
      this.displayMessage("Successfully loaded data for page");
      this.loading = false;
    }).catch(err=>{
      this.handleHttpError(err,true);
    })
  }

    clients = [
      {
        "id": "0010Y00000AZYngQAH",
        "client_name": "0010Y00000AZYngQAH"
      },
      {
        "id": "0010Y000003oytmQAA",
        "client_name": "0010Y000003oytmQAA"
      }
    ]
    Client__c = null;

    surveyors = [
      {
        "id": "0050Y000000qzcxQAA",
        "surveyor_name": "Joe Chellew"
      },
      {
        "id": "0050Y000002sMnyQAE",
        "surveyor_name": "Mikey Smith"
      }
    ]
    AssignedSurveyor__c = null;

    job_statuses = [

      {
        "Id": "New",
        "Name": "New"
      },
      {
        "Id": "Site Visit Arranged",
        "Name": "Site Visit Arranged"
      },
      {
        "Id": "Schedule of Works Sent",
        "Name": "Schedule of Works Sent"
      },
      {
        "Id" : "Works Arranged",
        "Name" : "Works Arranged"
      },
      {
        "Id" : "Awaiting Invoicing",
        "Name" : "Awaiting Invoicing"
      },
      {
        "Id": "Cancelled without Invoicing",
        "Name": "Cancelled without Invoicing"
      }
    ]
    Job_Status__c = null;

    



    /////////////////////////////////////////
    // JOBLISTTABLE TABLE BELOW
    /////////////////////////////////////////
    
    job_list_table_rows:any = [];
    job_list_table_limit: number = 15;
    job_list_table_count: number = 0;
    job_list_table_current_page: number = 1;
    displayedColumns: string[] = ["Name","Client__c","Job_Status__c","AssignedSurveyor__c","Days_to_Since_Job_Received__c"];
    
    job_list_table_order_by:any = null;
    job_list_table_order_direction:any = null;
    
    
    orderJobListTableTableData(sort:any){
        this.job_list_table_order_by = sort.active;
        this.job_list_table_order_direction = sort.direction.toUpperCase();
        this.initPageLoad();
    }
    
    changePageJobListTable($event){
        this.job_list_table_current_page = $event.pageIndex + 1;
        this.job_list_table_limit = $event.pageSize;
        this.router.navigate(
          [], 
          {
            relativeTo: this.route,
            queryParams: { page: this.job_list_table_current_page, limit: this.job_list_table_limit },
            queryParamsHandling: "merge"
          });
        this.initPageLoad();
    }
  
    updateFiltersFromQueryParams(){
      let queryParams = this.route.snapshot.queryParams;
      if (queryParams["page"]) this.job_list_table_current_page = queryParams["page"];
      if (queryParams["limit"]) this.job_list_table_limit = queryParams["limit"];
    }


  loadJobListTableTableData(){
    return this.jobsService.loadJobs({
        orderBy: this.job_list_table_order_by,
        orderDirection: this.job_list_table_order_direction,
        limit: this.job_list_table_limit,
        page: this.job_list_table_current_page,
        Client__c: this.Client__c,
        AssignedSurveyor__c: this.AssignedSurveyor__c,
        Job_Status__c: this.Job_Status__c
    }).then(data=>{

      this.job_list_table_rows = data['jobs'];
      this.surveyors = data["users"];
      this.clients = data["clients"];
      this.job_list_table_limit = data['limit'];
      this.job_list_table_count = data['count'];
      this.job_list_table_current_page = data['page'];

    })
  }
  
  /////////////////////////////////////////
  // JOBLISTTABLE TABLE ABOVE
  /////////////////////////////////////////
  

 
}

`

////// DEBUG
console.log("Locating end of constructor")
let new_ts = insertAfterImports(insersion,original_ts)
console.log(new_ts);