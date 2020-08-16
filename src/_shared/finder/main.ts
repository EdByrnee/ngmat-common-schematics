import { insertAfterImports} from './functions/insert_after_imports';

export enum  GivenPoint {
    TS_END_OF_CONSTRUCTOR,
    TS_END_OF_VARS,
    END_OF_OBJECT,
    END_OF_IMPORTS,
    END_OF_CSS,
    END_OF_HTML
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
            return insertAfterImports(insersion.insert,orginal);
        case GivenPoint.END_OF_OBJECT:
            return insertAfterImports(insersion.insert,orginal);
        case GivenPoint.END_OF_IMPORTS:
            return insertAfterImports(insersion.insert,orginal);
    }
}


export function insertAtGivenPoints(original:any, insersions:insertAtGivenPointInterface[]){
    for (let ins of insersions){
        original = insertAtGivenPoint(ins,original);
    }
    return original;
}