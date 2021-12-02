/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2021/11/26 9:07:59                           */
/*==============================================================*/


drop table if exists activity;

drop table if exists lemon;

drop table if exists sys_file;

drop table if exists sys_vcode;

drop table if exists sys_weather;

drop table if exists type;

drop table if exists user;

/*==============================================================*/
/* Table: activity                                              */
/*==============================================================*/
create table activity
(
   id                   varchar(32) not null,
   activity             varchar(32),
   lemon_id             varchar(32),
   primary key (id)
);

/*==============================================================*/
/* Table: lemon                                                 */
/*==============================================================*/
create table lemon
(
   id                   varchar(32) not null,
   ddate                date,
   mood                 varchar(32),
   sleep                int,
   note                 text,
   photo                varchar(512),
   user_id              varchar(32),
   activity             text,
   create_at            datetime,
   primary key (id)
);

/*==============================================================*/
/* Table: sys_file                                              */
/*==============================================================*/
create table sys_file
(
   id                   varchar(64) not null,
   file_name            text,
   file_orig_name       text,
   file_type            varchar(32),
   file_size            bigint,
   file_url             text,
   file_path            text,
   file_date            datetime,
   remark               text,
   primary key (id)
);

/*==============================================================*/
/* Table: sys_vcode                                             */
/*==============================================================*/
create table sys_vcode
(
   id                   varchar(32) not null,
   user_code            varchar(32),
   vcode                varchar(32),
   create_at            datetime,
   primary key (id)
);

/*==============================================================*/
/* Table: sys_weather                                           */
/*==============================================================*/
create table sys_weather
(
   id                   varchar(32) not null,
   city                 varchar(256),
   country              varchar(256),
   temp                 float,
   weather              varchar(256),
   weather_img          varchar(512),
   ddate                date,
   create_at            datetime,
   primary key (id)
);

/*==============================================================*/
/* Table: type                                                  */
/*==============================================================*/
create table type
(
   code                 varchar(32) not null,
   name                 varchar(64),
   icon                 varchar(512),
   category             varchar(64),
   primary key (code)
);

/*==============================================================*/
/* Table: user                                                  */
/*==============================================================*/
create table user
(
   id                   varchar(32) not null,
   user_code            varchar(32),
   user_pwd             varchar(32),
   user_type            varchar(32),
   user_name            varchar(32),
   user_head            varchar(256),
   safe_email           varchar(256),
   safe_email_code      varchar(32),
   register_date        datetime,
   login_date           datetime,
   token                varchar(32),
   location             varchar(128),
   primary key (id)
);

alter table activity add constraint FK_ref_activity_lemon foreign key (lemon_id)
      references lemon (id) on delete restrict on update restrict;

alter table activity add constraint FK_ref_activity_type foreign key (activity)
      references type (code) on delete restrict on update restrict;

alter table lemon add constraint FK_ref_lemon_type foreign key (mood)
      references type (code) on delete restrict on update restrict;

alter table lemon add constraint FK_ref_lemon_user foreign key (user_id)
      references user (id) on delete restrict on update restrict;

