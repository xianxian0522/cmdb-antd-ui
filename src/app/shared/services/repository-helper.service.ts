import {Injectable} from '@angular/core';
import {AppRepository} from './app-repository';
import {HostRepository} from './host-repository';
import {ReplicaSetRepository} from './replica-set-repository';
import {InstanceRepository} from './instance-repository';
import {AbstractControl} from '@angular/forms';
import {first, flatMap, map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {App} from '../models/app';
import {ReplicaSet} from '../models/replica-set';
import {Host} from '../models/host';
import {Instance} from '../models/instance';
import {PlaybookRepository} from './playbook-repository';
import {Playbook} from '../models/playbook';
import {NzAutocompleteComponent} from 'ng-zorro-antd/auto-complete';

@Injectable({
  providedIn: 'root'
})
export class RepositoryHelperService {

  constructor(private hostRepository: HostRepository,
              private appRepository: AppRepository,
              private replicaSetRepository: ReplicaSetRepository,
              private instanceRepository: InstanceRepository,
              private playbookRepository: PlaybookRepository) {}

  appAutoHelp(auto: NzAutocompleteComponent, ctrl: AbstractControl, initValue?: any): Observable<App[]> {
    return this.appRepository.queryAll(null, ['id', 'name']).pipe(
      first(),
      flatMap(xs => {
        const fn = id => xs.filter(x => x.id === id).map(x => x.name)[0];
        if (arguments.length === 3) {
          setTimeout(() => ctrl.setValue(initValue));
        }
        return ctrl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : fn(value)),
            map(name => name ?
              xs.filter(option => option.name.toLowerCase().indexOf(name.toLowerCase()) >= 0) :
              xs.slice())
          );
      })
    );
  }

  replicaSetAutoHelp(auto: NzAutocompleteComponent,
                     ctrl: AbstractControl,
                     initValue?: any): Observable<ReplicaSet[]> {
    return this.replicaSetRepository.queryAll().pipe(
      first(),
      flatMap(xs => {
        const fn = id => xs.filter(x => x.id === id).map(x => x.name)[0];
        if (arguments.length === 3) {
          setTimeout(() => ctrl.setValue(initValue));
        }
        return ctrl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : fn(value)),
            map(name => name ?
              xs.filter(option => option.name.toLowerCase().indexOf(name.toLowerCase()) >= 0) :
              xs.slice())
          );
      })
    );
  }

  hostAutHelp(auto: NzAutocompleteComponent, ctrl: AbstractControl, initValue?: any): Observable<Host[]> {
    return this.hostRepository.queryAll().pipe(
      first(),
      flatMap(xs => {
        const fn = id => xs.filter(x => x.id === id).map(x => x.hostName)[0];
        if (arguments.length === 3) {
          setTimeout(() => ctrl.setValue(initValue));
        }
        return ctrl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : fn(value)),
            map(name => name ?
              xs.filter(option => option.hostName.toLowerCase().indexOf(name.toLowerCase()) >= 0) :
              xs.slice())
          );
      })
    );
  }

  instanceAutoHelp(auto: NzAutocompleteComponent,
                   ctrl: AbstractControl,
                   initValue?: any): Observable<Instance[]> {
    return this.instanceRepository.queryAll().pipe(
      first(),
      flatMap(xs => {
        const fn = id => xs.filter(x => x.id === id).map(x => x.name)[0];
        if (arguments.length === 3) {
          setTimeout(() => ctrl.setValue(initValue));
        }
        return ctrl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : fn(value)),
            map(name => name ?
              xs.filter(option => option.name.toLowerCase().indexOf(name.toLowerCase()) >= 0) :
              xs.slice())
          );
      })
    );
  }

  playbookAutoHelp(auto: NzAutocompleteComponent,
                   ctrl: AbstractControl,
                   initValue?: any): Observable<Playbook[]> {
    return this.playbookRepository.queryAll(null, ['id', 'name']).pipe(
      first(),
      flatMap(xs => {
        const fn = id => xs.filter(x => x.id === id).map(x => x.name)[0];
        if (arguments.length === 3) {
          setTimeout(() => ctrl.setValue(initValue));
        }
        return ctrl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : fn(value)),
            map(name => name ?
              xs.filter(option => option.name.toLowerCase().indexOf(name.toLowerCase()) >= 0) :
              xs.slice())
          );
      })
    );
  }
}
