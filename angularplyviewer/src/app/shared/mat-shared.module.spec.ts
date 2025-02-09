import { MatSharedModule } from './mat-shared.module';

describe('MatSharedModule', () => {
  let matSharedModule: MatSharedModule;

  beforeEach(() => {
    matSharedModule = new MatSharedModule();
  });

  it('should create an instance', () => {
    expect(matSharedModule).toBeTruthy();
  });
});
