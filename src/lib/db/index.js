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
having count(*)>10
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
export const dbCurrentSQLTime = `select a.SQL_ID,t.SQL_TEXT,count(*) EXE,
round(avg(a.CPU_TIME*power(10,-6)),2) CPU_AVG,
round(sum(a.CPU_TIME*power(10,-6)),2) CPU_TOT,
round(avg(a.USER_IO_WAIT_TIME*power(10,-6)),2) IO_AVG,
round(sum(a.USER_IO_WAIT_TIME*power(10,-6)),2) IO_TOT,
round(avg(a.ELAPSED_TIME *power(10,-6)),2) ELA_AVG,
round(sum(a.ELAPSED_TIME*power(10,-6)),2) ELA_TOT
from V$SQL_MONITOR a ,v$sqlarea t
where a.SQL_ID=t.SQL_ID
group by a.SQL_ID,t.sql_text
--having sum(a.ELAPSED_TIME*power(10,-6))>=1
order by 9 desc`;
export const dbSQLTime = `select a.SQL_TEXT,a.EXECUTIONS CALLS,round(a.CPU_TIME/(a.EXECUTIONS)/1000000) TIME,a.HASH_VALUE,a.optimizer_cost COST
from v$sqlarea a
where a.EXECUTIONS>0
and (a.CPU_TIME/(a.EXECUTIONS))>1000000
order by 3 desc`;

export const dbWait = `select * from (
  SELECT event,
  SUM(wait_time + time_waited) twt
  FROM v$active_session_history
  where event is not null
  and event <>'cursor: pin S wait on X'
  GROUP BY event
  ORDER BY twt DESC)
  where rownum<=5`;

export const dbTrans = `SELECT a.username UserName,
  a.sid DB_Sid,
  e.spid Unix_Pid,
  TO_CHAR(TO_DATE(b.start_time, 'mm/dd/yy hh24:mi:ss'),
          'yyyy/mm/dd hh24:mi:ss') Trnx_start_time,
  ROUND(60 * 24 *
        (sysdate - to_date(b.start_time, 'mm/dd/yy hh24:mi:ss')),
        2) Elapsed,
  TO_CHAR(b.used_ublk * d.value / 1024) Used_Undo_Size,
  b.log_io * d.value / 1024 Logical_IO,
  b.phy_io * d.value / 1024 Physical_IO,
  a.program
FROM v$session         a,
  v$transaction     b,
  v$parameter       d,
  v$process         e
WHERE b.ses_addr = a.saddr
AND d.name = 'db_block_size'
AND e.ADDR = a.PADDR
ORDER BY 4`;

export const dbVacXUser = `SELECT DISTINCT to_number(p.employee_number) EMPNUM,
p.full_name FN,
kauh_hr_pkg.JOB(a.JOB_ID) JOB,
--to_char(s.actual_termination_date,'dd/mm/rrrr') TD,
--a.assignment_status_type_id,
u.appl_user_id AUI,
u.func_role_id PI,
(SELECT count(*)
  FROM oa_appt@ISOFT T
  WHERE t.practitioner_id=u.func_role_id
  and appt_date>=trunc(sysdate)) AP,
p.current_employee_flag F
FROM per_all_people_f p, per_all_assignments_f a, sm_appl_user@isoft u
where p.person_id = a.PERSON_ID
and trunc(sysdate) between p.effective_start_date and
p.effective_end_date
and (((select s.actual_termination_date
from per_periods_of_service s
where a.PERIOD_OF_SERVICE_ID = s.period_of_service_id) between
a.effective_start_date and a.effective_end_date and
p.current_employee_flag IS NULL) or
(a.assignment_status_type_id in (2095/*Vacation incubation\Unpaid Leave*/, 1095/*Unpaid Leave*/) and
trunc(sysdate) between a.effective_start_date and
a.effective_end_date))
and p.employee_number = u.employee_no
and u.eff_status = 'E'
and u.func_role_id is not null
--and rownum <10
order by 6 desc, 1
`;

export const dbNotVacXUser = `SELECT DISTINCT to_number(p.employee_number) EMPNUM,
p.full_name FN,
kauh_hr_pkg.JOB(a.JOB_ID) JOB,
--to_char(s.actual_termination_date,'dd/mm/rrrr') TD,
--a.assignment_status_type_id,
u.appl_user_id AUI,
u.func_role_id PI
FROM per_all_people_f p, per_all_assignments_f a, sm_appl_user@isoft u
where p.person_id = a.PERSON_ID
and trunc(sysdate) between p.effective_start_date and
p.effective_end_date 
and a.assignment_status_type_id =1 
and trunc(sysdate) between a.effective_start_date and
a.effective_end_date
and p.employee_number = u.employee_no
and u.eff_status <> 'E'
and u.func_role_id is not null
--and rownum <10
order by  1
`;
export const srvMachine = `select count(*) c
from v$session a where upper(a.MACHINE)=upper(:app_srv)`;
export const smsHeat = `select trunc(sysdate - day_map.d) date_,
to_char(trunc(sysdate - day_map.d), 'day') day,
day_map.d d,
day_map.h h,
nvl(msg_log.c, 0) c
from (select day.d d, hour.h h, trunc(sysdate - day.d) || hour.h con_code
   from (select rownum - 1 h
           from (select 4 a
                   from dual
                 union all
                 select 3 a
                   from dual
                 union all
                 select 2 a
                   from dual
                 union all
                 select 1 a
                   from dual
                 union all
                 select 0 a
                   from dual),
                (select 5 a
                   from dual
                 union all
                 select 4 a
                   from dual
                 union all
                 select 3 a
                   from dual
                 union all
                 select 2 a
                   from dual
                 union all
                 select 1 a
                   from dual)
          where rownum < 25) hour,
        (select rownum  d
           from (select 4 a
                   from dual
                 union all
                 select 3 a
                   from dual
                 union all
                 select 2 a
                   from dual
                 union all
                 select 1 a
                   from dual
                 union all
                 select 0 a
                   from dual),
                (select 5 a
                   from dual
                 union all
                 select 4 a
                   from dual
                 union all
                 select 3 a
                   from dual
                 union all
                 select 2 a
                   from dual
                 union all
                 select 1 a
                   from dual)
          where rownum < 8) day) day_map,
(select trunc(a.request_date) d,
        to_char(a.request_date, 'hh24') h,
        count(*) c,
        trunc(a.request_date) ||
        to_number(to_char(a.request_date, 'hh24')) con_code
   from kauh_sms_log a
  where a.request_date > trunc(sysdate) - 7
  group by trunc(a.request_date), to_char(a.request_date, 'hh24')) msg_log
where day_map.con_code = msg_log.con_code(+)
order by day_map.d, day_map.h`;

export const dbAwrSnapId = `select snap_id SNAPID,
to_char(begin_interval_time, 'rrrr/mm/dd hh24:mi:ss') BEGIN
from dba_hist_snapshot a,v$instance i
where i.INSTANCE_NUMBER=a.instance_number
and begin_interval_time>sysdate-1
order by to_char(begin_interval_time, 'rr/mm/dd hh24:mi:ss') desc`;

export const dbLogSwitch = `select to_char(a.date_,'day') day,a.* from (
SELECT trunc(first_time) date_,
       to_char(sum(decode(to_char(first_time, 'HH24'), '00', 1, 0)), '99') "h00",
       to_char(sum(decode(to_char(first_time, 'HH24'), '01', 1, 0)), '99') "h01",
       to_char(sum(decode(to_char(first_time, 'HH24'), '02', 1, 0)), '99') "h02",
       to_char(sum(decode(to_char(first_time, 'HH24'), '03', 1, 0)), '99') "h03",
       to_char(sum(decode(to_char(first_time, 'HH24'), '04', 1, 0)), '99') "h04",
       to_char(sum(decode(to_char(first_time, 'HH24'), '05', 1, 0)), '99') "h05",
       to_char(sum(decode(to_char(first_time, 'HH24'), '06', 1, 0)), '99') "h06",
       to_char(sum(decode(to_char(first_time, 'HH24'), '07', 1, 0)), '99') "h07",
       to_char(sum(decode(to_char(first_time, 'HH24'), '08', 1, 0)), '99') "h08",
       to_char(sum(decode(to_char(first_time, 'HH24'), '09', 1, 0)), '99') "h09",
       to_char(sum(decode(to_char(first_time, 'HH24'), '10', 1, 0)), '99') "h10",
       to_char(sum(decode(to_char(first_time, 'HH24'), '11', 1, 0)), '99') "h11",
       to_char(sum(decode(to_char(first_time, 'HH24'), '12', 1, 0)), '99') "h12",
       to_char(sum(decode(to_char(first_time, 'HH24'), '13', 1, 0)), '99') "h13",
       to_char(sum(decode(to_char(first_time, 'HH24'), '14', 1, 0)), '99') "h14",
       to_char(sum(decode(to_char(first_time, 'HH24'), '15', 1, 0)), '99') "h15",
       to_char(sum(decode(to_char(first_time, 'HH24'), '16', 1, 0)), '99') "h16",
       to_char(sum(decode(to_char(first_time, 'HH24'), '17', 1, 0)), '99') "h17",
       to_char(sum(decode(to_char(first_time, 'HH24'), '18', 1, 0)), '99') "h18",
       to_char(sum(decode(to_char(first_time, 'HH24'), '19', 1, 0)), '99') "h19",
       to_char(sum(decode(to_char(first_time, 'HH24'), '20', 1, 0)), '99') "h20",
       to_char(sum(decode(to_char(first_time, 'HH24'), '21', 1, 0)), '99') "h21",
       to_char(sum(decode(to_char(first_time, 'HH24'), '22', 1, 0)), '99') "h22",
       to_char(sum(decode(to_char(first_time, 'HH24'), '23', 1, 0)), '99') "h23"
  from v$log_history
  where first_time>trunc(sysdate)-6
  and  thread#=(select thread# from v$instance)
 GROUP by trunc(first_time)) a
 order by date_`;
