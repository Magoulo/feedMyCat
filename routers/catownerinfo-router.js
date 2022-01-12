const express = require('express')
const db = require('../database')
const router = express.Router()

router.get('/', function (request, response) {
	db.getAllCatownerinfo(function (error, cat_owner) {
		if(error){	
			const model ={
			    hasDatabaseError: true,
			    cat_owner: []
		    }
            response.render('catownerinfo.hbs',model)
		}
		else {
			const model ={
				hasDatabaseError: false,
				cat_owner
			}
			response.render('catownerinfo.hbs',model)
		}		
	})		
})
router.get('/:id', function (request, response) {
	const id = request.params.id

	db.getCatownerinfoById(id, function (error, cat_owner) {
		if(error){
		    const model = {
			    hasDatabaseError: true,
			    cat_owner
		    }
		    response.render('catownerinfo.hbs', model)
		}
		else{
		    const model = {
			    cat_owner
		    }
		    response.render('catownerinfo.hbs', model)
        }
	})
})

module.exports = router