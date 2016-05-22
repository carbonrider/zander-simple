import {IStorage} from '../storage'
export class Image {
  constructor(private store:IStorage){
  }
  
  public save():void{
    this.store.save("base64 encoded image data.");
  }
  //...Other methods
}

module.exports = Image;