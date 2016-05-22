import {IStorage} from './';
class FileStorage implements IStorage{
  constructor(){
  }
  
  public save(data:string):void{
    console.log("You are using file storage to save [" + data + "]");
  }
}

module.exports = FileStorage;