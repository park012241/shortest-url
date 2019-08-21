import { Injectable } from '@nestjs/common';
import { Collection, MongoClient } from 'mongodb';
import { UrlInterface } from './interface/url.interface';

@Injectable()
export class AppService {
  private urlDatabase: Collection<UrlInterface>;

  constructor() {
    new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).connect().then((mongo) => {
      this.urlDatabase = mongo.db().collection('urls');
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
