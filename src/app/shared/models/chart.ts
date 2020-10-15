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
    bars: true,
    lines: true,
    points: true,
    stack: true,
    type: string
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
