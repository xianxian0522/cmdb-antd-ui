export interface Playbook {
  id?: number;
  name: string;
  displayName?: string;
  content: string;
  comment?: string;
  appId?: number;
  appName?: string;
  replicaSetId?: number;
  replicaSetName?: string;
  instanceId?: number;
  instanceName?: string;
  createdAt?: string;
  updatedAt?: string;
}
