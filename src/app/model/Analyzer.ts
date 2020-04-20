import { TaskTemplate } from './taskTemplate';
import { taxTypes } from '../config/taxType';

export class AnalyzerInput {
  id?: string;
  title: string;
  value: string;
  symbol?: any;
  inputType?: number;
  connection?: boolean;
  label?: string;
}

export class AnalyzerName {
  name: string;
  id: string;
}

export class AnalyzerSelect {
  id?: string;
  label?: string;
  inputType?: number;
  title: string;
}

export class TableItem {
  input: AnalyzerInput;
}

export class Tree {
  id?: string;
  name?: string;
  title?: string;
  cond: string | TableItem[];
  description?: string;
  summary?: string;
  advice?: string;
  status?: number;
  knowledgeIds?: string[];
  taskTemplates?: TaskTemplate[];
  taskTemplateIds?: string;
  showAllAd?: boolean;
  showTask?: boolean;
  showAllTask?: boolean;
}

export class Analyzer {
  id?: string;
  name: string;
  type: string;
  online: boolean;
  taxType: number;
  applyOn: string | TableItem[];
  tree: Tree[];
  analyzerInputs: AnalyzerInput[] | AnalyzerSelect[];
  analyzerShows?: AnalyzerShow[];

  constructor() {
    this.name = '';
    this.type = '--';
    this.online = false;
    this.taxType = taxTypes.all;
    this.applyOn = [{ input: { title: '', value: '' } }];
    this.tree = [
      {
        status: 0,
        cond: [{ input: { title: '', symbol: '', value: '' } }],
        taskTemplates: [],
      }
    ];
    this.analyzerInputs = [];
    this.analyzerShows = [];
  }

}

export interface AnalyzerShow {
  id: string,
  title: string
}
