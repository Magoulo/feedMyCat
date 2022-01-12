const express = require('express')
const db = require('../database')
const router = express.Router()

router.get('/', function (request, response) {
	const id = request.session.UserID

	db.getMyads(id, function (error, cat) {
		if (error) {
			const model = {
				hasDatabaseError: true,
				cat: []
			}
			response.render('myads.hbs', model)
		}
		else {	
			const model = {
				hasDatabaseError: false,
				cat
			}
			response.render('myads.hbs', model)
		}
	})
})

module.exports = router