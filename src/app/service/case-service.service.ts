import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CaseServiceService {
  httpOptions;
  baseUrl: string = 'https://debug.nbcfb.com';
  API = {
    EDIT_ANALIZER_BY_ID: '/analyzer/',
    GET_ANALIZER_LIST: '/analyzer_list',
    GET_CONDITION: '/analyzer_input',
    UPDATE_ANALYZER: '/analyzer/!',
  };

  constructor(private http: HttpClient) { }

  getAnalyzerById(analyzerId) {
    this.makeHttpOptions();
    const url = this.baseUrl + this.API.EDIT_ANALIZER_BY_ID + analyzerId;
    return this.http.get<any>(url, this.httpOptions).pipe(
      map(res => {
        return res;
      }
      )
    );
  }


  deleteAnalyzerById(analyzerId) {
    this.makeHttpOptions();
    const url = this.baseUrl + this.API.EDIT_ANALIZER_BY_ID + analyzerId;
    return this.http.delete<any>(url, this.httpOptions).pipe(
      map(res => {
        return res;
      }
      )
    );
  }


  getAnalyzerList() {
    this.makeHttpOptions();
    const url = this.baseUrl + this.API.GET_ANALIZER_LIST;
    return this.http.get<any>(url, this.httpOptions).pipe(
      map(res => {
        return res;
      }
      )
    );
  }

  getCondition() {
    this.makeHttpOptions();
    const url = this.baseUrl + this.API.GET_CONDITION;
    return this.http.get<any>(url, this.httpOptions).pipe(
      map(res => {
        return res;
      }
      )
    );
  }

  updateAnalyzer() {
    this.makeHttpOptions();
    const url = this.baseUrl + this.API.UPDATE_ANALYZER;
    return this.http.post<any>(url, {}, this.httpOptions).pipe(
      map(res => {
        return res;
      }
      )
    );
  }

  private makeHttpOptions() {
    // const authToken = (<User>this.session.getUser()).authToken;
    // this.httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': authToken,
    //   })
    // };
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
  }
}
