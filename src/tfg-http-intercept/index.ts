import { Rule, SchematicContext, Tree, apply, mergeWith, template, url } from '@angular-devkit/schematics';

// Contains helper functions like dasherize classerize etc...
import { strings } from "@angular-devkit/core";


import { Schema } from './schema.d';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function main(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    
      const sourceTemplates = url("./files");
      
      const createdTemplates = apply(sourceTemplates,[
        template({
          ..._options,
          ...strings
        })
      ])

      return mergeWith(createdTemplates)(tree, _context)

  };
}