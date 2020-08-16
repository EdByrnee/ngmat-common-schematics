///////////////////////////////////////////////////////////////////////////////////
//                                  IMPORTS                                      //
///////////////////////////////////////////////////////////////////////////////////
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SchematicsException } from '@angular-devkit/schematics';
import { getFormFieldHtml } from './functions/get_form_field_html';
import { Schema } from './schema';
import { insertAtGivenPointInterface, GivenPoint, insertAtGivenPoints } from '../_shared/finder/main';
// import { type } from 'os';
// import { classify, camelize } from '@angular-devkit/core/src/utils/strings';



///////////////////////////////////////////////////////////////////////////////////
//                                  MAIN                                         //
///////////////////////////////////////////////////////////////////////////////////

export function main(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
 

    // LOAD THE FILES
    let original_html:string = loadHtmlAndValidate(tree,_options.path);
    let original_css:string = loadCssAndValidate(tree,_options.path);
    let original_ts:string = loadTsAndValidate(tree,_options.path);

    // PARSE ANYTHING EXTRA FROM THE _options
    // Fields is used for an array of options e.g. when you are creating an array of form fields 
    // We obviously can't get an array input using the schematics cli
    let fields:any = getUserOptionsObject(_options.fields);


    // Let's begin ...
    let html_insersions = makeHtml(_options.form_name, fields);
    let css_insersions = makeCSS();
    let ts_insersions = makeTypescript(_options.form_name, fields);

    // Make the code
    let final_html = insertAtGivenPoints(original_html,html_insersions);
    let final_css = insertAtGivenPoints(original_css,css_insersions);
    let final_ts = insertAtGivenPoints(original_ts,ts_insersions);


    // COMMIT THE CHANGES
    commitChanges(tree, _options.path, final_html, final_css, final_ts);

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


function loadHtmlAndValidate(tree:any, path:string){
  let html_path =  path + afterSlash(path) + ".component.html";
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
  tree.overwrite(html_path, final_html);
  tree.overwrite(css_path, final_css);
  tree.overwrite(ts_path, final_ts);
}


