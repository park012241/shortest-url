import { Injectable } from '@nestjs/common';
import { Collection, MongoClient } from 'mongodb';
import { UrlInterface } from './interface/url.interface';
import { MersenneTwister19937, string } from 'random-js';

@Injectable()
export class AppService {
  private mongoClient: MongoClient;
  private urlDatabase: Collection<UrlInterface>;

  constructor() {
    this.mongoClient = new MongoClient('mongodb://localhost:27017/shortest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  public async connect() {
    this.urlDatabase = (await this.mongoClient.connect()).db().collection<UrlInterface>('urls');
    await this.urlDatabase.createIndex('shorted');
  }

  public isConnected(): boolean {
    return this.mongoClient.isConnected();
  }

  static getHello(): string {
    return 'Hello World!';
  }

  public static randomId(): string {
    return string()(MersenneTwister19937.autoSeed(), 9);
  }
}
