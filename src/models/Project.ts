export class Project {
  constructor(
    public id: string, 
    public name: string,
    public budget: number, 
    public isArchived: boolean, 
    public createdAt: Date 
  ) {}

  static fromJSON(json: ProjectJSON): Project {
    return new Project(
      json.id,
      json.name,
      json.budget,
      json.isArchived,
      new Date(json.createdAt)
    );
  }

  toJSON(): ProjectJSON {
    return {
      id: this.id,
      name: this.name,
      budget: this.budget,
      isArchived: this.isArchived,
      createdAt: this.createdAt.toISOString(),
    };
  }
}

export type ProjectJSON = {
  id: string;
  name: string;
  budget: number;
  isArchived: boolean;
  createdAt: string;
};
