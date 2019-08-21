import { Injectable } from '@nestjs/common';
import { Collection, MongoClient } from 'mongodb';
import { UrlInterface } from './interface/url.interface';
import { MersenneTwister19937, string } from 'random-js';
import { RedirectStatus } from './interface/redirect-status';

@Injectable()
export class AppService {
  private mongoClient: MongoClient;
  private urlDatabase: Collection<UrlInterface>;

  private readonly hashToHourRegex = /[0-9]{4}-[0-1][0-9]-[0-3][0-9]T[0-1][0-9]/;

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

  private async getUrl(id: string): Promise<UrlInterface> {
    const queryResult = await this.urlDatabase.find({ shorted: id }).toArray();
    if (queryResult.length === 0) {
      throw new Error('There is nothing with given id.');
    }
    return queryResult[0];
  }

  public async getOriginalURL(id: string): Promise<{
    url?: string;
  }> {
    const url = (await this.getUrl(id)).origin;
    await this.urlDatabase.updateOne({ shorted: id }, { $push: { history: new Date() } });
    return { url };
  }

  public async getRedirectStatus(id: string): Promise<RedirectStatus[]> {
    const history = (await this.getUrl(id)).history;
    const tempStatusMap: Map<string, number> = new Map();
    const result: RedirectStatus[] = [];

    for (const i of history.reduce((previousValue, currentValue) => {
      previousValue.push(this.hashToHourRegex.exec(currentValue.toISOString())[0]);
      return previousValue;
    }, [] as string[])) {
      tempStatusMap.set(i, (tempStatusMap.get(i) || 0) + 1);
    }

    tempStatusMap.forEach((value, key) => {
      result.push({
        at: `${key}:00:00`.replace(/T/, ' '),
        visits: value,
      });
    });

    return result;
  }

  public static randomId(): string {
    return string()(MersenneTwister19937.autoSeed(), 9);
  }
}
