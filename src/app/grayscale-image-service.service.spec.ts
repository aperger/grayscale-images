import { TestBed } from '@angular/core/testing';

import { GrayscaleImageServiceService } from './grayscale-image-service.service';

describe('GrayscaleImageServiceService', () => {
  let service: GrayscaleImageServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrayscaleImageServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
