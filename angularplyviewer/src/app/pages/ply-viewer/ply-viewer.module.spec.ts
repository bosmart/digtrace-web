import { PlyViewerModule } from './ply-viewer.module';

describe('PlyViewerModule', () => {
  let plyViewerModule: PlyViewerModule;

  beforeEach(() => {
    plyViewerModule = new PlyViewerModule();
  });

  it('should create an instance', () => {
    expect(plyViewerModule).toBeTruthy();
  });
});
