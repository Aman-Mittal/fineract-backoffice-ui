/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work set is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LoadingService } from '../services/loading.service';
import { loadingInterceptor } from './loading.interceptor';

describe('loadingInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  const testUrl = '/api/test';

  beforeEach(() => {
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['setLoading']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting(),
        { provide: LoadingService, useValue: loadingServiceSpy },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should set loading to true and then false upon request completion', () => {
    httpClient.get(testUrl).subscribe((response) => {
      expect(response).toEqual({ data: 'ok' });
    });

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true, testUrl);

    const req = httpTestingController.expectOne(testUrl);
    req.flush({ data: 'ok' });

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(false, testUrl);
  });

  it('should skip loading indicator if X-Skip-Loading header is present', () => {
    const headers = new HttpHeaders().set('X-Skip-Loading', 'true');
    httpClient.get('/api/test-skip', { headers }).subscribe();

    expect(loadingServiceSpy.setLoading).not.toHaveBeenCalled();

    const req = httpTestingController.expectOne('/api/test-skip');
    req.flush({});
  });

  it('should set loading to false even if request errors', () => {
    const errorUrl = '/api/test-error';
    httpClient.get(errorUrl).subscribe({
      next: () => fail('expected an error'),
      error: () => expect().nothing(),
    });

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true, errorUrl);

    const req = httpTestingController.expectOne(errorUrl);
    req.flush('Error occurred', { status: 500, statusText: 'Server Error' });

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(false, errorUrl);
  });
});
