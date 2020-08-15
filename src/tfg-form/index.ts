import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SchematicsException } from '@angular-devkit/schematics';

// Contains helper functions like dasherize classerize etc...
import { Schema } from './schema';
import { type } from 'os';
//import { classify, camelize } from '@angular-devkit/core/src/utils/strings';

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

    // Tranform the input
    var fields = _options.fields.split(",")


    // SET UP THE VARIABLES
    html                    = html.toString("utf-8");
    css                     = css.toString("utf-8");
    ts                      = ts.toString("utf-8");

    // WHERE TO INSERT THE CODE
    // Remove last curley brace
    ts = removeFinalChar(ts, "}");

    // Make the code
    let table_html = html + makeHtml(fields);
    let table_ts = ts + makeTypescript(fields);
    let table_css = css + makeCSS();


    // COMMIT THE CHANGES
    tree.overwrite(html_path, table_html);
    tree.overwrite(css_path, table_css);
    tree.overwrite(ts_path, table_ts);

    return tree;

  };
}


////////////////////////////////////////////////////////////////////
//                        MAKE CSS                                //
////////////////////////////////////////////////////////////////////

// Dialog styling should be in the global stylesheet
function makeCSS(){
  let css = 
`
  .vertical-form{
    display: flex;
    flex-direction: column;
  }

`
  return css;
}


////////////////////////////////////////////////////////////////////
//                        MAKE TS                                 //
////////////////////////////////////////////////////////////////////

function makeTypescript(name:any){

  let variable_1 = '';

  variable_1 = variable_1 + name + '}';

  let ts = '';
  return ts;

}



////////////////////////////////////////////////////////////////////
//                        MAKE HTML                               //
////////////////////////////////////////////////////////////////////

function makeHtml(fields: any[]){
  let form_html = '';

  for (let f of fields){
    form_html = form_html + `
      <mat-form-field>
        <input matInput type='${ getFormType }' >'        
      </mat-form-field>
    `
  }

  let ts = `
    <form [formGroup]=''>



    </form>
  `;

  
  ;
  return ts;
}




////////////////////////////////////////////////////////////////////
//                        HELPER FUNCTIONS                        //
////////////////////////////////////////////////////////////////////

// function ClassToUnderscore(s:string) {
//   return s.split(/(?=[A-Z])/).join('_').toLowerCase();
// }

function getFormType(name:string, type:string){
  switch(type){
    case 'select':
      return `
        <mat-select formControlName='${ name } '>
          <mat-option *ngFor='let o of object' [value]='o.id'>
            {{ o.name}}
          <mat-option>
        <mat-selection>
        `
    default:
      return type;
  }
}

function removeFinalChar(ts:any ,char: any){
  let final_occur = ts.lastIndexOf(char);

  ts = ts.substr(0,final_occur) + ts.substring(final_occur + 1);

  return ts;
}

function afterSlash(stringVariable:string){
  return  stringVariable.substring(stringVariable.lastIndexOf('/'));
}







