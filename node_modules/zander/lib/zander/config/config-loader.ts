import Promise = require('bluebird');

import fs = require('fs');
import path = require('path');

import glob = require('glob');

export class SimpleFilePathMatchLoader implements IConfigLoader {
    constructor(private configPath: string[]) {

    }

    loadConfig(): Promise<string[]> {
        var configuration: string[] = [];
        return new Promise<string[]>((resolve, reject) => {
            var promise: Promise<any>;
            this.configPath.forEach((val: string) => {
                var configFilePath = path.join(process.cwd(), val);
                promise = this.parseFile(configFilePath);
                promise.then(function (data) {
                    configuration.push(data);
                })
            });
            promise.then(function () {
                resolve(configuration);
            })
                .catch(function (err) {
                    reject(err);
                });
        });
    }

    private parseFile(configFilePath: string): Promise<Buffer> {
        return new Promise<Buffer>(function (resolve, reject) {
            fs.readFile(configFilePath, function (err, data) {
                if (err)
                    return reject(err);
                resolve(data);
            });
        });
    }
}

export class WildcardFilePathConfigLoader implements IConfigLoader {

    constructor(private wildcardPath: string[]) {

    }

    loadConfig(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            this.resolvePaths()
                .then((files) => {
                    
                    var configuration: string[] = new Array<string>();
                    
                    var promise: Promise<any>;
                    files.forEach((val: string) => {
                        var configFilePath = path.join(process.cwd(), val);
                        promise = this.parseFile(configFilePath);
                        promise.then(function (data) {
                            configuration.push(data);
                        })
                    });

                    promise
                        .then(function () {
                            resolve(configuration);
                        })
                        .catch(function (err) {
                            reject(err);
                        });
                });
        });
    }

    private resolvePaths(): Promise<string[]> {
        var files: string[] = new Array<string>();
        return new Promise<string[]>((resolve, reject) => {
            var wildPathCount: number = this.wildcardPath.length;
            this.wildcardPath.forEach((val) => {
                glob(val, (err, matches) => {
                    Array.prototype.push.apply(files, matches);
                    if (--wildPathCount == 0) {
                        resolve(files);
                    }
                });
            });
        });
    }

    private parseFile(configFilePath: string): Promise<Buffer> {
        return new Promise<Buffer>(function (resolve, reject) {
            fs.readFile(configFilePath, function (err, data) {
                if (err)
                    return reject(err);
                resolve(data);
            });
        });
    }
}


export interface IConfigLoader {
    loadConfig(): Promise<string[]>;
}