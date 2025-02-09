import { ImagesRouteModule } from './images-route.module';

describe('ImagesRouteModule', () => {
  let imagesRouteModule: ImagesRouteModule;

  beforeEach(() => {
    imagesRouteModule = new ImagesRouteModule();
  });

  it('should create an instance', () => {
    expect(imagesRouteModule).toBeTruthy();
  });
});
