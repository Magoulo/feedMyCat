const express = require('express')
const db = require('../database')

const router = express.Router()
const validators = require('../validators')

const csrf = require('csurf')
const csrfProtection = csrf()

router.get('/', csrfProtection, function (request, response) {

    db.getAllDon(function (error, donation_alternative) {

        if (error) {

            const model = {
                hasDatabaseError: true,
                donation_alternative: []
            }
            response.render('donationalternative.hbs', model)
        }
        else {

            const model = {
                hasDatabaseError: false,
                donation_alternative,
                csrfToken: request.csrfToken()
            }
            response.render('donationalternative.hbs', model)
        }
    })
})

router.get('/create', csrfProtection, function (request, response) {
    response.render('createdonationalternative.hbs', { csrfToken: request.csrfToken() })
})

router.post('/create', csrfProtection, function (request, response) {
    const Name = request.body.name
    const Description = request.body.description
    const Website_link = request.body.link

    const errors = validators.getDonValidationErrors(Name, Description)

    if (errors.length == 0) { 

        db.createDon(Name, Description, Website_link, function (error, Donation_alternative_id) {

            if (error) {

                errors.push("Internal server error.")

                const model = {
                    errors,
                    Name,
                    Description,
                    Website_link,
                    csrfToken: request.csrfToken()
                }

                response.render('createdonationalternative.hbs', model)

            }
            else {

                response.redirect('/donationalternative')
            }
        })
    }
    else {

        const model = {
            errors,
            Name,
            Description,
            Website_link,
            csrfToken: request.csrfToken()
        }

        response.render('createdonationalternative.hbs', model)
    }
})

router.get('/:id', csrfProtection, function (request, response) {

    const id = request.params.id

    db.getDonById(id, function (error, donation_alternative) {

        if (error) {
            console.log(error)
            const model = {
                hasDatabaseError: true,
                donation_alternative
            }
            response.render('donationalternative.hbs', model)
        }
        else {

            const model = {
                donation_alternative,
                csrfToken: request.csrfToken()
            }
            response.render('donationalternative.hbs', model)
        }
    })
})

router.get('/:id/update', csrfProtection, function (request, response) {

    const id = request.params.id

    db.getDonById(id, function (error, donation_alternative) {

        if (error) {
            console.log(error)
            model = {
                hasDatabaseError: true,
                donation_alternative
            }
            response.render('updatedonationalternative.hbs', model)
        }
        else {

            const model = {
                donation_alternative,
                csrfToken: request.csrfToken()
            }
            response.render('updatedonationalternative.hbs', model)
        }
    })
})



router.post('/:id/update', csrfProtection, function (request, response) {

    const Donation_alternative_id = request.params.id
    const Name = request.body.name
    const Description = request.body.description
    const Website_link = request.body.link

    const errors = validators.getDonValidationErrors(Name, Description)

    if (!request.session.AdminIsLoggedIn) {

        errors.push("Not logged in as Administrator.")
    }

    if (errors.length == 0) {

        db.updateDonById(Donation_alternative_id, Name, Description, Website_link, function (error) {

            if (error) {

                errors.push("Internal server error")
                model = {
                    errors,
                    Donation_alternative_id,
                    Name,
                    Description,
                    Website_link,
                    csrfToken: request.csrfToken()
                }
                response.render('updatedonationalternative.hbs', model)
            }
            else {

                response.redirect('/donationalternative')
            }
        })
    }
    else { 
        console.log(error)
        const model = {
            errors,
            donation_alternative: {
                Donation_alternative_id,
                Name,
                Description,
                Website_link        
            },
             csrfToken: request.csrfToken()
        }
        response.render('updatedonationalternative.hbs', model)
    }
})

router.get('/:id/delete', csrfProtection, function (request, response) {
    const id = request.params.id

    db.getDonById(id, function (error, donation_alternative) {

        if (error) {
            console.log(error)
            const model = {
                hasDatabaseError: true,
                donation_alternative
            }
            response.render('deletedonationalternative.hbs', model)
        }
        else {

            const model = {
                donation_alternative,
                csrfToken: request.csrfToken()
            }
            response.render('deletedonationalternative.hbs', model)
        }
    })
})


router.post('/:id/delete', csrfProtection, function (request, response) {

    const Donation_alternative_id = request.params.id
    const errors = []

    if (!request.session.AdminIsLoggedIn) {

        console.log("not logged in as Administrator")
        errors.push("Not logged in as Administrator")
    }
    if (!errors.length) {

        db.deleteDonById(Donation_alternative_id, function (error) {

            if (error) {

                errors.push("Internal server error")
                model = {
                    errors,
                    Donation_alternative_id
                }
                response.render('deletedonationalternative.hbs', model)
            }
            else {

                response.redirect('/donationalternative')
            }
        })
    }
    else {
        
        const model = {
            errors,
            donation_alternative: {
                Donation_alternative_id,
                csrfToken: request.csrfToken()
            }
        }
        response.render('deletedonationalternative.hbs', model)
    }
})

module.exports = router