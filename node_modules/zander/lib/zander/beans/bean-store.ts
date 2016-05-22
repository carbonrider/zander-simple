import {BeanModel} from './bean-model';

export class BeanRepository implements IBeanRepository {
    private _beans: { [key: string]: BeanModel } = {};

    public addBean(bean: BeanModel): void {
        this._beans[bean.name] = bean;
    }

    public getBeans(): string[] {
        return Object.keys(this._beans);
    }

    public getBean(name: string): BeanModel {
        return this._beans[name];
    }
}

export interface IBeanRepository {
    addBean(bean: BeanModel);

    getBeans(): string[];

    getBean(name: string): BeanModel;
}


