export class Task {
  constructor(
    public id: string, 
    public title: string,
    public description: string, 
    public priority: number, 
    public isCompleted: boolean, 
    public dueDate: Date, 
    public projectId: string 
  ) {}

  static fromJSON(json: TaskJSON): Task {
    return new Task(
      json.id,
      json.title,
      json.description,
      json.priority,
      json.isCompleted,
      new Date(json.dueDate),
      json.projectId
    );
  }

  toJSON(): TaskJSON {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      priority: this.priority,
      isCompleted: this.isCompleted,
      dueDate: this.dueDate.toISOString(),
      projectId: this.projectId,
    };
  }
}

export type TaskJSON = {
  id: string;
  title: string;
  description: string;
  priority: number;
  isCompleted: boolean;
  dueDate: string;
  projectId: string;
};
