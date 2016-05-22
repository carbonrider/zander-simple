import {BeanModel} from '../beans/bean-model';
import path = require('path');
import {IScope} from '../scope/bean-scopes';
import {IDependencyResolver} from '../dependency/dependency-resolver';

import Promise = require('bluebird');

export interface IScope {
    scope(): string;
    getBean(): any;
    configure(): Promise<boolean>;
    isBeanResolved(): boolean;
    notifyAfterResolve(cb: any);
}

export class SingletonScope implements IScope {

    private _isResolved: boolean = false;

    private _beanInstance: any;

    constructor(private bean: BeanModel, private beanResolver: IDependencyResolver) {
        this._cb = new Array();
    }

    public configure(): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            this.getConstructorBeans()
                .then((constructorRefs) => {
                    return this.resolveBean(constructorRefs);
                }).then((res) => {
                    this.notifyCallbacks();
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });

        });

    }

    private _cb: any[];

    public notifyAfterResolve(cb: any) {
        this._cb.push(cb);
    }

    private notifyCallbacks() {
        this._cb.forEach((cb) => {
            cb(this.getBean());
        });
        this._cb.splice(0, this._cb.length);
    }

    private getConstructorBeans(): Promise<any[]> {
        var constructorDepRefs: BeanModel[] = this.bean.constructorDependencies;



        return new Promise<any>((resolve, reject) => {
            if (!constructorDepRefs) {
                var refs: any[] = [];
                refs.push(null);
                return resolve(refs);
            } else {
                var refs: any[] = [];
                refs.push(null);
                Promise.each(constructorDepRefs, (item) => {
                    var refPromise: Promise<any> = this.beanResolver.getBean(item.name);
                    refPromise.then((ref) => {
                        refs.push(ref);
                    });
                    return refPromise;
                }).then((refModels) => {
                    resolve(refs);
                })
                    .catch((err) => {
                        reject(err);
                    });
            }

        });
    }

    private resolveBean(refs: any[]): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            var beanPath: string = this.bean.path || this.bean.name;
            var moduleRootPath: string = this.beanResolver.getModuleRoot();
            var dynaBean = require(path.join(moduleRootPath, beanPath));
            this._beanInstance = new (Function.prototype.bind.apply(dynaBean, refs));
            this._isResolved = true;

            if (this.bean.initialize) {
                var initMethod: Function = this._beanInstance[this.bean.initialize];
                initMethod.call(this._beanInstance)
                    .then((res) => {
                        resolve(true);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            } else {
                resolve(true);
            }
        });
    }

    scope(): string {
        return 'singleton';
    }

    getBean(): any {
        return this._beanInstance;
    }

    isBeanResolved(): boolean {
        return this._isResolved;
    }
}
