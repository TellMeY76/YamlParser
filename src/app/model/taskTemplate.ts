export class TaskTemplate {
  id?: string;
  analyzerId?: string;
  treeId?: string;
  title: string;
  abstract?: string;
  description?: string;
  dateType: number;
  startDays?: number;
  endDays?: number;
  start?: string;
  end?: string;

  constructor() {
    this.dateType = 1;
  }
}
