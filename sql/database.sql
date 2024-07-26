create database if not exists `bienesraices`;

create table users (
id serial primary key,
name varchar(60) not null,
email varchar(60) not null unique,
password varchar(60) not null,
token varchar(60),
confirm boolean,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp on update current_timestamp
);

alter table users add column create_at timestamp default current_timestamp;
alter table users add column update_at timestamp default current_timestamp on update current_timestamp;

create table users (
id serial primary key,
name varchar(60) not null,
email varchar(60) not null unique,
password varchar(60) not null,
token varchar(60),
confirm boolean,
create_at timestamp default current_timestamp,
update_at timestamp default current_timestamp
);

create table propiedades(
id varchar(30) primary key,
title varchar(100) not null,
description text not null,
rooms int not null,
parking int not null,
wc int not null,
street varchar(60) not null,
lat varchar,
lng varchar,
image varchar(60),
published boolean default false
create_at timestamp default current_timestamp,
update_at timestamp default current_timestamp
);

create table categories (
id serial primary key,
name varchar(60)
)

create table price (
id serial primary key,
price numeric(10, 2)
);

INSERT INTO public.propiedades (id,title,description,rooms,parking,wc,street,lat,lng,published,image,precio_id,user_id,category_id) VALUES
	 ('k0kg4jzxmaocjwgj1p68cv','Casa en la playa','descripcion',3,2,2,'Avenida Comandante San Martín','-18.490009204066','-70.327067808712',false,NULL,6,2,3),
	 ('2ghe2597acas58hv9b56o','Condominio Bosque Azapa','descripcion',1,2,1,'Pasaje Rahue 2180','-18.490394502175','-70.297660459903',true,'/uploads/49de6bbe.png',7,1,3),
	 ('f710jqlv09ao9u1bcl5ea','once de septiembre','desc',3,3,2,'Calle Curinanco','-18.486313027185','-70.310701598632',true,'/uploads/333331e5.png',9,1,4),
	 ('bnvrguv4uz75eo54h8vgxn','valle alto','descripcion',3,2,2,'Calle Pedro Aguirre Cerda 1938','-18.478689886852','-70.301234168141',true,'/uploads/0e39935f.png',8,1,5),
	 ('f6hyuvsiw0kpe2l4anztvd','orinoquia','descripcion',4,2,2,'Pasaje Angelmó','-18.490393027738','-70.293127796087',true,'/uploads/17884984.png',2,1,2),
	 ('6leht1rcdm4asg3klh87v','Rio Bueno','descripcion',2,2,2,'Pasaje Navidad 418','-18.488045096625','-70.309809860918',true,'/uploads/abc8cfdb.png',10,1,3),
	 ('4oaqhv8ahpxj55d5itk5wl','Casa modificada','Des modificada',2,1,2,'Pasaje Olivarera de Azapa 2221','-18.480887999051','-70.292637436787',false,'/uploads/68b26ebe.png',2,2,3),
	 ('af6r1xn2a4m70bdv01j56w','La Francia','descripcion',2,2,3,'Pasaje Pachama 2306','-18.474894603004','-70.29139750185',true,'/uploads/31204aa1.png',1,1,1),
	 ('85inhu5z59thqy3uydrhil','Tulipan 21','desc',2,3,3,'Avenida Tucapel 259','-18.497362587833','-70.299132825015',true,'/uploads/4cd3c7d4.png',3,1,2),
	 ('0ugw8wap61yx0r5icsny9','Casa Lisboa','descripcion lisboa',1,3,3,'Calle Senador Humberto Manuel Palza Corvacho','-18.495302767253','-70.270193297184',true,'/uploads/10e9a56b.png',3,1,3);
INSERT INTO public.propiedades (id,title,description,rooms,parking,wc,street,lat,lng,published,image,precio_id,user_id,category_id) VALUES
	 ('wwzpt0oaotcdqfx3uqknnr','Casa en Chinchorro','Casa cerca de l aplaya',3,2,1,'Pasaje José Toribio Medina 448','-18.453728411558','-70.297499108267',true,'/uploads/9434ae02.png',4,1,3),
	 ('9js32ibqeewxa9jwemhtp','Casa Playa Lisera','Casa cerca de la mejor playa de la cuidad',3,2,2,'Avenida Comandante Juan José de San Martín','-18.492602749121','-70.325939222712',true,'/uploads/4df324c3.png',8,1,3),
	 ('vm8u9ndhusehbm45ini1e','Casa en Azapa','casa en Azapa muy cerca d elos colegios',3,2,2,'Avenida Senador Humberto Manuel Palza Corvacho 42','-18.490453594593','-70.285495384729',true,'/uploads/c8fd4fd0.png',5,1,4),
	 ('z5rbw5i12in1c8iooov7n','Condominio Novo Azapa','Apartamento frente a la piscina',2,1,2,'Avenida Alcalde Manuel Castillo Ibaceta 2925','-18.493692697256','-70.287333284639',true,'/uploads/a5ca154a.png',5,1,3),
	 ('n7okql6gba6m5fy0q79y','Condominio Neo Azapa','Cerca del Agro',2,2,1,'Avenida Alcalde Manuel Castillo Ibaceta 3339','-18.497083638721','-70.286305181273',true,'/uploads/cb630a7a.png',6,1,3);

	 CREATE TABLE message (
    id serial PRIMARY KEY,
    message varchar(200) NOT NULL,
    user_id int REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    property_id varchar REFERENCES propiedades(id) ON DELETE CASCADE ON UPDATE CASCADE,
    createAt timestamp DEFAULT now(),
    updateAt timestamp DEFAULT now()
);