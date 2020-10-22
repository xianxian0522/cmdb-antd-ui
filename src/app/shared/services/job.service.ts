import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalStats, Job, JobStat} from '../models/job';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

const API = '/api/jobs';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private httpClient: HttpClient) { }

  addJob(job: Job): Observable<AddJobResponse> {
    return this.httpClient.post<AddJobResponse>(API, job);
  }

  findJobs(): Observable<Job[]> {
    return this.httpClient.get<ListJobsResponse>(API)
      .pipe(map(r => Object.values(r.jobs)));
  }

  deleteAllJob(): Observable<void> {
    return this.httpClient.delete<void>(`${API}/all`);
  }

  globalStats(): Observable<GlobalStats> {
    return this.httpClient.get<GlobalStatsResponse>(`${API}/stats`)
      .pipe(map(r => r.stats));
  }

  listJobStats(id: string): Observable<JobStat[]> {
    return this.httpClient.get<ListJobStatsResponse>(`${API}/stats/${id}`)
      .pipe(map(r => r.job_stats));
  }

  startJob(id: string): Observable<void> {
    return this.httpClient.post<void>(`${API}/start/${id}`, null);
  }

  enableJob(id: string): Observable<void> {
    return this.httpClient.post<void>(`${API}/enable/${id}`, null);
  }

  disableJob(id: string): Observable<void> {
    return this.httpClient.post<void>(`${API}/disable/${id}`, null);
  }

  getJob(id: string): Observable<Job> {
    return this.httpClient.get<JobResponse>(`${API}/${id}`)
      .pipe(map(r => r.job));
  }

  deleteJob(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${API}/${id}`);
  }
}

export interface AddJobResponse {
  id: string;
}

export interface JobResponse {
  job: Job;
}

export interface ListJobStatsResponse {
  job_stats: JobStat[];
}

export interface ListJobsResponse {
  jobs: {[key: string]: Job};
}

export interface GlobalStatsResponse {
  stats: GlobalStats;
}
