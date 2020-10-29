import { Injectable } from '@angular/core';

export interface MenuItem {
  id: string;
  name: string;
  icon: string;
}

const CMDB = 'cmdb';
const MONITOR = 'monitor';
const JOB = 'job';
const MENUS: { [key: string]: MenuItem[] } = {
  [CMDB]: [
    {
      id: 'user',
      name: '用户管理',
      icon: 'user-switch',
    },
    {
      id: 'hosts',
      name: '机器管理',
      icon: 'fund-projection-screen',
    },
    {
      id: 'apps',
      name: '应用管理',
      icon: 'qrcode',
    },
    {
      id: 'replicasets',
      name: '副本集管理',
      icon: 'one-to-one',
    },
    {
      id: 'instances',
      name: '实例管理',
      icon: 'profile',
    },
    {
      id: 'playbooks',
      name: '剧本管理',
      icon: 'read',
    }
  ],
  [MONITOR]: [
    {
      id: 'rules',
      name: '规则管理',
      icon: 'info-circle',
    },
    {
      id: 'charts',
      name: '监控图表',
      icon: 'area-chart',
    },
    {
      id: 'dashboards',
      name: '仪表盘管理',
      icon: 'trademark',
    }
  ],
  [JOB]: [
    {
      id: 'list',
      name: '工作列表',
      icon: 'table',
    },
    {
      id: 'metrics',
      name: '运行状态',
      icon: 'play-square',
    }
  ]
};
const ALL_CMDB = MENUS[CMDB];
const ALL_MONITOR = MENUS[MONITOR];
const ALL_JOB = MENUS[JOB];
const ALL_SECTIONS: MenuItem[] = [
  {
    id: CMDB,
    name: '系统配置',
    icon: 'setting',
  },
  {
    id: MONITOR,
    name: '监控中心',
    icon: 'fund',
  },
  {
    id: JOB,
    name: '调度中心',
    icon: 'star',
  }
];

@Injectable({
  providedIn: 'root'
})
export class MenuItems {
  getAllSections(): MenuItem[] {
    return ALL_SECTIONS;
  }

  getItems(section: string): MenuItem[] {
    if (section === CMDB) {
      return ALL_CMDB;
    }
    if (section === MONITOR) {
      return ALL_MONITOR;
    }
    if (section === JOB) {
      return ALL_JOB;
    }
    return [];
  }

  getItemById(id: string, section: string): MenuItem | undefined {
    return this.getItems(section).find(item => item.id === id);
  }
}
