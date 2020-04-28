import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Analyzer } from '../model/Analyzer';
import { TaskTemplate } from '../model/taskTemplate';
import { TaskBind } from '../model/taskBind';
import { Result } from '../model/result';
import { CorpAnalyzerData } from '../model/corp';

@Injectable({
  providedIn: 'root'
})
export class CaseServiceService {

  httpOptions;
  baseUrl = 'http://172.18.1.103:9091';
  // baseUrl = 'http://172.18.0.165:9091';

  API = {
    EDIT_ANALYZER_BY_ID: '/analyzer/',
    GET_ANALYZER_LIST: '/analyzer_list',
    GET_CONDITION: '/analyzer_input',
    ADD_ANALYZER: '/analyzer/+',
    UPDATE_ANALYZER: '/analyzer/!',
    GET_TASK_TEMP_BY_ID: '/task_template/',
    GET_ALL_TASK_TEMPS: '/task_template',
    ADD_TASK_TEMP: '/task_template/+',
    BIND_TASK_TEMP: '/analyzer/task/bind',
    GET_ANALYZER_SHOW: '/analyzer_show',
    GET_CORP_ANALYZERDATA: '/corp/data',
    UPDATE_CORP: '/corp/data/!',
    ANALYZE: '/analyze/'
  };

  constructor(private http: HttpClient) {
  }

  getAnalyzerById(analyzerId: string) {
    this.makeHttpOptions();
    const url = `${this.baseUrl}${this.API.EDIT_ANALYZER_BY_ID}${analyzerId}`;
    return this.http.get<any>(url, this.httpOptions).pipe(
      map(res => {
        return res;
      })
    );
  }


  deleteAnalyzerById(analyzerId: string) {
    this.makeHttpOptions();
    const url = `${this.baseUrl}${this.API.EDIT_ANALYZER_BY_ID}${analyzerId}`;
    return this.http.delete<any>(url, this.httpOptions).pipe(
      map(res => {
        return res;
      })
    );
  }


  getAnalyzerList() {
    this.makeHttpOptions();
    const url = `${this.baseUrl}${this.API.GET_ANALYZER_LIST}`;
    return this.http.get<any>(url, this.httpOptions).pipe(
      map(res => {
        return res;
      })
    );
  }

  getCondition() {
    this.makeHttpOptions();
    const url = `${this.baseUrl}${this.API.GET_CONDITION}`;
    return this.http.get<any>(url, this.httpOptions).pipe(
      map(res => {
        return res;
      })
    );
  }

  getAnalyzerSHow() {
    this.makeHttpOptions();
    const url = `${this.baseUrl}${this.API.GET_ANALYZER_SHOW}`;
    return this.http.get<any>(url, this.httpOptions).pipe(
      map(res => {
        return res;
      })
    );
  }

  addAnalyzer(analyzer: Analyzer) {
    this.makeHttpOptions();
    const url = `${this.baseUrl}${this.API.ADD_ANALYZER}`;
    return this.http.post<any>(url, analyzer, this.httpOptions).pipe(
      map(res => {
        return res;
      })
    );
  }

  updateAnalyzer(analyzer: Analyzer) {
    this.makeHttpOptions();
    const url = `${this.baseUrl}${this.API.UPDATE_ANALYZER}`;
    return this.http.post<any>(url, analyzer, this.httpOptions).pipe(
      map(res => {
        return res;
      })
    );
  }

  getTaskTemps() {
    this.makeHttpOptions();
    const url = `${this.baseUrl}${this.API.GET_ALL_TASK_TEMPS}`;
    return this.http.get<any>(url, this.httpOptions).pipe(
      map(res => {
        return res;
      })
    );
  }

  getTempByIds(tempIds) {
    this.makeHttpOptions();
    const url = `${this.baseUrl}${this.API.GET_TASK_TEMP_BY_ID}${tempIds}`;
    return this.http.get<any>(url, this.httpOptions).pipe(
      map(res => {
        return res;
      })
    );
  }

  addTaskTemp(taskTemp: TaskTemplate) {
    this.makeHttpOptions();
    const url = `${this.baseUrl}${this.API.ADD_TASK_TEMP}`;
    return this.http.post<any>(url, taskTemp, this.httpOptions).pipe(
      map(res => {
        return res;
      })
    );
  }

  bindTaskTemp(taskBind: TaskBind) {
    this.makeHttpOptions();
    const url = `${this.baseUrl}${this.API.BIND_TASK_TEMP}`;
    return this.http.post<any>(url, taskBind, this.httpOptions).pipe(
      map(res => {
        return res;
      })
    );
  }

  getAnalyzerResultById(analyzerId: string, corpId?: string) {
    this.makeHttpOptions();
    const corpID = corpId ?? '1';
    const url = `${this.baseUrl}${this.API.ANALYZE}${corpID}/${analyzerId}`;
    return this.http.get<any>(url, this.httpOptions).pipe(
      map(res => res as unknown as Result)
    );
  }

  getCorpAnalyzerDataById(analyzerId: string, corpId?: string) {
    this.makeHttpOptions();
    const corpID = corpId ?? '1';
    const url = `${this.baseUrl}${this.API.GET_CORP_ANALYZERDATA}/${corpID}/${analyzerId}`;
    return this.http.get<any>(url, this.httpOptions).pipe(
      map(res => res as unknown as Result)
    );
  }

  updateCorpAnalyzerData(corpAnalyzerData: CorpAnalyzerData[]) {
    this.makeHttpOptions();
    const url = `${this.baseUrl}${this.API.UPDATE_CORP}`;
    return this.http.post<any>(url, corpAnalyzerData, this.httpOptions).pipe(
      map(res => res as unknown as Result)
    );
  }

  private makeHttpOptions() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
  }
}
