export const handleRegister =  (bcrypt, db) => (req, res) => {
  const {email, password, name} = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form of submission!')
  }
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0])
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    
    .catch(err => res.status(400).json('unable to register'))

  // res.json(`This is the info, name: ${name}, email: ${email}, password: ${password}`)
}