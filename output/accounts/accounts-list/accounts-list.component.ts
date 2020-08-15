

    /////////////////////////////////////////
    // ACCOUNTSLIST TABLE BELOW
    /////////////////////////////////////////
    
    accounts_list_table_rows:any = [];
    accounts_list_table_limit: number = 15;
    accounts_list_table_count: number = 0;
    accounts_list_table_current_page: number = 0;
    displayedColumns: string[] = ["account_name","account_type_name","count"];
    accounts_list_data : any[] = [];
    
    
    sortAccountsListTableData(sort:any){
        this.accounts_list_sort_by = sort.active;
        this.accounts_list_sort_direction = sort.direction;
        this.loadAccountsListTableData()
    }
    
    changePageAccountsList($event){
        this.table_current_page_var_name = $event.pageIndex + 1;
        this.table_limit_var_nam = $event.pageSize;
        this.router.navigate(
          [], 
          {
            relativeTo: this.route,
            queryParams: { page}: this.accounts_list_table_current_page, limit: accounts_list_table_limit },
            queryParamsHandling: "merge"
          });
    }
  
    updateFiltersFromQueryParams(){
      let queryParams = this.route.snapshot.queryParams;
      if (queryParams["page"]) this.accounts_list_table_current_page = queryParams["page"];
      if (queryParams["limit"]) this.accounts_list_table_limit = queryParams["limit"];
    }


    loadAccountsListTableData(){
      this.dataService.loadDemo({
          sortBy: this.accounts_list_sort_by,
          sortDirection: this.accounts_list_sort_direction,
          limit: this.accounts_list_table_limit,
          page: this.accounts_list_table_current_page
      }).then(data=>{
  
        this.accounts_list_table_rows = data['data'];
        this.accounts_list_table_limit = data['limit'];
        this.accounts_list_table_count = data['count'];
        this.accounts_list_table_current_page = data['page'];
  
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

