export interface Rule {
  id: number;
  chartId: number;
  description?: string;
  displayName?: string;
  for?: string;
  labels?: [
    {
      name: string
    }
  ];
  name?: string;
  operation?: string;
  operand?: number;
  summary?: string;
}
