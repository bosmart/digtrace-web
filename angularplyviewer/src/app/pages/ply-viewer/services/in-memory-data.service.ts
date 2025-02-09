import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let heroes = [
      { id: 11, name: '../assets/models/ascii.ply' },
      { id: 12, name: 'Bombasto' },
      { id: 13, name: 'Magneta' },
      { id: 14, name: 'Tornado' }
    ];

    return {heroes};
  }
}
