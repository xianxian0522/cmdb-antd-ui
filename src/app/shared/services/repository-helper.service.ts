import {Injectable} from '@angular/core';
import {AppRepository} from './app-repository';
import {HostRepository} from './host-repository';
import {ReplicaSetRepository} from './replica-set-repository';
import {InstanceRepository} from './instance-repository';
import {MatAutocomplete} from '@angular/material/autocomplete';
import {AbstractControl} from '@angular/forms';
import {first, flatMap, map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {App} from '../models/app';
import {ReplicaSet} from '../models/replica-set';
import {Host} from '../models/host';
import {Instance} from '../models/instance';
import {PlaybookRepository} from './playbook-repository';
import {Playbook} from '../models/playbook';

@Injectable({
  providedIn: 'root'
})
export class RepositoryHelperService {

  constructor(private _hostRepository: HostRepository,
              private _appRepository: AppRepository,
              private _replicaSetRepository: ReplicaSetRepository,
              private _instanceRepository: InstanceRepository,
              private _playbookRepository: PlaybookRepository) {}

  appAutoHelp(auto: MatAutocomplete, ctrl: AbstractControl, initValue?: any): Observable<App[]> {
    return this._appRepository.queryAll(null, ['id', 'name']).pipe(
      first(),
      flatMap(xs => {
        const fn = id => xs.filter(x => x.id === id).map(x => x.name)[0];
        auto.displayWith = fn;
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

  replicaSetAutoHelp(auto: MatAutocomplete,
                     ctrl: AbstractControl,
                     initValue?: any): Observable<ReplicaSet[]> {
    return this._replicaSetRepository.queryAll().pipe(
      first(),
      flatMap(xs => {
        const fn = id => xs.filter(x => x.id === id).map(x => x.name)[0];
        auto.displayWith = fn;
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

  hostAutHelp(auto: MatAutocomplete, ctrl: AbstractControl, initValue?: any): Observable<Host[]> {
    return this._hostRepository.queryAll().pipe(
      first(),
      flatMap(xs => {
        const fn = id => xs.filter(x => x.id === id).map(x => x.hostName)[0];
        auto.displayWith = fn;
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

  instanceAutoHelp(auto: MatAutocomplete,
                   ctrl: AbstractControl,
                   initValue?: any): Observable<Instance[]> {
    return this._instanceRepository.queryAll().pipe(
      first(),
      flatMap(xs => {
        const fn = id => xs.filter(x => x.id === id).map(x => x.name)[0];
        auto.displayWith = fn;
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

  playbookAutoHelp(auto: MatAutocomplete,
                   ctrl: AbstractControl,
                   initValue?: any): Observable<Playbook[]> {
    return this._playbookRepository.queryAll(null, ['id', 'name']).pipe(
      first(),
      flatMap(xs => {
        const fn = id => xs.filter(x => x.id === id).map(x => x.name)[0];
        auto.displayWith = fn;
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
