const express = require('express')
const db = require('../database')

const router = express.Router()

const csrf = require('csurf')
const session = require('express-session')
const csrfProtection = csrf()
const paginate = require('express-paginate')
const validators = require('../validators')

router.use(paginate.middleware(5, 50))

router.get('/', csrfProtection, function (request, response) {

	const page = request.query.page
	const limit = request.query.limit
	const startIndex = (page - 1) * limit
	const endIndex = page * limit

	db.getAllCat(startIndex, endIndex, function (error, cat) {

		if (error) {

			const model = {
				hasDatabaseError: true,
				cat: []
			}
			response.render('index.hbs', model)
		}
		else {

			const firstAd = 0
			const lastAd = 5
			const lastCat = lastAd -1
			const morePages = cat.length > lastCat
			const next = page + 1
			const previous = page - 1

			cat = cat.slice(firstAd, lastAd)

			const model = {
				hasDatabaseError: false,
				morePages,
				next,
				previous,
				cat,
				csrfToken: request.csrfToken()
			}
			response.render('index.hbs', model)
		}
	})
})


router.get('/create', csrfProtection, function (request, response) {
	if (request.session.AdminIsLoggedIn) {
        db.getAllCatownerinfo(function (error, cat_owner) {
			if(error){	
				const model ={
					hasDatabaseError: true,
					cat_owner: [],
					csrfToken: request.csrfToken()
				}
				response.render('createad.hbs',model)
			}
			else {
				const model ={
					hasDatabaseError: false,
					cat_owner,
					csrfToken: request.csrfToken()
				}
				response.render('createad.hbs',model)
			}		
		})		
    }
	else{
	response.render('createad.hbs', { csrfToken: request.csrfToken() })
	}
})

router.post('/create', csrfProtection, function (request, response) {
	const Name = request.body.name
	const Description = request.body.description
	const Cat_owner_Id = request.body.catownerid
	const Age = request.body.age

	const errors = validators.getCatValidationErrors(Name, Description, Age)

	if (!request.files || (request.files).length === 0) {
		errors.push("No image were choosen")
	}

	if (!request.session.isLoggedIn) {
		errors.push("Not logged in.")
	}

	if (errors.length == 0) {

		const imageFile = request.files.imageFile
		const uploadPath = "static/public/" + imageFile.name
		const Image_reference = imageFile.name

		imageFile.mv(uploadPath, function (error) {

			if (error) {

				console.log("Error in uploading pathway")
				errors.push("couldn't upload picture")
				response.render('createpost.hbs', errors)
			}
			else {

				console.log("file uploaded")
			}
		})

		db.createCat(Name, Description, Image_reference, Cat_owner_Id, Age, function (error, Cat_id) {

			if (error) {

				errors.push("Internal server error.")
				const model = {
					errors,
					Name,
					Description,
					Image_reference,
					Cat_owner_Id,
					Age,
					csrfToken: request.csrfToken()
				}
				response.render('createad.hbs', model)
			}
			else {

				if (request.session.AdminIsLoggedIn) {

					response.redirect('/index')
				}
				else {

					response.redirect('/myads')
				}
			}
		})
	}

	else {

		const model = {
			errors,
			Name,
			Description,
			Cat_owner_Id,
			Age,
			csrfToken: request.csrfToken()
		}
		response.render('createad.hbs', model)
	}
})

router.get('/:id', csrfProtection, function (request, response) {
	const Cat_id = request.params.id

	db.getCatById(Cat_id, function (error, cat) {

		if (error) {

			const model = {
				hasDatabaseError: true,
				cat,
				csrfToken: request.csrfToken()
			}
			response.render('index.hbs', model)
		}
		else {
			
			const model = {
				cat,
				csrfToken: request.csrfToken()
			}
			response.render('index.hbs', model)
		}
	})
})

router.get('/:id/update', csrfProtection, function (request, response) {

	const Cat_id = request.params.id

	db.getCatById(Cat_id, function (error, cat) {

		if (error) {

			model = {
				hasDatabaseError: true,
				cat,
				csrfToken: request.csrfToken()
			}
			response.render('updatead.hbs', model)
		}
		else {

			const model = {
				cat,
				csrfToken: request.csrfToken()
			}
			response.render('updatead.hbs', model)
		}
	})

})

router.post('/:id/update', csrfProtection, function (request, response) {

	const Cat_id = request.params.id
	const Name = request.body.name
	const Description = request.body.description
	const Age = request.body.age

	const errors = 	validators.getCatValidationErrors(Name, Description, Age)
	
	if (!request.session.isLoggedIn) {

		errors.push("Not logged in.")
	}

	if (errors.length == 0) {

		db.updateCatById(Cat_id, Name, Description, Age, function (error) {

			if (error) {

				errors.push("Internal server error")
				model = {
					Cat_id,
					Name,
					Description,
					Age,
					csrfToken: request.csrfToken()
				}
				response.render('updatead.hbs', model)
			}
			else {

				if (request.session.AdminIsLoggedIn) {

					response.redirect('/index')
				}
				else {

					response.redirect('/myads')
				}
			}
		})
	}

	else {

		const model = {
			errors,
			cat: {
				Cat_id,
				Name,
				Description,
				Age,	
			},
			csrfToken: request.csrfToken()
		}
		response.render('updatead.hbs', model)
	}
})

router.get('/:id/delete', csrfProtection, function (request, response) {
	const Cat_id = request.params.id

	db.getCatById(Cat_id, function (error, cat) {

		if (error) {

			const model = {
				hasDatabaseError: true,
				cat
			}
			response.render('deletead.hbs', model)
		}
		else {

			const model = {
				cat,
				csrfToken: request.csrfToken()
			}
			response.render('deletead.hbs', model)
		}
	})
})

router.post('/:id/delete', csrfProtection, function (request, response) {
	const Cat_id = request.params.id
	const errors = []

	if (!request.session.isLoggedIn) {

		console.log("not logged in")
		errors.push("Not logged in")
	}

	if (!errors.length) {

		db.deleteCatById(Cat_id, function (error) {

			if (error) {

				errors.push("Internal server error")
				model = {
					errors,
					Cat_id
				}
				response.render('deletead.hbs', model)
			}
			else {

				if (request.session.AdminIsLoggedIn) {

					response.redirect('/index')
				}
				else {

					response.redirect('/myads')
				}
			}
		})
	}
	else {
		
		const model = {
			errors,
			cat: {
				Cat_id,
				csrfToken: request.csrfToken()
			}
		}
		response.render('deletead.hbs', model)
	}
})



module.exports = router