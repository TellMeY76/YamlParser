export interface Corp {
    id: string;
    name: string;
    taxType: string;
    analyzerDate: string;
}

export interface CorpAnalyzerData {
    corpID: string;
    analyzerShowID: string;
    title: string;
    value: string;
    type: number;
    permission: number;
}

export interface CorpFld {
    name: string;
}

export interface KeyVal {
    [key: string]: FormFld;
}

interface FormFld {
    validator: any;
}
