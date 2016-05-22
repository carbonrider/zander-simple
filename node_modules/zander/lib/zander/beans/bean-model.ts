export class BeanModel {
    constructor(private beanName) {
    }

    private _path: string;

    private _constructorDependency: BeanModel[];

    private _scope: string;
    
    private _initialize:string;

    private _propertiesDependency: { [key: string]: BeanModel } = {};

    private _refResolved: boolean;

    public get path(): string {
        return this._path;
    }

    public set path(val: string) {
        this._path = val;
    }

    public get name(): string {
        return this.beanName;
    }

    public set constructorDependencies(val: BeanModel[]) {
        this._constructorDependency = val;
    }

    public get constructorDependencies(): BeanModel[] {
        return this._constructorDependency;
    }

    public set scope(val: string) {
        this._scope = val;
    }

    public get scope(): string {
        return this._scope;
    }

    public get initialize():string{
        return this._initialize;
    }
    
    public set initialize(val:string){
        this._initialize = val;
    }

    public get referenceResolved(): boolean {
        return this._refResolved;
    }

    public set referenceResolved(val: boolean) {
        this._refResolved = true;
    }

    public addPropertyDependency(prop: string, dependency: BeanModel) {
        this._propertiesDependency[prop] = dependency;
    }

}