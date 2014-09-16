var vows = require('vows'),
  assert = require('assert'),
  path = require('path'),
  filter_helper = require('./filter_helper');

vows.describe('Filter grok ').addBatch({
  'normal': filter_helper.create('grok', '?grok=%{NUMBER:fnumber} %{WORD:fword} %{GREEDYDATA:fgreedy}', [
    {
      'message': '123 abc def jhi'
    },
  ], [
    {
      'message': '123 abc def jhi',
      'fnumber': '123',
      'fword': 'abc',
      'fgreedy': 'def jhi'
    },
  ]),
  'same type': filter_helper.create('grok', '?grok=%{NUMBER:fn1} %{NUMBER:fn2} %{NUMBER:fn3}', [
    {
      'message': '123 456 789'
    },
  ], [
    {
      'message': '123 456 789',
      'fn1': '123',
      'fn2': '456',
      'fn3': '789'
    },
  ]),
  'haproxy': filter_helper.create('grok', '?grok=%{HAPROXYHTTP}', [
    {
      'message': 'Sep 14 02:01:37 lb haproxy[11223]: 127.0.0.1:12345 [14/Sep/2014:02:01:37.452] public nginx/server1 0/0/0/5/5 200 490 - - ---- 1269/1269/0/1/0 0/0 "GET /my/path HTTP/1.1"'
    },
  ], [
    {
      'message': 'Sep 14 02:01:37 lb haproxy[11223]: 127.0.0.1:12345 [14/Sep/2014:02:01:37.452] public nginx/server1 0/0/0/5/5 200 490 - - ---- 1269/1269/0/1/0 0/0 "GET /my/path HTTP/1.1"',
      'syslog_timestamp': 'Sep 14 02:01:37',
      'syslog_server': 'lb',
      'program': 'haproxy',
      'pid': '11223',
      'client_ip': '127.0.0.1',
      'client_port': '12345',
      'accept_date': '14/Sep/2014:02:01:37.452',
      'haproxy_monthday': '14',
      'haproxy_month': 'Sep',
      'haproxy_year': '2014',
      'haproxy_time': '02:01:37',
      'haproxy_hour': '02',
      'haproxy_minute': '01',
      'haproxy_second': '37',
      'haproxy_milliseconds': '452',
      'frontend_name': 'public',
      'backend_name': 'nginx',
      'server_name': 'server1',
      'time_request': '0',
      'time_queue': '0',
      'time_backend_connect': '0',
      'time_backend_response': '5',
      'time_duration': '5',
      'http_status_code': '200',
      'bytes_read': '490',
      'captured_request_cookie': '-',
      'captured_response_cookie': '-',
      'termination_state': '----',
      'actconn': '1269',
      'feconn': '1269',
      'beconn': '0',
      'srvconn': '1',
      'retries': '0',
      'srv_queue': '0',
      'backend_queue': '0',
      'captured_request_headers': '',
      'captured_response_headers': '',
      'http_verb': 'GET',
      'http_proto': '',
      'http_user': '',
      'http_host': '',
      'port': '',
      'http_request': '/my/path',
      'http_version': '1.1'
    },
  ]),
  'extra patterns': filter_helper.create('grok', '?grok=%{GROKTEST}&extra_patterns='+path.resolve(__dirname, 'grok/extra'), [
    {
      'message': '123 abc def jhi ABC123'
    },
  ], [
    {
      'message': '123 abc def jhi ABC123',
      'fnumber': '123',
      'fword': 'abc',
      'fgreedy': 'def jhi',
      'ftestpattern': 'ABC123'
    },
  ]),
}).export(module);
