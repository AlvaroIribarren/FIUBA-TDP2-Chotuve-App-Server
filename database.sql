create database library;

create table books(
    section int,
    title text,
    author text
);

insert into books values
    (2, 'N2', 'A2'),
    (3, 'N3', 'A3');

create table users(
    id serial PRIMARY KEY,
    username text UNIQUE NOT NULL,
    password text NOT NULL
);

insert into users values
    (1, 'Alvaro', 'a123'),
    ('Juan', 'j123'),
    ('Pedro', 'p123');

