

# Tfg-common-schematics

1. Install the package into your angular-cli project
2. Run any of the following:
    - schematics tfg-common-schematics:tfgdatatable --dry-run=false --path=output/accounts/accounts-list --name=AccountsList --columns=account_name*n,account_type_name*n,count*n
    - schematics tfg-common-schematics:tfgdialog

## tfgpage
Provide the column names and create a data table.
#### Example

    schematics tfg-common-schematics:tfgpage --dry-run=false --path=output/accounts/accounts-list 
    
#### Page Component
Creates a page which:
- is automatically named componentname-page
- extends the app-page base component from which all pages inherit
- injects route, route, app-page etc. deps
- set up the html for loading, error, content and page header
- onPageLoad() function for init page data load


## tfgdatatable
Provide the column names and create a data table.
#### Example

    schematics tfg-common-schematics:tfgdatatable --dry-run=false --path=output/accounts/accounts-list --name=AccountsList --columns=account_name*n,account_type_name*n,count*n

#### Displayed Columns
Provide a list of column names, along with if you wish to enable sorting. By default this column will show the property of this name on the element.

    --columns=account_name*y,account_type_name*y,count*y

This will create the cell below *Account Name*

    <ng-container matColumnDef="account_name">
      <th mat-header-cell *matHeaderCellDef  mat-sort-header>Account Name</th>
      <td mat-cell *matCellDef="let element">
        <span class='tfg-table-td'>
          {{ element.account_name }} 
        </span>
      </td>
    </ng-container>

#### Column sorting
When providing the column names like above, you can enable sorting by providing column_name\*enable_sorting e.g. *account_name\*y*

A sorting function (shown below) is provided:

    
    sortAccountsListTableData(sort:any){
        this.accounts_list_sort_by = sort.active;
        this.accounts_list_sort_direction = sort.direction;
        this.loadAccountsListTableData();
    }
   This will use the column name e.g. *matColumnDef="account_name"* to sort the data by on the request e.g. ?sortBy=account_name. If you require a more specialist case then you must configure this manually.

#### Load Data
Data is loaded into the table using the function provided below. You can add this to your initPageLoad() to require the table data to have been loaded before displaying your page.

Best used when passing a query into a tfgLoadData() function, which will remove any null or undefined values, (e.g. sortBy, sortDirection when first load).

    // Load table data using the function below, 
    // List this in your initPageLoad() function to load data when the page first loads
    
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
	    
    })
  


#### Query parameter
When updating the filters on a table e.g. orderBy, we would ideally like to update the query parameters, as this allows for the page state to be saved/shared.

When a filter component is changed, this updates the query parameters.

    Component state change => Query param update => Update 



## Publish an update

1. Update package version 0.0.4 -> 0.0.5
    - npm version patch
2. Run the following to complie
    - npm run build
2. Run the following to publish changes
    - npm publish