create database library;

create table users(
    id serial PRIMARY KEY,
    img_id serial UNIQUE NOT NULL,
    last_login DATE NOT NULL DEFAULT NOW;
);

create table searches(
    id serial PRIMARY KEY,
    word text NOT NULL CHECK (word <> '' AND word <> ' '),
    amount integer DEFAULT 0
);

create table videos(
    id serial PRIMARY KEY NOT NULL,
    author_id serial NOT NULL,
    author_name text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    location text NOT NULL,
    public_video boolean NOT NULL,
    likes serial,
    dislikes serial,
    views serial,
    upload_date DATE NOT NULL DEFAULT NOW;
);

create table urls(
    id serial PRIMARY KEY NOT NULL,
    url text NOT NULL
);

create table requests(
    id serial PRIMARY KEY NOT NULL,
    sender_id serial NOT NULL,
    receiver_id serial NOT NULL
);

create table comments(
    id serial PRIMARY KEY NOT NULL,
    author_id serial NOT NULL,
    author_name text NOT NULL,
    video_id serial NOT NULL,
    comment text NOT NULL
);

create table tokens(
    id serial PRIMARY KEY NOT NULL,
    user_id serial UNIQUE NOT NULL,
    token text NOT NULL
);

create table reactions(
    id serial PRIMARY KEY NOT NULL,
    author_id serial NOT NULL,
    author_name text NOT NULL,
    video_id serial NOT NULL,
    positive_reaction BOOLEAN NOT NULL
);

create table messages(
    id serial PRIMARY KEY NOT NULL,
    sender_id serial NOT NULL,
    receiver_id serial NOT NULL,
    message text NOT NULL,
    time text NOT NULL
);

create table urls(
    id serial PRIMARY KEY NOT NULL,
    url text NOT NULL
);

create table http_requests(
    id serial PRIMARY KEY NOT NULL,
    method text NOT NULL,
    url text NOT NULL,
    status text NOT NULL,
    res_length integer NOT NULL,
    res_time float NOT NULL,
    upload_date DATE NOT NULL DEFAULT NOW()
);


//Reaction
{
	"author_id" : 23,
	"author_name" : "Santiago Beroch",
	"video_id": 85,
	"positive_reaction": true
}

Comments
{
	"author_id" : 23,
	"author_name" : "Santiago Beroch",
	"video_id": 85,
	"comment": "Wenardo"
}

USER
{
	"name" : "Alvaro Iribarren",
	"email": "asd@asd.com",
	"phone": "dasd",
	"sign_in_method": "google",
	"img_url": "hddsdttps://firdsdsebasestorage.googleapis.com/v0/b/chotuve-467b2.appspot.com/o/images%2Ffranki.jpg?alt=media&token=1aa11c1f-e684-4b5e-8bd5-52f305c989de",
	"img_uuid" : "asddasdsdadsdds",
	"firebase_token" : "asdasdsadas"
}

VIDEO
{
	"author_id": 1,
	"author_name" : "Santiago Beroch",
	"title" : "Tumbando asdel club",
	"description": "TEMasdUCO",
	"location": "EN EL CasdLUB",
	"public_video": true,
	"url": "asd",
	"uuid": "asdasd"
}

Messages
{
    "sender_id" : 2,
	"receiver_id" : 1,
	"message": "TEMasdUCO",
}




TEXT {
    insert into text values (1, '');
}