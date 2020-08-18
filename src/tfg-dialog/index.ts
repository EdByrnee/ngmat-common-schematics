///////////////////////////////////////////////////////////////////////////////////
//                                  IMPORTS                                      //
///////////////////////////////////////////////////////////////////////////////////
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SchematicsException } from '@angular-devkit/schematics';
import { Schema } from './schema';
import { insertAtGivenPointInterface, GivenPoint, insertAtGivenPoints } from '../_shared/finder/main';
//import { type } from 'os';
import { classify, camelize } from '@angular-devkit/core/src/utils/strings';
import { underscore } from '@angular-devkit/core/src/utils/strings';
import { dasherize } from '@angular-devkit/core/src/utils/strings';


///////////////////////////////////////////////////////////////////////////////////
//                                  MAIN                                         //
///////////////////////////////////////////////////////////////////////////////////

export function main(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
 

    // LOAD THE FILES
    let original_html:string = loadHtmlAndValidate(tree,_options.path);
    let original_css:string = loadCssAndValidate(tree,_options.path);
    let original_ts:string = loadTsAndValidate(tree,_options.path);

    // Let's begin ...
    let html_insersions = makeHtml(_options.name);
    let css_insersions = makeCSS(_options.name);
    let ts_insersions = makeTypescript(_options.name);

    // Make the code
    let final_html = insertAtGivenPoints(original_html,html_insersions);
    let final_css = insertAtGivenPoints(original_css,css_insersions);
    let final_ts = insertAtGivenPoints(original_ts,ts_insersions);


    // COMMIT THE CHANGES
    console.log("Outputting the changes...");
    console.log('HTML is...');
    console.log(final_html);
    console.log('CSS is...');
    console.log(final_css);
    console.log('TS is...');
    console.log(final_ts);
    commitChanges(tree, _options.path, final_html, final_css, final_ts);

    console.log('Schematic has fished, returning to user');
    return tree;

  };
}


///////////////////////////////////////////////////////////////////////////////////
//                                  MAKE CSS                                     //
///////////////////////////////////////////////////////////////////////////////////
function makeCSS(dialog_name:string): insertAtGivenPointInterface[]{

  let dialog_content_css_class = dasherize(dialog_name) + '-dialog-content';
  let dialog_loading_css_class = dasherize(dialog_name) + '-dialog-loading';

  let css = 
`
  .${ dialog_loading_css_class }{
    display: flex;
    flex-direction: center;
  }
  .${ dialog_content_css_class }{
    display: flex;
    flex-direction: column;
  }

`
  return [
    {
      insert: css,
      at: GivenPoint.END_OF_CSS
    }
  ]
}


///////////////////////////////////////////////////////////////////////////////////
//                                  MAKE TYPESCRIPT                              //
///////////////////////////////////////////////////////////////////////////////////

function makeTypescript(dialog_name:string): insertAtGivenPointInterface[]{

  let dialog_visible_var = underscore(dialog_name) + '_dialog';
  let dialog_loading_var = underscore(dialog_name) + '_dialog_loading';
  let dialog_create_function_var = "create" + classify(dialog_name);
  let dialog_form_group_var = camelize(dialog_name) + 'FormGroup';

  let create_object_function = `
    ${ dialog_create_function_var }(){
      this.${ dialog_loading_var } = true;
      let data = this.${ dialog_form_group_var }.value;
      this.dataService.createObject(data).then(data=>{
        this.initPageLoad();
        this.messageService.open('Success creating new object', 'DISMISS', {duration: 3000});
        this.${ dialog_loading_var } = false;
      }).catch(err=>{
        console.log(err);
        this.messageService.open('There was an error creating the new object', 'DISMISS', {duration: 3000});
      })
    }
  `;


  return [
    {
      insert: dialog_visible_var + ':boolean = false;',
      at: GivenPoint.TS_END_OF_VARS
    },
    {
      insert: dialog_loading_var + ':boolean = false;',
      at: GivenPoint.TS_END_OF_VARS
    },
    {
      insert: create_object_function,
      at: GivenPoint.TS_END_OF_VARS
    }
  ]

}



////////////////////////////////////////////////////////////////////
//                        MAKE HTML                               //
////////////////////////////////////////////////////////////////////

function makeHtml(dialog_name:string): insertAtGivenPointInterface[]{


  let dialog_visible_var = underscore(dialog_name) + '_dialog';
  let dialog_loading_var = underscore(dialog_name) + '_dialog_loading';
  let dialog_content_css_class = dasherize(dialog_name) + '-dialog-content';
  let dialog_loading_css_class = dasherize(dialog_name) + '-dialog-loading';
  let dialog_create_function_var = "create" + classify(dialog_name);


  let h = `
  <div class="dialog-bg" *ngIf="${ dialog_visible_var }"></div>
  <p-dialog [title]="'Create Object'" [(visible)]="${ dialog_visible_var }">
    <div class='${ dialog_loading_css_class }' *ngIf='${ dialog_loading_var }'>
      <mat-progress-spinner [mode]="'indeterminate'">
      </mat-progres-spinner>
    </div>
    <div class='${ dialog_content_css_class }'>


      <button mat-raised-button color='primary' (click)='${ dialog_create_function_var }Create()'>
        Create Object
      </button>
    </div>
  </p-dialog>
  `;

  
  ;
  return [
    {
      insert: h,
      at: GivenPoint.END_OF_HTML
    }
  ]
}




///////////////////////////////////////////////////////////////////////////////////
//                            HELPER FUNCTIONS                                   //
///////////////////////////////////////////////////////////////////////////////////
function afterSlash(stringVariable:string){
  return  stringVariable.substring(stringVariable.lastIndexOf('/'));
}


// function getUserOptionsObject(fields: string){
//   // Break up into the indiviual fields
//   let array_of_fields = fields.split(",")
//   return array_of_fields.map(f=>{
//     let object_and_keys = f.split('*');
//     var obj:any = {};
//     for (let obj_k of object_and_keys){

//       let key  = obj_k.split(':')[0];
//       let value = obj_k.split(':')[1]

//       obj[key] = value
//     }

//     return obj;
//   })
// }


function loadHtmlAndValidate(tree:any, path:string){
  let html_path =  path + afterSlash(path) + ".component.html";
  //console.log(tree);
  let html = tree.read(html_path);
  if (!html) throw new SchematicsException(`file does not exist at ` + html_path);
  return html.toString("utf-8");
}

function loadCssAndValidate(tree:any, path:string){
  let css_path = path + afterSlash(path) + ".component.scss";
  let css = tree.read(css_path);
  if (!css) throw new SchematicsException(`file does not exist at ` + css_path);
  return css.toString("utf-8");
}

function loadTsAndValidate(tree:any, path:string){
  let ts_path = path + afterSlash(path) + ".component.ts";
  let ts = tree.read(ts_path);
  if (!ts) throw new SchematicsException(`file does not exist at ` + ts_path);
  return ts.toString("utf-8");
}

function commitChanges(tree:any, path: string, final_html:string, final_css:string, final_ts:string, ){
  let html_path =  path + afterSlash(path) + ".component.html";
  let css_path = path + afterSlash(path) + ".component.scss";
  let ts_path = path + afterSlash(path) + ".component.ts";
  console.log('Outputting to path ' + html_path);
  tree.overwrite(html_path, final_html);
  tree.overwrite(css_path, final_css);
  tree.overwrite(ts_path, final_ts);
}


