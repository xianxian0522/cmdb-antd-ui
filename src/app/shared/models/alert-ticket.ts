export interface AlertTicket {
  id: number;
  status?: string;
  alerts?: [
    {
      status?: string;
      labels?: { [key: string]: string };
      annotations?: { [key: string]: string };
      startsAt?: string;
      endsAt?: string;
      generatorURL?: string;
      fingerprint?: string;
    }
  ];
  commonLabels?: { [key: string]: string };
  commonAnnotations?: { [key: string]: string };
  externalUrl?: string;
  fingerprint?: string;
  receiveTimes?: string;
  remark?: string;
  nextNotifyTime?: string;
  createdAt?: string;
  updatedAt?: string;
}
