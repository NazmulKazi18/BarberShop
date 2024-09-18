const bcrypt = require('bcryptjs');
const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const cookieParser = require("cookie-parser");
const auth = require("./auth")
app.use(express.static('public'));
app.use(cookieParser());
app.use('/client', express.static('client'));
app.use('/coiffeur', express.static('coiffeur'));
const port = 3000;
const Token_secret_key = 'oui';
const db = require('./db');
app.use(bodyParser.json());
const getSecretKey = () => {
return Token_secret_key;
};
exports.getSecretKey = getSecretKey
//--GENERER LE TOKEN
function generateAccessToken(email) {
return jwt.sign(email, Token_secret_key, { expiresIn: '1800s' });
}

//--------------------ROUTE POUR DIRECTION-----------------------------------------------------------// 

app.get("/", (req,res) => {
res.sendFile(path.join(__dirname, "public", "site.html"))
})


app.get("/connexion", (req,res) => {
res.sendFile(path.join(__dirname, "public", "connexion.html"))
})


app.get("/creation", (req,res) => {
res.sendFile(path.join(__dirname, "public", "creation.html"))
})
app.get("/client",auth(), (req,res) => {
res.sendFile(path.join(__dirname, "client", "client.html"))
})
app.get("/rdv",auth(), (req,res) => {
res.sendFile(path.join(__dirname, "client", "rdv.html"))
})

app.get("/historique",auth(), (req,res) => {
res.sendFile(path.join(__dirname, "client", "historique.html"))
})


app.get("/favoris",auth(), (req,res) => {
res.sendFile(path.join(__dirname, "client", "favoris.html"))
})


app.get("/coiffeur",auth(), (req,res) => {
res.sendFile(path.join(__dirname, "coiffeur", "coiffeur.html"))
})

app.listen(3000, () => {
console.log("Serveur en cours d'execution sur le port 3000")
})

app.get("/client/details",auth(), (req,res) => {
res.sendFile(path.join(__dirname, "client", "details.html"))
})

app.get("/client/blocked",auth(), (req,res) => {
  res.sendFile(path.join(__dirname, "client", "blocked.html"))
  })

app.get("/coiffeur/Avis",auth(), (req,res) => {
res.sendFile(path.join(__dirname, "coiffeur", "Avis.html"))
})
app.get("/coiffeur/Rdv",auth(), (req,res) => {
res.sendFile(path.join(__dirname, "coiffeur", "Rdv.html"))
})
app.get("/coiffeur/Dispo",auth(), (req,res) => {
res.sendFile(path.join(__dirname, "coiffeur", "Dispo.html"))
})

app.get("/coiffeur/historique",auth(), (req,res) => {
  res.sendFile(path.join(__dirname, "coiffeur", "historiqueCoiffeur.html"))
})

app.get("/coiffeur/porfolio",auth(), (req,res) => {
  res.sendFile(path.join(__dirname, "coiffeur", "porfolio.html"))
})

app.get("/supprimerPhoto",auth(), (req,res) => {
  res.sendFile(path.join(__dirname, "coiffeur", "supprimerPhoto.html"))
})

app.get("/coiffeur/blocklist",auth(), (req,res) => {
  res.sendFile(path.join(__dirname, "coiffeur", "blocklist.html"))
})
  

app.get("/avis",auth(), (req,res) => {
res.sendFile(path.join(__dirname, "client", "avis.html"))
})



//--------------------ROUTE POUR CE CREEER UN COMPTE-----------------------------------------------------------// 
//sngi clien
app.post('/signupClient', async (req, res) => {
try {
const user ={idClient,
  Nom,
  adresseCourriel,
  numeroDeTelephone,
  password } = req.body;


// Hasher le mot de passe
const hashedPassword = await bcrypt.hash(password, 10);

// Enregistrer l'utilisateur dans la base de donnÃ©es
await db('Client').insert({
  idClient,
  Nom,
  adresseCourriel,
  numeroDeTelephone,
  password:hashedPassword
});
res.status(201).json({ message: 'User created successfully' });
} catch (error) {
console.error(error);
res.status(500).json({ error: 'An error occurred' });
}
});


//sign coiffeur
app.post('/signupCoiffeur', async (req, res) => {
try {
const user ={idCoiffeur,
  Nom,
  adresseCourriel,
  numeroDeTelephone,
  password } = req.body;


// Hasher le mot de passe
const hashedPassword = await bcrypt.hash(password, 10);

// Enregistrer l'utilisateur dans la base de donnÃ©es
await db('Coiffeur').insert({
  idCoiffeur,
  Nom,
  adresseCourriel,
  numeroDeTelephone,
  password:hashedPassword
});
res.status(201).json({ message: 'User created successfully' });
} catch (error) {
console.error(error);
res.status(500).json({ error: 'An error occurred' });
}
});





//--------------------ROUTE POUR CE CONNECTER-----------------------------------------------------------//
//log client
app.post('/loginClient', async(req,res)=>{
try{
const{email,password}=req.body
const user= await db('Client').select('*').where({adresseCourriel:email})
if(!user){
    return res.status(401).json({message:'user nexiste pas(invalide Username/Password)...!'})
}

if (!(await bcrypt.compare(password,user[0].password) ) ){
    return res.status(401).json({message:'user nexiste pas(invalide Username/Password)...!'})
}

//generer un token car le username et le mdp concorde
const token = generateAccessToken({ email});
userId = user[0].idClient
return res
.cookie("token", token, {
httpOnly: true,
})
.cookie("userID",userId)
.status(200).json({ message: "Logged in successfully 😊 👌" });
} catch (error) {
res.status(500).json({error:'erreur lors de la connexion..!!!'})
}
});

//log coiffeur
app.post('/loginCoiffeur', async(req,res)=>{
try{
const{email,password}=req.body
const user= await db('Coiffeur').select('*').where({adresseCourriel:email})
if(!user){
    return res.status(401).json({message:'user nexiste pas(invalide Username/Password)...!'})
}

if (!(await bcrypt.compare(password,user[0].password) ) ){
    return res.status(401).json({message:'user nexiste pas(invalide Username/Password)...!'})
}

//generer un token car le username et le mdp concorde
const token = generateAccessToken({ email});
coiffeurId = user[0].idCoiffeur
return res
.cookie("token", token, {
httpOnly: true,
})
.cookie("coiffeurId",coiffeurId)
.status(200).json({ message: "Logged in successfully 😊 👌" });
} catch (error) {
res.status(500).json({error:'erreur lors de la connexion..!!!'})
}
});

app.get("/logout", (req, res) => {
console.log("Successfully logged out 😏 🍀")
return res
.clearCookie("token")
.status(200)
.redirect('/');
});

//--------------------ROUTE POUR OBTENIR-----------------------------------------------------------//

//obtenir les coiffeur
app.get('/AllCoiffeur',auth(), async (req, res) => {
try {
const coiffeurs = await db("Coiffeur")
.select("idCoiffeur", "Salon.Nom as NomSalon","Coiffeur.Nom","adresseCourriel","numeroDeTelephone","password","pdp")
.leftJoin("Salon", "Coiffeur.idSalon", "Salon.idSalon");

res.status(201).json({ coiffeurs });
} catch (error) {
console.log(error);
res.status(500).json({ error: "Erreur lors de la récupération des coiffeurs" });
}
});

//obtenir les salons
app.get('/AllSalon',auth(), async(req,res)=>{
try{
//enregistrer l'ideee
const coiffeur =await db("Salon").select('Nom')
res.status(201).json({coiffeur})

}catch(error){
console.log(error)
res.status(500).json({error:'erreur lors de la recuperation des idee'})

}
})




//--------------------ROUTE POUR LES RDV-----------------------------------------------------------//

//avoir tt les rdv
app.get('/AllRdv',auth(), async(req,res)=>{
try{
const idClient = req.query.idClient
console.log(idClient)
//enregistrer l'ideee
const rdv =await db("RendezVous").leftJoin("Coiffeur", "RendezVous.idCoiffeur", "Coiffeur.idCoiffeur").leftJoin("Salon", "RendezVous.idSalon", "Salon.idSalon")
.select('RendezVous.idRendezVous','RendezVous.Date', 'RendezVous.Heure', 'RendezVous.Prix','Salon.Nom AS nomSalon','Coiffeur.Nom AS nomCoiffeur')
.where({ "RendezVous.idClient": idClient });
res.status(201).json({rdv})

}catch(error){
console.log(error)
res.status(500).json({error:'erreur lors de la recuperation des idee'})

}
})


app.get('/AllRdvC',auth(), async(req,res)=>{
try{
const idCoiffeur = req.query.idCoiffeur
//console.log(idClient)
//enregistrer l'ideee
const rdv =await db("RendezVous").leftJoin("Client", "RendezVous.idClient", "Client.idClient").leftJoin("Salon", "RendezVous.idSalon", "Salon.idSalon")
.select('RendezVous.idRendezVous','RendezVous.Date', 'RendezVous.Heure', 'RendezVous.Prix','Salon.Nom AS nomSalon','Client.Nom AS nomCoiffeur')
.where({ "RendezVous.idCoiffeur": idCoiffeur });
res.status(201).json({rdv})

}catch(error){
console.log(error)
res.status(500).json({error:'erreur lors de la recuperation des idee'})

}
})
// app.get('/AllRdv',auth(), async(req,res)=>{
//   try{
//       //enregistrer l'ideee
//       const rdv =await db("RendezVous").leftJoin("Coiffeur", "RendezVous.idCoiffeur", "Coiffeur.idCoiffeur").leftJoin("Salon", "RendezVous.idSalon", "Salon.idSalon")
//       .select('RendezVous.idRendezVous','RendezVous.Date', 'RendezVous.Heure', 'RendezVous.Prix','Salon.Nom AS nomSalon','Coiffeur.Nom AS nomCoiffeur')
//       res.status(201).json({rdv})

//   }catch(error){
//       console.log(error)
//       res.status(500).json({error:'erreur lors de la recuperation des idee'})

//   }
// })

app.get('/AllDispo',auth(), async(req,res)=>{
try{
const{idCoiffeur}=req.query
const rdv =await db("RendezVous").leftJoin("Coiffeur", "RendezVous.idCoiffeur", "Coiffeur.idCoiffeur").leftJoin("Salon", "RendezVous.idSalon", "Salon.idSalon")
.select('RendezVous.idRendezVous','RendezVous.Date', 'RendezVous.Heure', 'RendezVous.Prix','Salon.Nom AS nomSalon','Coiffeur.Nom AS nomCoiffeur')
.where({ "RendezVous.idCoiffeur": idCoiffeur,"RendezVous.idClient": null });
res.status(201).json({rdv})

}catch(error){
console.log(error)
res.status(500).json({error:'erreur lors de la recuperation des idee'})

}
})

app.get('/AllDispoConf',auth(), async(req,res)=>{
try{
const{idCoiffeur}=req.query
const rdv =await db("RendezVous")
.leftJoin("Coiffeur", "RendezVous.idCoiffeur", "Coiffeur.idCoiffeur")
.leftJoin("Salon", "RendezVous.idSalon", "Salon.idSalon")
.leftJoin("Client", "RendezVous.idClient", "Client.idClient")
.select('RendezVous.idRendezVous','RendezVous.Date', 'RendezVous.Heure', 'RendezVous.Prix','Salon.Nom AS nomSalon','Client.Nom AS nomClient')
.where({ "RendezVous.idCoiffeur": idCoiffeur })
.whereNotNull("RendezVous.idClient");
res.status(201).json({rdv})

}catch(error){
console.log(error)
res.status(500).json({error:'erreur lors de la recuperation des idee'})

}
})

//supp rdv
app.post('/SuppRdv',auth(), async(req,res)=>{
try{
const{idRdv}=req.body
const rdv =await db("RendezVous").where({ idRendezVous: idRdv }).del()
res.status(201).json({message: "del reussi"})

}catch(error){
console.log(error)
res.status(500).json({error:'erreur lors de la recuperation des idee'})

}
})

app.post('/AddRdv',auth(), async(req,res)=>{
try{
const { idCoiffeur, Date, Heure, Prix } = req.body; 
const idSalon= db("Coiffeur").select("idSalon").where({ idCoiffeur: idCoiffeur })
await db('RendezVous').insert({
idCoiffeur,
idSalon,
Date,
Heure,
Prix
});
res.status(201).json({message: "ajout reussi"})

}catch(error){
console.log(error)
res.status(500).json({error:'erreur lors de la recuperation des idee'})

}
})

app.post('/AddDispo',auth(), async(req,res)=>{
try{
const { idCoiffeur, Date, Heure } = req.body; 
const idSalon= db("Coiffeur").select("idSalon").where({ idCoiffeur: idCoiffeur })
await db('RendezVous').insert({
idCoiffeur,
idSalon,
Date,
Heure,
});
res.status(201).json({message: "ajout reussi"})

}catch(error){
console.log(error)
res.status(500).json({error:'erreur lors de la recuperation des idee'})

}
})

app.put('/UpdateRdv',auth(), async(req,res)=>{
try{
const { idRendezVous, idClient,Prix } = req.body; 
await db('RendezVous').where({ idRendezVous }).update({ idClient,Prix });
res.status(201).json({message: "modifcation reussi"})

}catch(error){
console.log(error)
res.status(500).json({error:'erreur lors de la recuperation des idee'})

}
})

//--------------------ROUTE POUR LA BLOCKLIST-----------------------------------------------------------//

//obtenir les coiffeur
app.get('/AllClient',auth(), async (req, res) => {
  try {
  const client = await db("Client")
  .select("idClient","Client.Nom","adresseCourriel","numeroDeTelephone")
  
  res.status(201).json({ client });
  } catch (error) {
  console.log(error);
  res.status(500).json({ error: "Erreur lors de la récupération des coiffeurs" });
  }
  });


  app.get('/AllBlocklist', auth(), async (req, res) => {
    try {
      const { idCoiffeur } = req.query;
      const blocklist = await db('blocklist')
        .leftJoin('Client', 'blocklist.idClient', 'Client.idClient')
        .select('blocklist.idblocklist', 'Client.idClient', 'Client.Nom AS nomClient')
        .where({ idCoiffeur });
      res.status(200).json(blocklist);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération de la liste de blocage' });
    }
  });

  app.get('/CheckBlocklist', auth(), async (req, res) => {
    try {
        const { idClient, idCoiffeur } = req.query;
        const blocklist = await db('blocklist')
            .leftJoin('Client', 'blocklist.idClient', 'Client.idClient')
            .leftJoin('Coiffeur', 'blocklist.idCoiffeur', 'Coiffeur.idCoiffeur')
            .select('blocklist.idblocklist', 'Client.idClient', 'Client.Nom AS nomClient', 'blocklist.idCoiffeur', 'Coiffeur.Nom AS nomCoiffeur')
            .where({ 'blocklist.idClient': idClient, 'blocklist.idCoiffeur': idCoiffeur });
        const isBlocked = blocklist.length > 0;
        
        res.status(200).json({ isBlocked });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération de la liste de blocage' });
    }
});

  
  app.post('/AddBlocklist',auth(), async(req,res)=>{
    try{
    const { idClient,idCoiffeur} = req.body; 
    await db('blocklist').insert({
      idClient,
      idCoiffeur
    });
    res.status(201).json({message: "ajout reussi"})
    
    }catch(error){
    console.log(error)
    res.status(500).json({error:'erreur lors de la recuperation des ids'})
    
    }
    })
  
  //supp blocklist
  app.post('/SuppBlocklist',auth(), async(req,res)=>{
  try{
  const{idBlocklist}=req.body
  const blocklist =await db("Blocklist").where({ idBlocklist: idBlocklist }).del()
  res.status(201).json({message: "del reussi"})
  
  }catch(error){
  console.log(error)
  res.status(500).json({error:'erreur lors de la recuperation des idee'})
  
  }
  })
  
  
 


//-----------------------------------------Fonctions---------------------------

function getNomById(id) {
return new Promise((resolve, reject) => {
db('Coiffeur')
.select('Nom')
.where('idCoiffeur', id)
.then(rows => {
  if (rows.length === 0) {
    reject(new Error('Aucun coiffeur avec cette id'));
  } else {
    resolve(rows[0].Nom); 
  }
})
.catch(err => {
  reject(err);
});
});
}

function getEmailById(id) {
return new Promise((resolve, reject) => {
db('Coiffeur')
.select('adresseCourriel')
.where('idCoiffeur', id)
.then(rows => {
  if (rows.length === 0) {
    reject(new Error('Aucun coiffeur avec cette id'));
  } else {
    resolve(rows[0].adresseCourriel); 
  }
})
.catch(err => {
  reject(err);
});
});
}

function getNumById(id) {
return new Promise((resolve, reject) => {
db('Coiffeur')
.select('numeroDeTelephone')
.where('idCoiffeur', id)
.then(rows => {
  if (rows.length === 0) {
    reject(new Error('Aucun coiffeur avec cette id'));
  } else {
    resolve(rows[0].numeroDeTelephone); 
  }
})
.catch(err => {
  reject(err);
});
});
}



//-------------------------------------------------------------------------------
app.get('/client/details/:id',auth(), async (req, res) => { 
try {
const id = req.params.id;

const nomPromise = getNomById(id);
const emailPromise = getEmailById(id);
const numPromise = getNumById(id);
const salonPromise = getSalonById(id)

const [nom, email, num, salon] = await Promise.all([nomPromise, emailPromise, numPromise, salonPromise]);

res.json({ nom, email, num, salon });
} catch (error) {
res.status(500).json({ error: 'Erreur' });
}
});





function getDatesByID(id) {
return new Promise((resolve, reject) => {
db('RendezVous')
.select('Date')
.where('idCoiffeur', id)
.whereNull('idClient')
.then(rows => {
  if (rows.length === 0) {
    reject(new Error('No coiffeur with this id'));
  } else {
    resolve(rows.map(row => row.Date)); 
  }
})
.catch(err => {
  reject(err);
});
});
}


function getHeuresById(id) {
return new Promise((resolve, reject) => {
db('RendezVous')
.select('Heure')
.where('idCoiffeur', id)
.whereNull('idClient')
.then(rows => {
  if (rows.length === 0) {
    reject(new Error('No coiffeur with this id'));
  } else {
    resolve(rows.map(row => row.Heure)); 
  }
})
.catch(err => {
  reject(err);
});
});
}

function getSalonById(id) {
return new Promise((resolve, reject) => {
db('Coiffeur')
.select('idSalon')
.where('idCoiffeur', id)
.then(rows => {
  if (rows.length === 0) {
    reject(new Error('No coiffeur with this id'));
  } else {
    resolve(rows.map(row => row.idSalon)); 
  }
})
.catch(err => {
  reject(err);
});
});
}



app.get('/client/details/dates/:id',auth(), async (req, res) => { 
try {
const id = req.params.id;
const dates = await getDatesByID(id);

res.json({ dates });
} catch (error) {
res.status(500).json({ error: 'Error' });
}
});

app.get('/client/details/heures/:id',auth(), async (req, res) => { 
try {
const id = req.params.id;
const heures = await getHeuresById(id);

res.json({ heures });
} catch (error) {
res.status(500).json({ error: 'Error' });
}
});


app.get('/client/details/salons/:id',auth(), async (req, res) => { 
try {
const id = req.params.id;
const salons = await getSalonById(id);

res.json({ salons });
} catch (error) {
res.status(500).json({ error: 'Error' });
}
});

app.post('/client/details', async (req, res) => {
try {
const {idClient, idCoiffeur, idSalon, Date, Heure, Prix } = req.body; 

// Enregistrer du rendez-vous dans la base de données
await db('RendezVous').insert({
idClient,
idCoiffeur,
idSalon,
Date,
Heure,
Prix,
});
console.log('Info rdv:', { idClient, idCoiffeur, idSalon, Date, Heure, Prix });
} catch (error) {
console.error(error);
res.status(500).json({ error: 'An error occurred' });
}
});

//--------------------ROUTE POUR LES FAVORIS-----------------------------------------------------------//

//Ajouter fav

app.post('/AddFav',auth(), async (req, res) => {
try {
const { idClient, idCoiffeur } = req.body;
// Vérifie si déjà dans les favoris
const test = await db("Favoris").where({ idClient: idClient, idCoiffeur: idCoiffeur });
if (test.length !== 0) {
res.status(400).json({ message: "Déjà existant dan fav" });
} else {
await db('Favoris').insert({ idClient, idCoiffeur });
res.status(200).json({ message: 'Ajouréussi' });
}
} catch (error) {
console.log(error);
res.status(500).json({ error: 'Erreur lors de lajout' });
}
});
//supprimer Fav

app.post('/SuppFav',auth(), async(req,res)=>{
try{
const{idClient,idCoiffeur}=req.body
await db("Favoris").where({ idClient: idClient,idCoiffeur:idCoiffeur }).del()
res.status(201).json({message: "del reussi"})

}catch(error){
console.log(error)
res.status(500).json({error:'erreur lors de la recuperation des idee'})

}
})

//recuperer les favoris de ..

app.get('/Fav',auth(), async(req,res)=>{
try{
const{idClient}=req.query 

const fav =await db("Coiffeur").select("Coiffeur.*").leftJoin("Favoris", "Coiffeur.idCoiffeur", "Favoris.idCoiffeur")
.where("Favoris.idClient", idClient)
res.status(201).json({fav})

}catch(error){
console.log(error)
res.status(500).json({error:'erreur lors de la recuperation des fav'})

}
})



//--------------------ROUTE POUR OBTENIR LES DONNEES DU COIFFEUR CONNECTE-----------------------------------------------------------// 

app.get('/fetchCoiffeurData',auth(), async (req, res) => {
try {
const token = req.cookies.token;
const decodedToken = jwt.verify(token, Token_secret_key);
const coiffeur = await db("Coiffeur").select('*').where({ adresseCourriel: decodedToken.email }).first();
res.status(200).json({ coiffeur });

} catch (error) {
console.log(error)
res.status(500).json({ error: 'An error occurred while fetching coiffeur data' });
}
});


const sqlite3 = require('sqlite3').verbose();

// Function to update coiffeur information
app.put('/updateCoiffeur',auth(), async (req, res) => {
try {
const { idCoiffeur, nom, adresseCourriel, salon,Services, telephone, pdp } = req.body;

// Update the coiffeur information in the database
const updatedCoiffeur = {
    Nom: nom,
    adresseCourriel: adresseCourriel,
    idSalon: salon,
    Services: Services,
    numeroDeTelephone: telephone,
    pdp: pdp // Update the photo URL
};

// Check if the coiffeur exists in the database
const existingCoiffeur = await db('Coiffeur').where('idCoiffeur', idCoiffeur).first();
if (!existingCoiffeur) {
    return res.status(404).json({ error: 'Coiffeur not found' });
}

// Update the coiffeur information in the database
await db('Coiffeur').where('idCoiffeur', idCoiffeur).update(updatedCoiffeur);

res.status(200).json({ message: 'Coiffeur information updated successfully' });
} catch (error) {
console.error(error);
res.status(400).json({ error: 'Failed to update coiffeur information' });
}
});

//--------------------ROUTE POUR OBTENIR LES AVIS-----------------------------------------------------------// 

//route pour ajouter des avis
app.post('/AddAvis',auth(), async (req, res) => {
try {
const { idRdv,  Avis } = req.body;
const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const DateAvis = `${year}/${month}/${day}`
await db('Avis').insert({ idRdv, Avis, DateAvis });
res.status(200).json({ message: 'Ajout réussi' });
} catch (error) {
console.log(error);
res.status(500).json({ error: 'Erreur lors de lajout' });
}
});


app.get('/AvisCoifeur',auth(), async (req, res) => {
try {
const { idCoiffeur } = req.query;

const avis = await db("Avis")
    .select("Avis.idAvis","Avis.Avis", "Avis.DateAvis", "Client.Nom")
    .leftJoin("RendezVous", "Avis.idRdv", "RendezVous.idRendezVous")
    .leftJoin("Client", "RendezVous.idClient", "Client.idClient")
    .where("RendezVous.idCoiffeur", idCoiffeur);

res.status(201).json({ avis });
} catch (error) {
console.log(error);
res.status(500).json({ error: 'Erreur lors de la récupération des avis' });
}
});


//--------------------ROUTE POUR LE PORFOLIO-----------------------------------------------------------// 

app.post('/AddPhoto', async (req, res) => {
  try {
  const { idCoiffeur, url,Description } = req.body;
  console.log(idCoiffeur, url,Description)
  await db('Porfolio').insert({ idCoiffeur:idCoiffeur, url:url,Description:Description });
  res.status(200).json({ message: 'Ajout réussi' });
  } catch (error) {
  console.log(error);
  res.status(500).json({ error: 'Erreur lors de lajout' });
  }
  })

app.get('/GetPorfolio/:id', async (req, res) => {
  try {
    const id = req.params.id
    const user= await db('Porfolio').select('*').where({idCoiffeur:id})
    res.status(200).json({ user });
    } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erreur lors de lajout' });
    }
    })

    app.post('/supprimerPhoto/:id', auth(), async (req, res) => {
      try {
          const id = req.params.id;
          await db("Porfolio").where({ idPorfolio: id }).del();
          res.status(201).json({ message: "Suppression réussie" });
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Erreur lors de la suppression de la photo' });
      }
  });
      
  