import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const users = [{ id: 1, email: 'user@example.com', password: 'password' }];
    return { users };
  }

  genId(users: any[]): number {
    return users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;
  }
}
