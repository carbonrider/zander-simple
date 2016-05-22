import {IConfigLoader} from './lib/zander/config/config-loader';

import {IBeanParser, BeanParser} from './lib/zander/config/bean-parser';
import {IBeanRepository, BeanRepository} from './lib/zander/beans/bean-store';

import {DependencyResolver} from './lib/zander/dependency/dependency-resolver';

import Promise = require('bluebird');

export * from './lib/zander/config/config-loader';

export interface IDependencyManager {
    configure(): Promise<boolean>;

    getBean(name: string): any;
}

export class DependencyManager implements IDependencyManager {

    private beanParser: IBeanParser;
    private beanRepository: IBeanRepository;

    private dependencyResolver: DependencyResolver;

    private configLoader: IConfigLoader;
    private modulePath: string;

    constructor(private dependencyOptions: IDependencyOptions) {
        this.beanRepository = new BeanRepository();
        this.beanParser = new BeanParser(this.beanRepository);

        this.readOptions();
    }

    private readOptions() {
        this.configLoader = this.dependencyOptions.configLoader;
        this.modulePath = this.dependencyOptions.modulePath;
    }

    configure(): Promise<boolean> {
        return new Promise<any>((resolve, reject) => {
            this.configLoader.loadConfig()
                .then((configuration: string[]) => {
                    configuration.forEach((val: string) => {
                        this.beanParser.parseConfig(val);
                    });

                    return Promise.resolve();
                }).then(() => {
                    this.dependencyResolver = new DependencyResolver(this.beanRepository, this.modulePath);
                    return this.dependencyResolver.initializeBeanResolution();
                })
                .then(() => {
                    resolve(true);
                })
                .catch((err) => {
                    reject(err);
                });
        });

    }

    getBean(name: string): any {
        return this.dependencyResolver.getBeanInstance(name);
    }
}

export function DependencyInjection(options: IDependencyOptions): IDependencyManager {
    return new DependencyManager(options);
}

export interface IDependencyOptions {
    configLoader: IConfigLoader,
    modulePath: string
}
