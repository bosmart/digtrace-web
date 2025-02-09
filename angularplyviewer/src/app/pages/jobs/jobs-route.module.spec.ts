import { JobsRouteModule } from './jobs-route.module';

describe('JobsRouteModule', () => {
  let jobsRouteModule: JobsRouteModule;

  beforeEach(() => {
    jobsRouteModule = new JobsRouteModule();
  });

  it('should create an instance', () => {
    expect(jobsRouteModule).toBeTruthy();
  });
});
