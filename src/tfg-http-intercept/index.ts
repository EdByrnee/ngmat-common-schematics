import { Rule, SchematicContext, Tree, apply, mergeWith, template, url } from '@angular-devkit/schematics';

// Contains helper functions like dasherize classerize etc...
import { strings } from "@angular-devkit/core";


import { Schema } from './schema.d';
import { GivenPoint, insertAtGivenPoints } from '../_shared/finder/main';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function main(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    
      const sourceTemplates = url("./files");

      // Create the insersions
      let NEW_PROVIDER = `{ provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }`
      let NEW_IMPORT = `import { HttpConfigInterceptor } from './http-intercept.service';`
      let TS_PATH = "/app/app.module.ts";
      let ORIGINAL_TS = tree.read(TS_PATH);



      // Configure the insersions
      let ts_insersions = [
        {
          insert: NEW_PROVIDER,
          at: GivenPoint.END_OF_IMPORTS
        },
        {
          insert: NEW_IMPORT,
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