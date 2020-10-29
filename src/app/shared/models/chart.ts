export interface Chart {
  id?: number;
  appId?: number;
  name?: string;
  appName?: string;
  displayName?: string;
  instanceId?: number;
  instanceName?: string;
  comment?: string;
  query?: string;
  replicaSetName?: string;
  replicaSetId?: number;
  createdAt?: string;
  updatedAt?: string;
  config?: {
    bars: boolean;
    lines: boolean;
    points: boolean;
    stack: boolean;
    type: string;
  };
}

export interface PrometheusResponse {
  data: {
    result: {
      metric: { [key: string]: string };
      values: [number, string][]
    }[];
    resultType: string;
  };
  status: string;
}
