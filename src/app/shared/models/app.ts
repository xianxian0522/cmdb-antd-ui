export interface App {
  id: number;
  name?: string;
  cnName?: string;
  programmingLanguage?: string;
  comment?: string;
  level?: string;
  repository?: string;
  createdAt?: string;
  updatedAt?: string;
  ownerId?: number;
  reporters?: number[];
}
