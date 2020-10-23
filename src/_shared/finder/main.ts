import { insertAfterImports} from './functions/insert_after_imports';
import { insertAtEndOfCss } from './functions/insert_end_of_css';
import { insertAtEndOfHtml } from './functions/insert_end_of_html';
import { insertInsideConstructor } from './functions/inside_constructor';
import { insertEndOfVars } from './functions/insert_end_of_vars';
import { insertAfterProviders } from './functions/insert_after_providers';

export enum  GivenPoint {
    TS_END_OF_CONSTRUCTOR,
    TS_END_OF_VARS,
    END_OF_OBJECT,
    END_OF_IMPORTS,
    END_OF_CSS,
    END_OF_HTML,
    INSIDE_CONSTRUCTOR,
    AFTER_PROVIDERS
}

export interface insertAtGivenPointInterface{
    at: GivenPoint,
    insert: string;
}

export function insertAtGivenPoint(insersion: insertAtGivenPointInterface, orginal:string){
    switch(insersion.at){
        case GivenPoint.TS_END_OF_CONSTRUCTOR:
            return insertAfterImports(insersion.insert,orginal);
        case GivenPoint.TS_END_OF_VARS:
            return insertEndOfVars(insersion.insert,orginal);
        case GivenPoint.END_OF_OBJECT:
            return insertAfterImports(insersion.insert,orginal);
        case GivenPoint.END_OF_IMPORTS:
            return insertAfterImports(insersion.insert,orginal);
        case GivenPoint.END_OF_CSS:
            return insertAtEndOfCss(insersion.insert,orginal);
        case GivenPoint.END_OF_HTML:
            return insertAtEndOfHtml(insersion.insert,orginal);
        case GivenPoint.INSIDE_CONSTRUCTOR:
            return insertInsideConstructor(insersion.insert,orginal);
        case GivenPoint.AFTER_PROVIDERS:
                return insertAfterProviders(insersion.insert,orginal);
    }
}


export function insertAtGivenPoints(original:any, insersions:insertAtGivenPointInterface[]){
    for (let ins of insersions){
        original = insertAtGivenPoint(ins,original);
    }
    return original;
}