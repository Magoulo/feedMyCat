const sqlite = require('sqlite3')
const db = new sqlite.Database('catDB.db')

db.run(`
   CREATE TABLE IF NOT EXISTS "cat_owner" (
	"Cat_owner_id"	INTEGER,
	"Firstname"	TEXT,
	"Lastname"	TEXT,
	"Email"	TEXT,
	"Phonenumber"	TEXT,
	"City"	TEXT,
	PRIMARY KEY("Cat_owner_id" AUTOINCREMENT)
);
`) 
db.run(`
CREATE TABLE IF NOT EXISTS "cat" (
	"Cat_id"	INTEGER,
	"Name"	TEXT,
	"Description"	TEXT,
	"Image_reference"	TEXT,
	"Cat_owner_id"	INTEGER,
	"Age"	INTEGER,
	PRIMARY KEY("Cat_id" AUTOINCREMENT),
	FOREIGN KEY("Cat_owner_id") REFERENCES "cat_owner"("Cat_owner_id")
);
`)
db.run(`
CREATE TABLE IF NOT EXISTS "user_accounts" (
	"Account_id"	INTEGER,
	"Cat_owner_id"	INTEGER,
	"Username"	TEXT UNIQUE,
	"Password"	TEXT,
	PRIMARY KEY("Account_id" AUTOINCREMENT),
	FOREIGN KEY("Cat_owner_id") REFERENCES "cat_owner"("Cat_owner_id")
);
`)
db.run(`
CREATE TABLE IF NOT EXISTS "donation_alternative" (
	"Donation_alternative_id"	INTEGER,
	"Name"	TEXT,
	"Website_link"	TEXT,
	"Description"	TEXT,
	PRIMARY KEY("Donation_alternative_id" AUTOINCREMENT)
);
`)
db.run(`
CREATE TABLE IF NOT EXISTS "faq" (
	"Faq_id"	INTEGER,
	"Question"	TEXT,
	"Answer"	TEXT,
	PRIMARY KEY("Faq_id" AUTOINCREMENT)
);
`)

//------------------------------------FAQ-------------------------------------------------------------------
exports.getAllFaq = function (callback) {

    const query = "SELECT * FROM faq"

    db.all(query, function (error, faq) {
        callback(error, faq)
    })
}

exports.createFaq = function (Question, Answer, callback) {

    const query = "INSERT INTO faq (Question, Answer) VALUES(?,?)"
    const values = [Question, Answer]

    db.run(query, values, function (error) {

        callback(error, this.lastID)
    })
}

exports.getFaqById = function (Faq_id, callback) {

    const query = "SELECT * FROM faq WHERE Faq_id = ? LIMIT 1"
    const values = [Faq_id]

    db.get(query, values, function (error, faq) {
        if(faq == undefined){
            model = {
                error,
                faq
            }
            callback(model)
        }
        else{
             callback(error, faq)
        }
    })
}

exports.updateFaqById = function (Faq_id, Question, Answer, callback) {

    const query = "UPDATE faq SET Question = ?, Answer = ? WHERE Faq_id = ?"
    const values = [Question, Answer, Faq_id]

    db.run(query, values, function (error) {

        callback(error)

    })
}

exports.deleteFaqById = function (Faq_id, callback) {

    const query = "Delete FROM faq WHERE Faq_id = ? "
    const values = [Faq_id]

    db.run(query, values, function (error) {

        callback(error, this.lastID)

    })
}

//--------------------------------------------Donation-----------------------------------------------------------------

exports.getAllDon = function (callback) {

    const query = "SELECT * FROM donation_alternative"

    db.all(query, function (error, donation_alternative) {
        callback(error, donation_alternative)
    })
}

exports.createDon = function (Name, Description, Website_link, callback) {

    const query = "INSERT INTO donation_alternative (Name, Description, Website_link) VALUES(?,?,?)"
    const values = [Name, Description, Website_link]

    db.run(query, values, function (error) {

        callback(error, this.lastID)
    })
}

exports.getDonById = function (Donation_alternative_id, callback) {

    const query = "SELECT * FROM donation_alternative WHERE Donation_alternative_id = ? LIMIT 1"
    const values = [Donation_alternative_id]

    db.get(query, values, function (error, donation_alternative) {
        if(donation_alternative == undefined){
            model = {
                error,
                donation_alternative
            }
            callback(model)
        }
        else{
             callback(error, donation_alternative)
        }
    })
}

exports.updateDonById = function (Donation_alternative_id, Name, Description, Website_link, callback) {

    const query = "UPDATE donation_alternative SET Name = ?, Description = ?, Website_link = ? WHERE Donation_alternative_id = ?"
    const values = [Name, Description, Website_link, Donation_alternative_id]

    db.run(query, values, function (error) {
        callback(error)

    })
}

exports.deleteDonById = function (Donation_alternative_id, callback) {

    const query = "Delete FROM donation_alternative WHERE Donation_alternative_id = ? "
    const values = [Donation_alternative_id]

    db.run(query, values, function (error) {

        callback(error)

    })
}

//-----------------------------------Index----------------------------------------------------------------------

exports.getAllCat = function (startIndex,endIndex,callback) {

    const query = "SELECT * FROM cat JOIN cat_owner ON cat.Cat_owner_id = cat_owner.Cat_owner_id ORDER BY Cat_id DESC LIMIT ?,?"
    const values = [startIndex,endIndex]
    db.all(query,values, function (error, cat) {
        callback(error, cat)
    })
}

exports.createCat = function (Name, Description, Image_reference, Cat_owner_Id, Age, callback) {

    const query = "INSERT INTO cat (Name,Description,Image_reference,Cat_owner_Id, Age) VALUES(?,?,?,?,?)"
    const values = [Name, Description, Image_reference, Cat_owner_Id, Age]

    db.run(query, values, function (error) {

        callback(error, this.lastID)
    })
}

exports.getCatById = function (Cat_id, callback) {

    const query = "SELECT * FROM cat WHERE Cat_id = ? LIMIT 1"
    const values = [Cat_id]

    
    db.get(query, values, function (error, cat) {
        if(cat == undefined){
            model = {
                error,
                cat
            }
            callback(model)
        }
        else{
             callback(error, cat)
        }
    })
}

exports.updateCatById = function (Cat_id, Name, Description, Age, callback) {

    const query = "UPDATE cat SET Name = ?, Description = ?, Age = ? WHERE Cat_id = ?"
    const values = [Name, Description, Age, Cat_id]

    db.run(query, values, function (error) {
        callback(error)
    })
}

exports.deleteCatById = function (Cat_id, callback) {

    const query = "Delete FROM cat WHERE Cat_id = ? "
    const values = [Cat_id]

    db.run(query, values, function (error) {

        callback(error)

    })
}


//-----------------------------------------Catownerinfo------------------------------------------------

exports.getCatownerinfoById = function (id, callback) {
    const query = "SELECT * FROM cat_owner WHERE Cat_owner_id = ? LIMIT 1"
    const values = [id]

    db.get(query, values, function (error, cat_owner) {
      if(cat_owner == undefined){
          model = {
              error,
              cat_owner
          }
          callback(model)
      }
      else{
           callback(error, cat_owner)
      } 
})
}

exports.getAllCatownerinfo = function (callback) {

    const query = "SELECT * FROM cat_owner"

    db.all(query, function (error, catownerinfo) {
        callback(error, catownerinfo)
    })
}

exports.createCatownerinfo = function (Firstname, Lastname, Email, Phonenumber, City, callback) {

    const query = "INSERT INTO cat_owner (Firstname,Lastname,Email,Phonenumber,City) VALUES(?,?,?,?,?)"
    const values = [Firstname, Lastname, Email, Phonenumber, City]

    db.run(query, values, function (error) {
        callback(error, this.lastID)
    })

}
exports.deleteCatownerById = function (Cat_owner_id, callback) {

    const query = "Delete FROM cat_owner WHERE Cat_owner_id = ? "
    const values = [Cat_owner_id]

    db.run(query, values, function (error) {

        callback(error)

    })
}

//---------------------------------Account----------------------------------------------------------------

exports.getUseraccount = function (Username, callback) {

    const query = "SELECT * FROM user_accounts WHERE Username = ? LIMIT 1"
    const values = [Username]

    db.get(query, values, function (error, User_accounts) {
        if(User_accounts == undefined){
            model = {
                error,
                User_accounts
            }
            callback(model)
        }
        else{
             callback(error, User_accounts)
        } 
    })
}

exports.createUseraccount = function (Username, Password, Cat_owner_id, callback) {

    const query = "INSERT INTO user_accounts (Username,Password,Cat_owner_id) VALUES(?,?,?)"
    const values = [Username, Password, Cat_owner_id]

    db.run(query, values, function (error) {

        callback(error, this.lastID)
    })
}

exports.getMyads = function (user_id, callback) {

    const query = "SELECT * FROM cat JOIN cat_owner ON cat.Cat_owner_id = cat_owner.Cat_owner_id JOIN user_accounts ON cat_owner.cat_owner_id = user_accounts.cat_owner_id WHERE User_accounts.Account_id = ? ORDER BY Cat_id DESC"
    values = [user_id]
    db.all(query, values, function (error, cat) {
        callback(error, cat)
    })
}