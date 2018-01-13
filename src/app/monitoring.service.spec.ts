import { TestBed, inject } from '@angular/core/testing';

import { MonitoringService } from './monitoring.service';

describe('MonitoringService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MonitoringService]
    });
  });

  it('should be created', inject([MonitoringService], (service: MonitoringService) => {
    expect(service).toBeTruthy();
  }));
});
