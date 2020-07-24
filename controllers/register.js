const handleRegister = (req, res, bcrypt, db) =>{
    const {name, email, password } = req.body;
    if (!name || !email || !name){
       return res.status(400).json ('incorrect form submission');
    }
    const hash = bcrypt.hashSync (password);
    db.transaction(trx =>{
        trx.insert ({
            hash: hash,
            email: email
        })

     .into ('login')
     .returning('email')
     //loginEmail = the same email used in returning
     .then(loginEmail => {
            db('users')
        .returning('*')
        .insert ({
            
            name: name,
            email: loginEmail[0],
            joined: new Date()
        })
        .then(user => {
            res.json(user[0]); 
        })
        .then (trx.commit)
        .then (trx.rollback)
    })

    })
    .catch(err =>
        res.status(400).json('an error occured, please try again'));
    }

    module.exports = {
        handleRegister : handleRegister
    }
    

