const express = require('express')
const db = require('../database')
const bcrypt = require('bcryptjs')
const router = express.Router()
const csrf = require('csurf')
const csrfProtection = csrf()

const adminUsername = 'Admin'
const hashedAdminPassword = '$2a$13$qMvfkKBY.ixh6d48lRN7M.qbkJD1PZWdGzRo2h1eZwYYBzw3F0zJG'

router.get('/login', csrfProtection, function (request, response) {
	response.render('login.hbs', { csrfToken: request.csrfToken() })
})
router.post('/login', csrfProtection, function (request, response) {
	const UserN = request.body.username
	const PW = request.body.password
	const errors = []

	if (UserN == adminUsername && bcrypt.compareSync(PW, hashedAdminPassword)) {
		request.session.isLoggedIn = true
		request.session.AdminIsLoggedIn = true
		response.redirect('/')
	}
	else {
		db.getUseraccount(UserN, function (error, User_accounts) {
			if (error) {
				errors.push("Internal server error")
				const model = {
					errors,
					User_accounts,
					csrfToken: request.csrfToken()
				}
				response.render('login.hbs', model)
			}
			else {
				if (UserN == User_accounts.Username && bcrypt.compareSync(PW, User_accounts.Password)) {
					request.session.isLoggedIn = true
					request.session.UserID = User_accounts.Account_id
					request.session.CatownerID = User_accounts.Cat_owner_id
					request.session.UserIsLoggedIn = true	 
					response.redirect('/')
				}
				else {
					errors.push("Wrong Username or Password")
					const model = {
						errors,
						User_accounts
					}
					response.render('login.hbs', model)
				}
			}
		})
	}
})
router.post('/logout', function (request, response) {
	request.session.destroy();
	response.redirect('/')
})
router.get('/create', function (request, response) {
	response.render('createaccount.hbs')
})
router.post('/create', function (request, response) {
	const Username = request.body.username
	const PW = request.body.password
	const Firstname = request.body.firstname
	const Lastname = request.body.lastname
	const Email = request.body.email
	const Phone = request.body.phonenumber
	const City = request.body.city
	const HashedPW = bcrypt.hashSync(PW, 13)

	db.createCatownerinfo(Firstname, Lastname, Email, Phone, City, function (error, Cat_owner_id) {
		if (error) {
			console.log("error in db.createCatownerinfo")
			const model = {
				hasDatabaseError: true,
				Firstname,
				Lastname,
				Email,
				Phone,
				City,
				Cat_owner_id
			}
			response.render('createaccount.hbs', model)
		}
		else {
			db.createUseraccount(Username, HashedPW, Cat_owner_id, function (error, Account_id) {
				if (error) {
					const errors = []

					db.deleteCatownerById(Cat_owner_id, function (error) {
						if (error) {
							errors.push("Internal server error")
							console.log("Could not delte catownerinfo in DB")
							response.render('createaccount.hbs', errors)
						}
						else {
							errors.push("The Username is already taken")
							const model = {
								errors,
								Firstname,
								Lastname,
								Email,
								Phone,
								City,
								Cat_owner_id
							}
							response.render('createaccount.hbs', model)
						}
					})
				}
				else {
					response.redirect('/index')
				}
			})
		}
	})
})

module.exports = router

