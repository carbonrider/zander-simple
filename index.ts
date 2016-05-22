import zander = require('zander');
import path = require('path');
var configLoader = new zander.SimpleFilePathMatchLoader(["modules/module.json"]);
var depManager = zander.DependencyInjection({ configLoader: configLoader, modulePath: path.join(__dirname, 'modules') });
depManager.configure().then((complete)=>{
  depManager.getBean("image").save("Sample Image data");
});