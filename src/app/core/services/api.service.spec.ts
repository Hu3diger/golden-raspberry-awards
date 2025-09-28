import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get method', () => {
    it('should make GET request to correct URL without params', () => {
      const mockResponse = { data: 'test' };
      const endpoint = '/test';

      service.get(endpoint).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should make GET request with query parameters', () => {
      const mockResponse = { data: 'test' };
      const endpoint = '/test';
      const params = { page: '1', size: '10' };

      service.get(endpoint, params).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}?page=1&size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty params object', () => {
      const mockResponse = { data: 'test' };
      const endpoint = '/test';

      service.get(endpoint, {}).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle HTTP errors', () => {
      const endpoint = '/test';
      const errorMessage = 'Server error';
      let errorResponse: any;

      service.get(endpoint).subscribe({
        next: () => {
          fail('Expected error, but got success');
        },
        error: (error) => {
          errorResponse = error;
        }
      });

      for (let i = 0; i < 3; i++) {
        const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
        req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
      }

      expect(errorResponse).toBeDefined();
      expect(errorResponse.status).toBe(500);
      expect(errorResponse.statusText).toBe('Server Error');
    });
  });
});
