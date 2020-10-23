export declare enum GivenPoint {
    TS_END_OF_CONSTRUCTOR = 0,
    TS_END_OF_VARS = 1,
    END_OF_OBJECT = 2,
    END_OF_IMPORTS = 3,
    END_OF_CSS = 4,
    END_OF_HTML = 5,
    INSIDE_CONSTRUCTOR = 6,
    AFTER_PROVIDERS = 7
}
export interface insertAtGivenPointInterface {
    at: GivenPoint;
    insert: string;
}
export declare function insertAtGivenPoint(insersion: insertAtGivenPointInterface, orginal: string): string;
export declare function insertAtGivenPoints(original: any, insersions: insertAtGivenPointInterface[]): any;
