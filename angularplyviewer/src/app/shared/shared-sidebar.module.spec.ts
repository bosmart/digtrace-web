import { SharedSidebarModule } from './shared-sidebar.module';

describe('SharedSidebarModule', () => {
  let sharedSidebarModule: SharedSidebarModule;

  beforeEach(() => {
    sharedSidebarModule = new SharedSidebarModule();
  });

  it('should create an instance', () => {
    expect(sharedSidebarModule).toBeTruthy();
  });
});
