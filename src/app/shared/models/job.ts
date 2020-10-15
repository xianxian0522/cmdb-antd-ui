export interface Job {
  id?: string;
  name?: string;
  command?: string;
  owner?: string;
  disabled?: boolean;
  dependent_jobs?: string[];
  parent_jobs?: string[];
  on_failure_job?: string;
  schedule?: string;
  retries?: number;
  epsilon?: string;
  next_run_at?: string;
  template_delimiters?: string;
  resume_at_next_scheduled_time?: boolean;
  metadata?: Metadata;
  type?: string;
  stats?: JobStat[];
  is_done?: boolean;
  playbook_id?: number;
}

export interface Metadata {
  success_count: number;
  last_success: string;
  error_count: number;
  last_error: string;
  last_attempted_run: string;
  number_of_finished_runs: number;
}

export interface JobStat {
  job_id: string;
  ran_at: string;
  number_of_retries: number;
  success: boolean;
  execution_duration: number;
}

export interface GlobalStats {
  active_jobs: number;
  disabled_jobs: number;
  jobs: number;
  error_count: number;
  success_count: number;
  next_run_at: string;
  last_attempted_run: string;
  created: string;
}
