import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SchematicsException } from '@angular-devkit/schematics';

// Contains helper functions like dasherize classerize etc...


// Test it with these
// demo/demo-table-page
// Demo
// job_name*y,client_name*y,policy_holder_name*n,job_postcode*n,job_address*n,JobStatusId*y,AssignedSurveyorId*y
// paginator=true

// schematics .:tfgdatatable --dry-run=false --path=demo/demo-table-page --name=Demo --columns=job_name*y,client_name*y,policy_holder_name*n,job_postcode*n,job_address*n,JobStatusId*y,AssignedSurveyorId*y --paginator=true


// schematics .:tfg-data-table --dry-run=false --path=output/test-page/page-list-page --name=AccountsList --columns=account_name*n,account_type_name*n,count*n


import { Schema } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function tfgdatatable(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    if(_options.paginator){ var paginator = true }
    else{ var paginator = false }
 

    // LOAD THE HTML
    let html_path =  _options.path + afterSlash(_options.path) + ".component.html";
    let html:any = tree.read(html_path);

    // LOAD THE CSS
    let css_path = _options.path + afterSlash(_options.path) + ".component.scss";
    let css:any = tree.read(css_path);

    // LOAD THE TYPESCRIPT
    let ts_path = _options.path + afterSlash(_options.path) + ".component.ts";
    let ts:any = tree.read(ts_path);


    // VALIDATE ANY ERRORS
    if (!html) throw new SchematicsException(`file does not exist at ` + html_path);
    if (!ts) throw new SchematicsException(`file does not exist at ` + ts_path);
    if (!css) throw new SchematicsException(`file does not exist at ` + css);


    // SET UP THE VARIABLES
    html                    = html.toString("utf-8");
    css                     = css.toString("utf-8");
    ts                      = ts.toString("utf-8");
    //let name_of_table       = _options.name;
    let column_objects      = makeColumnStringIntoColumnObject(_options.columns);
    let column_names = column_objects.map((col:any)=>{ return col.name });


    // Remove last curley brace
    ts = removeFinalChar(ts, "}");

    let table_html = html + generateTableHtml(_options.name, column_objects, paginator );
    let table_ts = ts + makeTypescript(_options.name, column_names);
    let table_css = css + makeCSS();


    console.log("Outputting the changes...");
    // COMMIT THE CHANGES
    console.log('Outputting to path ' + html_path);
    tree.overwrite(html_path, table_html);
    tree.overwrite(css_path, table_css);
    tree.overwrite(ts_path, table_ts);

    return tree;

  };
}

function removeFinalChar(ts:any ,char: any){
  let final_occur = ts.lastIndexOf(char);

  ts = ts.substr(0,final_occur) + ts.substring(final_occur + 1);

  return ts;
}

function afterSlash(stringVariable:string){
  return  stringVariable.substring(stringVariable.lastIndexOf('/'));
}


function makeColumnStringIntoColumnObject(column_string:string){

  let columns:any = column_string.split(",");    
  
  columns =  columns.map((c:any)=>{

    c = c.split("*");

    let co:any = {
      name: c[0],
    }

    if (c[1] === "y") co['sort'] = true;
    if (c[1] === "n") co['sort'] = false;

    return co;

  })

  return columns;


}

function undoSplice(string_array:string[]){

  let str = "";
  string_array.forEach(sa=>{
    str = str + sa;
  })

  return str;

}



function makeCSS(){
  let css = 
`

  table{
    width: 100%;
  }


`
  return css;
}


function ClassToUnderscore(s:string) {
  return s.split(/(?=[A-Z])/).join('_').toLowerCase();
}


function makeTypescript(name:any, column_names: string[]){

    let change_page_function_name = "changePage" + name;
    let order_data_function_name = "order" + name + "TableData";
    let table_data_var_name = ClassToUnderscore(name) + "_rows";
    let table_limit_var_name = ClassToUnderscore(name) + "_limit";
    let table_count_var_name = ClassToUnderscore(name) + '_count';
    let table_current_page_var_name = ClassToUnderscore(name) + "_current_page";
    let order_by_var_name = ClassToUnderscore(name + "OrderBy");
    let order_direction_var_name = ClassToUnderscore(name + "OrderDirection");
    let loadDataFunctionName = "load" + name + "TableData";


  column_names = column_names.map(cn=>{

    return '"' + cn + '"';

  })


let ts = `

    /////////////////////////////////////////
    // ${name.toUpperCase()} TABLE BELOW
    /////////////////////////////////////////
    
    ${table_data_var_name}:any = [];
    ${table_limit_var_name}: number = 15;
    ${table_count_var_name}: number = 0;
    ${table_current_page_var_name}: number = 1;
    displayedColumns: string[] = [${column_names.join()}];
    
    ${ order_by_var_name }:any = null;
    ${ order_direction_var_name }:any = null;
    
    
    ${order_data_function_name}(sort:any){
        this.${ order_by_var_name } = sort.active;
        this.${ order_direction_var_name } = sort.direction;
        this.${ loadDataFunctionName }()
    }
    
    ${ change_page_function_name }($event){
        this.${table_current_page_var_name} = $event.pageIndex + 1;
        this.${table_limit_var_name} = $event.pageSize;
        this.router.navigate(
          [], 
          {
            relativeTo: this.route,
            queryParams: { page: this.${table_current_page_var_name}, limit: this.${ table_limit_var_name } },
            queryParamsHandling: "merge"
          });
    }
  
    updateFiltersFromQueryParams(){
      let queryParams = this.route.snapshot.queryParams;
      if (queryParams["page"]) this.${ table_current_page_var_name } = queryParams["page"];
      if (queryParams["limit"]) this.${ table_limit_var_name } = queryParams["limit"];
    }


  ${ loadDataFunctionName}(){
    this.dataService.loadDemo({
        orderBy: this.${ order_by_var_name },
        orderDirection: this.${ order_direction_var_name },
        limit: this.${table_limit_var_name},
        page: this.${table_current_page_var_name}
    }).then(data=>{

      this.${table_data_var_name} = data['data'];
      this.${table_limit_var_name} = data['limit'];
      this.${table_count_var_name} = data['count'];
      this.${table_current_page_var_name} = data['page'];

    })
  }
  
  /////////////////////////////////////////
  // ${name.toUpperCase()} TABLE ABOVE
  /////////////////////////////////////////
  

 
}

`;
return ts;

}




function generateTableHtml(name_of_table: string , columns:any[], paginator:boolean){

    let table_limit_var_name = ClassToUnderscore(name_of_table) + "_limit";
    let table_count_var_name = ClassToUnderscore(name_of_table) + '_count';
    let table_current_page_var_name = ClassToUnderscore(name_of_table) + "_current_page";
    let table_data_var_name = ClassToUnderscore(name_of_table) + "_rows";
    let order_data_function_name = "order" + name_of_table + "TableData";
    let change_page_function_name = "changePage" +  name_of_table;


  let paginator_html = "";
  if (paginator) paginator_html = `
  <mat-paginator (page)="` + change_page_function_name + `($event)"
  [pageIndex]="${table_current_page_var_name} -1"
  [length]="${table_count_var_name}"
  [pageSize]="${table_limit_var_name}"
  [pageSizeOptions]="[5, 10, 15, 20,25, 100]">
  </mat-paginator>`


  columns = columns.map((col:any) =>{
    return makeColumn(col.name,col.sort);
  })
  
  
  

let h = `
<!--- PUT THIS TABLE WHERE YOU WANT IN YOUR HTML !!! --->
<div class='${name_of_table}-table'>

  <table mat-table [dataSource]="${table_data_var_name}" class="mat-elevation-z8" matSort (matSortChange)="` + order_data_function_name + `($event)">

` + undoSplice(columns) + `  
    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;" ></tr>
  </table>
`
        + paginator_html +
        `

</div>
`;
    return h;


}



// function snakecase_to_titlecase(u:any){
//     return u.replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2")
// }

function toTitleCase(str:any) {
        return str.replace(/_/g, " ").replace(
            /\w\S*/g,
            function(txt:any) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }




function makeColumn(name:any, sort:any){


  // Add the sort to the header if true
  if (sort) sort = "mat-sort-header";
  else sort = "";

  let column_text = name;

    return `
    <!-- Position Column -->
    <ng-container matColumnDef="` + name + `">
      <th mat-header-cell *matHeaderCellDef ` + sort + ` mat-sort-header>` + toTitleCase(column_text) + `</th>
      <td mat-cell *matCellDef="let element">
        <span class='tfg-table-td'>
          {{ element.` + name + ` }} 
        </span>
      </td>
    </ng-container>

    `;
}



