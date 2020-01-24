--liquibase formatted sql

--changeset o.sukhotskyi:1
drop table if exists test;
drop sequence if exists test_sequence;

--changeset o.sukhotskyi:2
create table item_group (
    id serial primary key not null,
    name varchar(100) not null,
    description varchar(500)
);

--changeset o.sukhotskyi:3
insert into item_group(description,name) values ('We need to process your data to provide the following services:','Purpose');
insert into item_group(description,name) values ('Depending on the functionality we may need to process one or more data categories:','Data');
insert into item_group(description,name) values ('Depending on the functionality we will store your data on:','Storage');
insert into item_group(description,name) values ('Depending on the functionality we may need to share your data with:','Sharing');
insert into item_group(description,name) values ('Depending on the functionality we will process your data in the following way:','Processing');

--changeset o.sukhotskyi:4
create table item (
    id serial primary key not null,
    item_group_id bigint not null references item_group (id),
    name varchar(100) not null
);

--changeset o.sukhotskyi:5
INSERT INTO item(name,item_group_id) VALUES ('Display resting heart rate', 1);
INSERT INTO item(name,item_group_id) VALUES ('Display all day heart rate', 1);
INSERT INTO item(name,item_group_id) VALUES ('Display route on map', 1);
INSERT INTO item(name,item_group_id) VALUES ('Display pointwise velocity on a map', 1);
INSERT INTO item(name,item_group_id) VALUES ('Derive race time predictions', 1);
INSERT INTO item(name,item_group_id) VALUES ('Derive calories burned', 1);
INSERT INTO item(name,item_group_id) VALUES ('Derive cardio fitness score', 1);
INSERT INTO item(name,item_group_id) VALUES ('Enable a recovery adviser to advise when to start the next workout', 1);
INSERT INTO item(name,item_group_id) VALUES ('Improve service provider''s products and services', 1);
INSERT INTO item(name,item_group_id) VALUES ('Enable targeted fitness advertisement', 1);
INSERT INTO item(name,item_group_id) VALUES ('Back up data', 1);
INSERT INTO item(name,item_group_id) VALUES ('Resting heart rate', 2);
INSERT INTO item(name,item_group_id) VALUES ('Activity heart rate', 2);
INSERT INTO item(name,item_group_id) VALUES ('Sleep Time', 2);
INSERT INTO item(name,item_group_id) VALUES ('Steps', 2);
INSERT INTO item(name,item_group_id) VALUES ('Distance', 2);
INSERT INTO item(name,item_group_id) VALUES ('GPS coordinates', 2);
INSERT INTO item(name,item_group_id) VALUES ('Age', 2);
INSERT INTO item(name,item_group_id) VALUES ('Gender', 2);
INSERT INTO item(name,item_group_id) VALUES ('Weight', 2);
INSERT INTO item(name,item_group_id) VALUES ('Activity duration', 2);
INSERT INTO item(name,item_group_id) VALUES ('On the device', 3);
INSERT INTO item(name,item_group_id) VALUES ('On 3rd parties'' infrustructures', 3);
INSERT INTO item(name,item_group_id) VALUES ('On BeFit'' infrustructures', 3);
INSERT INTO item(name,item_group_id) VALUES ('On-Device calculations.', 5);
INSERT INTO item(name,item_group_id) VALUES ('BeFit''s calculations.', 5);
INSERT INTO item(name,item_group_id) VALUES ('Google calculations.', 5);
INSERT INTO item(name,item_group_id) VALUES ('Axiom calculations.', 5);
INSERT INTO item(name,item_group_id) VALUES ('Dropbox calculations.', 5);
INSERT INTO item(name,item_group_id) VALUES ('Runkeeper calculations.', 5);
INSERT INTO item(name,item_group_id) VALUES ('Google', 4);
INSERT INTO item(name,item_group_id) VALUES ('Axiom', 4);
INSERT INTO item(name,item_group_id) VALUES ('Dropbox', 4);
INSERT INTO item(name,item_group_id) VALUES ('Runkeeper', 4);

--changeset o.sukhotskyi:6
create table item_graph (
    child_item_id bigint not null references item (id),
    parent_item_id bigint not null references item (id),
    primary key (child_item_id, parent_item_id)
);

--changeset o.sukhotskyi:7
insert into item_graph(child_item_id, parent_item_id) values (12, 1 );
insert into item_graph(child_item_id, parent_item_id) values (13, 2 );
insert into item_graph(child_item_id, parent_item_id) values (14, 5 );
insert into item_graph(child_item_id, parent_item_id) values (15, 5 );
insert into item_graph(child_item_id, parent_item_id) values (16, 9 );
insert into item_graph(child_item_id, parent_item_id) values (17, 3 );
insert into item_graph(child_item_id, parent_item_id) values (18, 7 );
insert into item_graph(child_item_id, parent_item_id) values (19, 9 );
insert into item_graph(child_item_id, parent_item_id) values (20, 8 );
insert into item_graph(child_item_id, parent_item_id) values (21, 11);
insert into item_graph(child_item_id, parent_item_id) values (22, 12);
insert into item_graph(child_item_id, parent_item_id) values (23, 15);
insert into item_graph(child_item_id, parent_item_id) values (24, 16);
insert into item_graph(child_item_id, parent_item_id) values (25, 22);
insert into item_graph(child_item_id, parent_item_id) values (26, 24);
insert into item_graph(child_item_id, parent_item_id) values (27, 31);
insert into item_graph(child_item_id, parent_item_id) values (28, 32);
insert into item_graph(child_item_id, parent_item_id) values (29, 33);
insert into item_graph(child_item_id, parent_item_id) values (30, 34);
insert into item_graph(child_item_id, parent_item_id) values (31, 23);
insert into item_graph(child_item_id, parent_item_id) values (32, 23);
insert into item_graph(child_item_id, parent_item_id) values (33, 23);
insert into item_graph(child_item_id, parent_item_id) values (34, 23);
insert into item_graph(child_item_id, parent_item_id) values (12, 2 );
insert into item_graph(child_item_id, parent_item_id) values (13, 6 );
insert into item_graph(child_item_id, parent_item_id) values (14, 9 );
insert into item_graph(child_item_id, parent_item_id) values (15, 6 );
insert into item_graph(child_item_id, parent_item_id) values (16, 8 );
insert into item_graph(child_item_id, parent_item_id) values (17, 4 );
insert into item_graph(child_item_id, parent_item_id) values (18, 9 );
insert into item_graph(child_item_id, parent_item_id) values (19, 8 );
insert into item_graph(child_item_id, parent_item_id) values (20, 9 );
insert into item_graph(child_item_id, parent_item_id) values (21, 10);
insert into item_graph(child_item_id, parent_item_id) values (22, 13);
insert into item_graph(child_item_id, parent_item_id) values (23, 16);
insert into item_graph(child_item_id, parent_item_id) values (24, 18);
insert into item_graph(child_item_id, parent_item_id) values (13, 7 );
insert into item_graph(child_item_id, parent_item_id) values (15, 8 );
insert into item_graph(child_item_id, parent_item_id) values (16, 6 );
insert into item_graph(child_item_id, parent_item_id) values (17, 10);
insert into item_graph(child_item_id, parent_item_id) values (19, 7 );
insert into item_graph(child_item_id, parent_item_id) values (20, 10);
insert into item_graph(child_item_id, parent_item_id) values (21, 9 );
insert into item_graph(child_item_id, parent_item_id) values (22, 14);
insert into item_graph(child_item_id, parent_item_id) values (23, 18);
insert into item_graph(child_item_id, parent_item_id) values (13, 9 );
insert into item_graph(child_item_id, parent_item_id) values (15, 9 );
insert into item_graph(child_item_id, parent_item_id) values (16, 5 );
insert into item_graph(child_item_id, parent_item_id) values (17, 9 );
insert into item_graph(child_item_id, parent_item_id) values (20, 7 );
insert into item_graph(child_item_id, parent_item_id) values (21, 8 );
insert into item_graph(child_item_id, parent_item_id) values (22, 15);
insert into item_graph(child_item_id, parent_item_id) values (23, 19);
insert into item_graph(child_item_id, parent_item_id) values (21, 6 );
insert into item_graph(child_item_id, parent_item_id) values (23, 20);
insert into item_graph(child_item_id, parent_item_id) values (23, 17);
insert into item_graph(child_item_id, parent_item_id) values (23, 21);