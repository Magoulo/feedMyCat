const express = require('express')
const db = require('../database')

const router = express.Router()
const validators = require('../validators')

const csrf = require('csurf')
const csrfProtection = csrf()

router.get('/', csrfProtection, function (request, response) {

    db.getAllFaq(function (error, faq) {

        if (error) {

            const model = {
                hasDatabaseError: true,
                faq: []
            }
            response.render('faq.hbs', model)
        }
        else {
            const model = {
                hasDatabaseError: false,
                faq,
                csrfToken: request.csrfToken()
            }

            response.render('faq.hbs', model)
        }
    })
})

router.get('/create', csrfProtection, function (request, response) {
    response.render('createfaq.hbs', { csrfToken: request.csrfToken() })
})

router.post('/create', csrfProtection, function (request, response) {
    const Question = request.body.question
    const Answer = request.body.answer


    const errors = validators.getFaqValidationErrors(Question, Answer)

    if (!request.session.isLoggedIn) {

        errors.push("Not logged in.")
    }

    if (errors.length == 0) {

        db.createFaq(Question, Answer, function (error, Faq_id) {

            if (error) {

                errors.push("Internal server error.")

                const model = {
                    errors,
                    Question,
                    Answer,
                    csrfToken: request.csrfToken()
                }
                response.render('createfaq.hbs', model)
            }
            else {

                response.redirect('/faq')
            }
        })
    }
    else {

        const model = {
            errors,
            Question,
            Answer,
            csrfToken: request.csrfToken()
        }
        response.render('createfaq.hbs', model)
    }
})

router.get('/:id', csrfProtection, function (request, response) {
    const id = request.params.id

    db.getFaqById(id, function (error, faq) {

        if (error) {

            const model = {
                hasDatabaseError: true,
                faq
            }
            response.render('faq.hbs', model)
        }
        else {

            const model = {
                faq,
                csrfToken: request.csrfToken()
            }
            response.render('faq.hbs', model)
        }
    })
})

router.get('/:id/update', csrfProtection, function (request, response) {
    const id = request.params.id


    db.getFaqById(id, function (error, faq) {

        if (error) {
            model = {
                hasDatabaseError: true,
                faq
            }
            response.render('updatefaq.hbs', model)
        }
        else {
            const model = {
                faq,
                csrfToken: request.csrfToken()
            }

            response.render('updatefaq.hbs', model)
        }
    })
})

router.post('/:id/update', csrfProtection, function (request, response) {

    const Faq_id = request.params.id
    const Question = request.body.question
    const Answer = request.body.answer

    const errors = validators.getFaqValidationErrors(Question, Answer)

    if (!request.session.AdminIsLoggedIn) {

        errors.push("Not logged in as Administrator.")
        console.log("not logged in as Administrator")
    }

    if (errors.length == 0) {

        db.updateFaqById(Faq_id, Question, Answer, function (error) {

            if (error) {

                errors.push("Internal server error")
                model = {
                    errors,
                    Faq_id,
                    Question,
                    Answer,
                    csrfToken: request.csrfToken()
                }
                response.render('updatefaq.hbs', model)
            }
            else {

                response.redirect('/faq')
            }
        })
    }
    else {

        const model = {
            errors,
            faq: {
                Faq_id,
                Question,
                Answer,   
            },
             csrfToken: request.csrfToken()
        }
        response.render('updatefaq.hbs', model)
    }
})

router.get('/:id/delete', csrfProtection, function (request, response) {
    const id = request.params.id

    db.getFaqById(id, function (error, faq) {

        if (error) {

            const model = {
                hasDatabaseError: true,
                faq
            }
            response.render('deletefaq.hbs', model)
        }
        else {

            const model = {
                faq,
                csrfToken: request.csrfToken()

            }
            response.render('deletefaq.hbs', model)
        }
    })
})

router.post('/:id/delete', csrfProtection, function (request, response) {
    const Faq_id = request.params.id
    const errors = []

    if (!request.session.AdminIsLoggedIn) {

        console.log("not logged in as Administrator")
        errors.push("Not logged in as Administrator")
    }
    if (!errors.length) {

        db.deleteFaqById(Faq_id, function (error) {

            if (error) {

                errors.push("Internal server error.")
                model = {
                    errors,
                    Faq_id
                }
                response.render('deletefaq.hbs', model)
            }
            else {

                response.redirect('/faq')
            }
        })
    }
    else {
        
        const model = {
            errors,
            faq: {
                Faq_id,
                csrfToken: request.csrfToken()
            }
        }
        response.render('deletefaq.hbs', model)
    }
})

module.exports = router