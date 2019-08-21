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

  public async register(url: string): Promise<{
    isNew: boolean;
    id: string;
  }> {
    const urlQuery = this.urlDatabase.find({ origin: url });
    if (await urlQuery.count() === 1) {
      return {
        isNew: false,
        id: (await urlQuery.toArray())[0].shorted,
      };
    } else {
      const randomId = AppService.randomId();
      await this.urlDatabase.insertOne({
        origin: url,
        shorted: randomId,
        history: [],
      });
      return {
        isNew: true,
        id: randomId,
      };
    }
  }

  public async getOriginalURL(id: string): Promise<{
    url?: string;
  }> {
    const queryResult = await this.urlDatabase.find({ shorted: id }).toArray();

    if (queryResult.length === 0) {
      throw new Error('There is nothing with given id.');
    }

    await this.urlDatabase.updateOne({ shorted: id }, { $push: { history: new Date() } });
    return { url: queryResult[0].origin };
  }

  public async getRedirectHistory(id: string): Promise<Date[]> {
    return (await this.urlDatabase.find({ shorted: id }).toArray())[0].history;
  }

  public static randomId(): string {
    return string()(MersenneTwister19937.autoSeed(), 9);
  }
}
