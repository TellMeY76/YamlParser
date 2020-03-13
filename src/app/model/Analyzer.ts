import {TaskTemplate} from "./taskTemplate";

export class AnalyzerInput {
  id?: string;
  title: string;
  value: string;
  symbol?: any;
  inputType?: number;
  connection?: boolean;
  label?: string;
}

export class TableItem {
  input: AnalyzerInput;
}

export class Tree {
  name?: string;
  title?: string;
  condition: string | TableItem[];
  description?: string;
  summary?: string;
  advice?: string;
  status?: number;
  condConns?: boolean[];
  knowledgeIds?: string[];
  taskTemplates?: TaskTemplate[];
}

export class Analyzer {
  name: string;
  type: string;
  online: boolean;
  runMonth: string[];
  applyOn: string | TableItem[];
  tree: Tree[];

  constructor() {
    this.name = '';
    this.type = '--';
    this.online = false;
    this.runMonth = [];
    this.applyOn = [{input: {title: '', value: ''}}];
    this.tree = [
      {
        status: 0,
        condConns: [],
        condition: [{input: {title: '', symbol: '', value: ''}}],
        taskTemplates: [],
      }
    ];
  }
}
