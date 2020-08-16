///////////////////////////////////////////////////////////////////////////////////
//                                  IMPORTS                                      //
///////////////////////////////////////////////////////////////////////////////////
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SchematicsException } from '@angular-devkit/schematics';
import { getFormFieldHtml } from './functions/get_form_field_html';
import { Schema } from './schema';
import { insertAtGivenPointInterface, GivenPoint, insertAtGivenPoints } from '../_shared/finder/main';
//import { type } from 'os';
//import { classify, camelize } from '@angular-devkit/core/src/utils/strings';







///////////////////////////////////////////////////////////////////////////////////
//                                  MAIN                                         //
///////////////////////////////////////////////////////////////////////////////////

export function main(_options: Schema): Rule {
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

    // Break up the properties of each field
    let fields:any = getUserOptionsObject(_options.fields);


    // SET UP THE VARIABLES
    let original_html                    = html.toString("utf-8");
    let original_css                     = css.toString("utf-8");
    let original_ts                      = ts.toString("utf-8");

    let html_insersions = makeHtml(_options.form_name, fields);
    let css_insersions = makeCSS();
    let ts_insersions = makeTypescript(_options.form_name, fields);

    // Make the code
    let final_html = insertAtGivenPoints(original_html,html_insersions);
    let final_css = insertAtGivenPoints(original_css,css_insersions);
    let final_ts = insertAtGivenPoints(original_ts,ts_insersions);


    // COMMIT THE CHANGES
    tree.overwrite(html_path, final_html);
    tree.overwrite(css_path, final_css);
    tree.overwrite(ts_path, final_ts);

    return tree;

  };
}


///////////////////////////////////////////////////////////////////////////////////
//                                  MAKE CSS                                     //
///////////////////////////////////////////////////////////////////////////////////
function makeCSS(): insertAtGivenPointInterface[]{
  let css = 
`
  .vertical-form{
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

function makeTypescript(form_name:string, fields:any[]): insertAtGivenPointInterface[]{

  // Make the formGroup variable
  let form_group_var = form_name + ':FormGroup;'

  // Init the form group in the constructor
  let form_ts = '';
  for (let f of fields){
    form_ts = form_ts + `"${ f.field_name}" : [null]`
  }
  let constructor_ts = `
    this.${ form_name } = new FormGroup({
        ${ form_ts }
    })
  `;


  return [
    {
      insert: constructor_ts,
      at: GivenPoint.TS_END_OF_CONSTRUCTOR
    },
    {
      insert: form_group_var,
      at: GivenPoint.TS_END_OF_VARS
    }
  ]

}



////////////////////////////////////////////////////////////////////
//                        MAKE HTML                               //
////////////////////////////////////////////////////////////////////

function makeHtml(form_name:string, fields: any[]): insertAtGivenPointInterface[]{
  let form_html = '';

  for (let f of fields){
    form_html = form_html + getFormFieldHtml(f)
  }

  let h = `
    <form [formGroup]='${form_name}'>

    ${ form_html }

    </form>
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



function removeFinalChar(ts:any ,char: any){
  let final_occur = ts.lastIndexOf(char);

  ts = ts.substr(0,final_occur) + ts.substring(final_occur + 1);

  return ts;
}

function afterSlash(stringVariable:string){
  return  stringVariable.substring(stringVariable.lastIndexOf('/'));
}


function getUserOptionsObject(fields: string){
  // Break up into the indiviual fields
  let array_of_fields = fields.split(",")
  return array_of_fields.map(f=>{
    let object_and_keys = f.split('*');
    var obj:any = {};
    for (let obj_k of object_and_keys){

      let key  = obj_k.split(':')[0];
      let value = obj_k.split(':')[1]

      obj[key] = value
    }

    return obj;
  })
}


