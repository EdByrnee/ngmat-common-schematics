import { Rule, SchematicContext, Tree, apply, mergeWith, template, url } from '@angular-devkit/schematics';

// Contains helper functions like dasherize classerize etc...
import { strings } from "@angular-devkit/core";


import { Schema } from './schema.d';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function main(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    
      const sourceTemplates = url("./files");
      
      let name: any = _options.path.split("/").pop();
      _options.name = name;

      const createdTemplates = apply(sourceTemplates,[
        template({
          ..._options,
          ...strings
        })
      ])

      // Add the version check service file

      // Provide in app.module.ts

      // Add to the ngOnInit of the app.component

      console.log("Finishing merging files, please ensure you have added version.json to the /dist folder");
      return mergeWith(createdTemplates)(tree, _context);

      

  };
}