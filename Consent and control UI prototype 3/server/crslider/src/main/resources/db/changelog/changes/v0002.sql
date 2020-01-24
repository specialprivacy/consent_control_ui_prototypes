--liquibase formatted sql

--changeset o.user:1
create table questionnaire (
    id serial primary key not null,
    code varchar(10) not null,
    question_code varchar(200) not null,
    answer text
);

--changeset o.user:2
alter table questionnaire add user_uid varchar(68);

--changeset o.user:3
alter table questionnaire drop column code;
alter table questionnaire add code varchar(50);

--changeset o.user:4
alter table questionnaire drop column question_code;
alter table questionnaire add question_code varchar(50);

--changeset o.user:5
alter table item add name_de varchar(200);
UPDATE item SET name_de = 'Die Ruheherzfrequenz anzeigen' WHERE id = 1;
UPDATE item SET name_de = 'Gesamte Tagesherzfrequenz anzeigen' WHERE id = 2;
UPDATE item SET name_de = 'Die Route auf der Karte anzeigen' WHERE id = 3;
UPDATE item SET name_de = 'Punktweise Geschwindigkeit auf der Karte anzeigen' WHERE id = 4;
UPDATE item SET name_de = 'Rennzeitvorhersagen ableiten' WHERE id = 5;
UPDATE item SET name_de = 'Verbrennte Kalorien ableiten' WHERE id = 6;
UPDATE item SET name_de = 'Cardio(Herz)-Fitness Punkte ableiten' WHERE id = 7;
UPDATE item SET name_de = 'Einen Recovery-Berater aktivieren, um Ratschlaege zu bkommen, wann das naechste Training beginnen soll' WHERE id = 8;
UPDATE item SET name_de = 'Die Produkte und Dienstleistungen des Service-Providers verbessern' WHERE id = 9;
UPDATE item SET name_de = 'Gezielte Fitnesswerbung aktivieren' WHERE id = 10;
UPDATE item SET name_de = 'Daten sichern' WHERE id = 11;

--changeset o.user:6
UPDATE item SET name_de = 'Ruheherzfrequenz' WHERE id = 12;
UPDATE item SET name_de = 'Aktivitaetherzfrequenz' WHERE id = 13;
UPDATE item SET name_de = 'Schlafzeit' WHERE id = 14;
UPDATE item SET name_de = 'Schritte' WHERE id = 15;
UPDATE item SET name_de = 'Distaz' WHERE id = 16;
UPDATE item SET name_de = 'GPS Koordinaten' WHERE id = 17;
UPDATE item SET name_de = 'Alter' WHERE id = 18;
UPDATE item SET name_de = 'Geschlecht' WHERE id = 19;
UPDATE item SET name_de = 'Gewicht' WHERE id = 20;
UPDATE item SET name_de = 'Aktivitaetsdauer' WHERE id = 21;
UPDATE item SET name_de = 'Auf dem Geraet' WHERE id = 22;
UPDATE item SET name_de = 'Auf den Infrastrukturen von Drittanbietern' WHERE id = 23;
UPDATE item SET name_de = 'Auf den Infrastrukturen von BeFit' WHERE id = 24;
UPDATE item SET name_de = 'Die Berechnungen auf dem Geraet' WHERE id = 25;
UPDATE item SET name_de = 'BeFit-Berechnungen' WHERE id = 26;
UPDATE item SET name_de = 'Google-Berechnungen' WHERE id = 27;
UPDATE item SET name_de = 'Axiom-Berechnungen' WHERE id = 28;
UPDATE item SET name_de = 'Dropbox-Berechnungen' WHERE id = 29;
UPDATE item SET name_de = 'Runkeeper-Berechnungen' WHERE id = 30;
UPDATE item SET name_de = 'Google' WHERE id = 31;
UPDATE item SET name_de = 'Axiom' WHERE id = 32;
UPDATE item SET name_de = 'Dropbox' WHERE id = 33;
UPDATE item SET name_de = 'Runkeeper' WHERE id = 34;

--changeset o.user:7
create table preferences (
    id serial primary key not null,
    user_uid varchar(68) not null,
    value text
);