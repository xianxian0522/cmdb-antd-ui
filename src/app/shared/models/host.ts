export interface Host {
  id?: number;
  hostInnerip: string;
  hostOuterip?: string;
  assertId?: string;
  sn?: string;
  comment?: string;
  state: string;
  hostName: string;
  osType?: string;
  osName?: string;
  osVersion?: string;
  osBit?: string;
  mem?: number;
  disk?: number;
  mac?: string;
  outerMac?: string;
  sshUser?: string;
  sshPort?: number;
  createdAt?: string;
  updatedAt?: string;
}
