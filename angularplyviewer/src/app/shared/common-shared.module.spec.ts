import { CommonSharedModule } from './common-shared.module';

describe('CommonSharedModule', () => {
  let commonSharedModule: CommonSharedModule;

  beforeEach(() => {
    commonSharedModule = new CommonSharedModule();
  });

  it('should create an instance', () => {
    expect(commonSharedModule).toBeTruthy();
  });
});
