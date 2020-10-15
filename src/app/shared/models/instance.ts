export interface Instance {
  id?: number;
  name: string;
  replicaSetId: number;
  replicaSetName: string;
  hostId: number;
  hostName: string;
  appId: number;
  appName: string;
  type?: string;
  workDir?: string;
  metricUrl?: string;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}
