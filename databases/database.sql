create database library;

create table users(
    id serial PRIMARY KEY,
    name text UNIQUE NOT NULL,
    password text NOT NULL,
    email text UNIQUE NOT NULL,
    phone text UNIQUE NOT NULL,
    profileimgurl text NOT NULL
);

create table videos(
    id serial PRIMARY KEY NOT NULL,
    author_id serial NOT NULL,
    author_name text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    location text NOT NULL,
    public bit NOT NULL,
    url text UNIQUE NOT NULL,
    likes serial,
    dislikes serial
);

create table requests(
    id serial PRIMARY KEY NOT NULL,
    senderid serial NOT NULL,
    receiverid serial NOT NULL
);

create table comments(
    id serial PRIMARY KEY NOT NULL,
    author_id serial NOT NULL,
    author_name text NOT NULL,
    video_id serial NOT NULL,
    comment text NOT NULL
);

create table opinions(
    id serial PRIMARY KEY NOT NULL,
    author_id serial NOT NULL,
    author_name text NOT NULL,
    video_id serial NOT NULL,
    positive_opinion BOOLEAN NOT NULL
);

//OPINION
{
	"author_id" : 1,
	"author_name" : "Santiago Beroch",
	"video_id": 1,
	"positive_opinion": true
}

Comments
{
	"author_id" : 1,
	"author_name" : "Santiago Beroch",
	"video_id": 1,
	"comment": true
}

USER
{
	"name" : "Franco Giordano",
	"password" : "goto_password",
	"email": "franki_pelado@gmail.com",
	"phone": "xdd",
	"profileimgurl": "https://firebasestorage.googleapis.com/v0/b/chotuve-467b2.appspot.com/o/images%2Ffranki.jpg?alt=media&token=1aa11c1f-e684-4b5e-8bd5-52f305c989de"
}

VIDEO
{
	"author_id": 1,
	"author_name" : "Santiago Beroch",
	"title" : "Tumbando asdel club",
	"description": "TEMasdUCO",
	"location": "EN EL CasdLUB",
	"public": true,
	"url": "asd"
}