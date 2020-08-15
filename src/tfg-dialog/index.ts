import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SchematicsException } from '@angular-devkit/schematics';

// Contains helper functions like dasherize classerize etc...


// Test it with these
// demo/demo-table-page
// Demo
// job_name*y,client_name*y,policy_holder_name*n,job_postcode*n,job_address*n,JobStatusId*y,AssignedSurveyorId*y
// paginator=true

// schematics .:tfgdatatable --dry-run=false --path=demo/demo-table-page --name=Demo --columns=job_name*y,client_name*y,policy_holder_name*n,job_postcode*n,job_address*n,JobStatusId*y,AssignedSurveyorId*y --paginator=true


// schematics .:tfgdatatable --dry-run=false --path=output/accounts/accounts-list --name=AccountsList --columns=account_name*n,account_type_name*n,count*n


import { Schema } from './schema.d';
import { classify, camelize } from '@angular-devkit/core/src/utils/strings';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function tfgdialog(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
 

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


    // Remove last curley brace
    ts = removeFinalChar(ts, "}");

    let table_html = html + generateTableHtml(_options.name);
    let table_ts = ts + makeTypescript(_options.name);
    let table_css = css + makeCSS();


    // COMMIT THE CHANGES
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


// function makeColumnStringIntoColumnObject(column_string:string){

//   let columns:any = column_string.split(",");    
  
//   columns =  columns.map((c:any)=>{

//     c = c.split("*");

//     let co:any = {
//       name: c[0],
//     }

//     if (c[1] === "y") co['sort'] = true;
//     if (c[1] === "n") co['sort'] = false;

//     return co;

//   })

//   return columns;


// }

// function undoSplice(string_array:string[]){

//   let str = "";
//   string_array.forEach(sa=>{
//     str = str + sa;
//   })

//   return str;

// }


// Dialog styling should be in the global stylesheet
function makeCSS(){
  let css = 
`

`
  return css;
}


function ClassToUnderscore(s:string) {
  return s.split(/(?=[A-Z])/).join('_').toLowerCase();
}


function makeTypescript(name:any){

  let dialog_visible_var_name = ClassToUnderscore(name);
  let dialog_loading_var_name = ClassToUnderscore(name) + "_loading";
  let dialog_action_function_name = classify(name);

let ts = `

// BELOW IS ${ name.toUpperCase() } DIALOG

  ${dialog_visible_var_name}: boolean = false;
  ${dialog_loading_var_name}: boolean = false;

  ${ camelize(dialog_action_function_name)}(){
    this.${dialog_loading_var_name} = true;
    this.data_service_here.createThing().then(success=>{
      this.initPageLoad();
      this.${dialog_loading_var_name} = false;
    }).catch(err=>{
      this.handleHttpError(err,false);
      this.${dialog_loading_var_name} = false;
    })
  }
  // ABOVE IS ${ name.toUpperCase() } DIALOG
  

}
`
return ts;

}




function generateTableHtml(name_of_table: string){

  let dialog_visible_var_name = ClassToUnderscore(name_of_table) + "_dialog_visible";
  let dialog_loading_var_name = ClassToUnderscore(name_of_table) + "_dialog_loading";

  let dialog_action_function_name = camelize(name_of_table);

  let html = `
  <!--- BELOW IS ${ name_of_table.toUpperCase() } DIALOG -->
  <div class="dialog-bg" *ngIf="${dialog_visible_var_name}" (click)="${dialog_visible_var_name} = false"></div>
  <p-dialog header="Dialog" [(visible)]="${dialog_visible_var_name}">
    <div class='dialog-content' *ngIf='${ dialog_loading_var_name} '>
  
    <h4>Dialog Title</h4>

  
      <button color="warn" mat-button (click)="${dialog_visible_var_name } = false">
        CANCEL
      </button>
      <button mat-button color='primary' (click)="${dialog_action_function_name}()">
        CREATE
      </button>

    </div>
    <div class='dialog-content-loading' *ngIf='${ dialog_loading_var_name} '>
  
      Loading. Please wait.
  
    </div>
  </p-dialog>
  <!--- ABOVE IS ${ name_of_table.toUpperCase() } DIALOG -->
  `

  return html;
}




