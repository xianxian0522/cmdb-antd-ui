export interface Dashboards {
  id?: number;
  chartIds?: number[];
  comment?: string;
  config?: {
    additionalProp1: {};
    layout: {}[];
  };
  displayName?: string;
  name?: string;
  tags?: string[];
}
