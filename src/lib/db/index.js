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
