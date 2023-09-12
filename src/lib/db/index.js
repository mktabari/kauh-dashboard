export const dbLocks11g = `select 'server_id' serverid, locker.INST_ID,
locker.instance,
locker.username,
locker.sid,
locker.SERIAL# SERIAL,
nvl(locker.object_name,' ') object_name,
locker.seconds_in_wait,
locker.type,
locker.lock_mode,
locker.MACHINE,
blocked.blocked_instance,
blocked.USERNAME blocked_USERNAME,
blocked.seconds_in_wait seconds_blocked
from (select
        l.INST_ID,
        l.INST_ID instance,
        l.sid sid,
        s.SERIAL#,
        s.MACHINE,
        s.username,
        o.name object_name,
        s.seconds_in_wait,
        l.type,
        
        decode(lmode,
               1,
               'NULL',
               2,
               'Row Share',
               3,
               'Row Exclusive',
               4,
               'Share',
               5,
               'Share Row',
               6,
               'Exclusive') lock_mode,
        l.INST_ID || '-' || l.sid inst_sid
   from gv$lock l, gv$session s, sys.obj$ o
  where l.type in ('RW', 'TM', 'TX', 'UL')
    and l.sid = s.sid(+)
    and l.id1 = o.obj#(+)
    and l.INST_ID = s.INST_ID
    and lmode > 0) locker,
(select INST_ID,
        SID,
        USERNAME,
        seconds_in_wait,
        INST_ID blocked_instance,
        BLOCKING_INSTANCE || '-' || BLOCKING_SESSION inst_sid
   from gv$session) blocked
where locker.inst_sid = blocked.inst_sid(+)
order by locker.sid`;

export const dbSga = 'SELECT round(sum(value) / 1024 / 1024 / 1024, 2)  SGA  FROM v$sga';

export const dbVersion = "SELECT BANNER FROM v$version WHERE banner LIKE 'Oracle%'";

export const dbTablespace = `select 'server_id' serverid,
a.TABLESPACE_NAME,
count(*) nof,
round(sum(a.BYTES) / 1024 / 1024 / 1024) BYTES,
round(sum(decode(a.AUTOEXTENSIBLE, 'NO', a.BYTES, a.MAXBYTES)) / 1024 / 1024 / 1024) maxbytes,
round(100 * sum(a.BYTES) /
      sum(decode(a.AUTOEXTENSIBLE, 'NO', a.BYTES, a.MAXBYTES))) percent,
(sum(decode(a.AUTOEXTENSIBLE, 'NO', a.BYTES, a.MAXBYTES)) -
sum(a.BYTES)) / 1024 / 1024 / 1024 remaining
from dba_data_files a
group by a.TABLESPACE_NAME
order by sum(a.BYTES) desc`;
export const dbSessions = `select a.STATUS,count(*) c
from v$session a 
group by a.STATUS`;
export const dbMachine = `select a.MACHINE,count(*) c
from v$session a 
group by a.MACHINE
having count(*)>5
order by count(*) desc`;
export const dbSize = `select round(sum(BYTES)/1024/1024/1024) BYTES
from dba_data_files`;

export const dbSessionsMax = `select s.VALUE sessions from v$parameter s
where s.name = 'sessions'`;

export const dbUpDown = `SELECT to_char(originating_timestamp,'rrrr-mm-dd hh24:mi:ss') MON_DATE,
decode(substr(message_text,0,2),'St','SUP','SDN') OPERATION
FROM v$alert_log a 
WHERE (message_text LIKE 'Shutting down instance %' 
or message_text LIKE 'Starting ORACLE instance%' 
or message_text LIKE '%terminating the instance%') 
and to_char(originating_timestamp,'rrrrmmdd')>to_char(sysdate-365,'rrrrmmdd')
`;

export const dbHitRatio = `SELECT P1.value+P2.value "LR",P3.value "PR", 
round((P1.value + P2.value - P3.value) / 
(P1.value + P2.value)*100,2) "HR"
  FROM   v$sysstat P1, v$sysstat P2, v$sysstat P3
  WHERE  P1.name = 'db block gets'
  AND    P2.name = 'consistent gets'
  AND    P3.name = 'physical reads'
`;
export const dbSQLTime = `select a.SQL_TEXT,a.EXECUTIONS+a.FETCHES+a.PARSE_CALLS CALLS,round(a.CPU_TIME/(a.EXECUTIONS+a.FETCHES+a.PARSE_CALLS)/1000000) TIME,a.HASH_VALUE
from v$sqlarea a 
where a.EXECUTIONS+a.FETCHES>0
and (a.CPU_TIME/(a.EXECUTIONS+a.FETCHES+a.PARSE_CALLS))>1000000
order by a.CPU_TIME/(a.EXECUTIONS+a.FETCHES+a.PARSE_CALLS) desc`;

export const dbWait = `select * from (
  SELECT event,
  SUM(wait_time + time_waited) twt
  FROM v$active_session_history
  where event is not null
  and event <>'cursor: pin S wait on X'
  GROUP BY event
  ORDER BY twt DESC)
  where rownum<=5`;
