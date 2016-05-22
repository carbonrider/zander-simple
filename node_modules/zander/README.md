# Zander

A configurable dependency injection for Node.JS without a need to patch `require` or manually injecting references.
Simple, easy to get started and bundled with examples to bootstrap your project.

## Usage
Install zander using your favorite package manager : npm

```
npm install zander --save
```

Once you have configured zander in your project, here is the next step.

### Javascript

```javascript
"use strict";
var zander = require('zander');
var path = require('path');
var configLoader = new zander.SimpleFilePathMatchLoader(["modules/module.json"]);
var depManager = zander.DependencyInjection({ configLoader: configLoader, modulePath: path.join(__dirname, 'modules') });
depManager.configure();
```

Note that the `configure` function returns `Promise` which can be used to get references of beans or perform any activity
which requires all the beans are in ready state. The examples could include start listing on 8080 port after all services
are ready. Refer to following code block for details

```javascript
depManager.configure().then(function (configured) {
    console.log("All beans are initialized and injected.");
    var customerBean = depManager.getBean("customer");
    customerBean.greet();
});
```

## Multiple beans under one folder
In case, if you have multiple beans under one folder due to the grouping requirements your project has, Zander offers `path`
attribute for bean declaration. Refer to multi-bean example for more details.

## Module configuration

Zander supports both simple path matching and glob style path matching support for loading configuration files.
Just replace `SimpleFilePathMatchLoader` with `WildcardFilePathConfigLoader` and you can specify wildcard path.

## Split configuration

Zander supports splitting configuration of beans across multiple files and its programmed to identify dependencies
in correct order. As a developer you are free to split configuration as per logical groups of beans. For e.g. all
service beans in one file, while all business logic and data access bean definitions in another file.

## Zander in action

Zander doesn't require to inherit nor make any references to the core framework in your beans. The current implementation
supports injecting dependencies using constructors.
