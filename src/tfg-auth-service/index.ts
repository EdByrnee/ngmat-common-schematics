import { Rule, SchematicContext, Tree, apply, mergeWith, template, url, SchematicsException } from '@angular-devkit/schematics';

// Contains helper functions like dasherize classerize etc...
import { strings } from "@angular-devkit/core";


import { Schema } from './schema';
import { GivenPoint, insertAtGivenPoints } from '../_shared/finder/main';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function main(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    
      const sourceTemplates = url("./files");

      // Create the insersions
      let NEW_PROVIDER = `    AuthService,`
      let NEW_IMPORT = `import { AuthService } from './auth.service';`
      let TS_PATH = "/src/app/app.module.ts";



      let ORIGINAL_TS:any = tree.read(TS_PATH);
      if (!ORIGINAL_TS) throw new SchematicsException(`file does not exist at ` + TS_PATH);
      ORIGINAL_TS = ORIGINAL_TS.toString("utf-8");;


      // Configure the insersions
      let ts_insersions = [
        {
          insert: NEW_IMPORT,
          at: GivenPoint.END_OF_IMPORTS
        },
        {
          insert: NEW_PROVIDER,
          at: GivenPoint.AFTER_PROVIDERS
        }
      ]


      // Insert the insersions
      let final_ts = insertAtGivenPoints(ORIGINAL_TS,ts_insersions)

      tree.overwrite(TS_PATH, final_ts);
      
      const createdTemplates = apply(sourceTemplates,[
        template({
          ..._options,
          ...strings
        })
      ])

      return mergeWith(createdTemplates)(tree, _context)

  };
}