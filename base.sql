DROP TABLE IF EXISTS Avis;
DROP TABLE IF EXISTS RendezVous;
DROP TABLE IF EXISTS Coiffeur;
DROP TABLE IF EXISTS Favoris;
DROP TABLE IF EXISTS Client;
DROP TABLE IF EXISTS Salon;
create table Salon(
    idSalon Integer primary key,
    Nom String,
    adresse String,
    Horaire String
);

create table Client(
    idClient Integer primary key,
    Nom String,
    adresseCourriel String,
    numeroDeTelephone String,
    password String
);

create table Coiffeur(
    idCoiffeur Integer primary key,
    idSalon Integer references Salon(idSalon),
    Nom String,
    adresseCourriel String,
    numeroDeTelephone String,
    password String,
    Services String,
    pdp String;
);



create table RendezVous(
    idRendezVous Integer primary key,
    idClient Integer references Client(idClient),
    idCoiffeur Integer references Coiffeur(idCoiffeur),
    idSalon Integer references Salon(idSalon),
    Date date,
    Heure time,
    Prix Integer
);


create table Avis(
    idAvis Integer primary key,
    idRdv Integer references RendezVous(idRendezVous),
    Avis String,
    DateAvis String
);


create table Favoris(
    idFavoris Integer primary key,
    idClient Integer references Client(idClient),
    idCoiffeur Integer references Coiffeur(idCoiffeur)
);

create table Porfolio(
    idPorfolio Integer primary key,
    idCoiffeur Integer references Coiffeur(idCoiffeur),
    url String,
    Description String
);

create table blocklist(
    idblocklist Integer primary key,
    idClient Integer references Client(idClient),
    idCoiffeur Integer references Coiffeur(idCoiffeur)
);
