const MAX_NAME_LENGTH = 15
const MIN_NAME_LENGTH = 3
const MAX_DESCRIPTION_LENGTH = 40
const MIN_DESCRIPTION_LENGTH = 5

const MIN_QUESTION_LENGTH = 5
const MIN_ANSWER_LENGTH = 2

const MAX_AGE_LENGTH = 3
const MIN_AGE_LENGTH = 1


exports.getCatValidationErrors = function(name, description, age) {
	const validationErrors = []

    if(name.length == 0){
        validationErrors.push("You must enter a name.")
    }
    if (name.length > MAX_NAME_LENGTH) {
		validationErrors.push("The name cannot be longer than " + MAX_NAME_LENGTH + " characters.")
	}
	if (name.length < MIN_NAME_LENGTH) {
		validationErrors.push("The name needs to be at least " + MIN_NAME_LENGTH + " characters.")
	}
    if (description.length > MAX_DESCRIPTION_LENGTH) {
		validationErrors.push("The description cannot be longer than " + MAX_DESCRIPTION_LENGTH + " characters.")
	}
	if (description.length < MIN_DESCRIPTION_LENGTH) {
		validationErrors.push("The description needs to be at least " + MIN_DESCRIPTION_LENGTH + " characters.")
	}
    if (age.length > MAX_AGE_LENGTH) {
		validationErrors.push("Age cannot be over 999, unless you are a wizard?")
	}
	if (age.length < MIN_AGE_LENGTH) {
		validationErrors.push("Age must be assigned")
	}
	if (!parseInt(age)) {
		validationErrors.push("Age must be a number")
	}
	return validationErrors
}
exports.getDonValidationErrors = function(name, description) {
    const validationErrors = []

    if (name.length < MIN_NAME_LENGTH) {
        validationErrors.push("The name needs to be at least " + MIN_NAME_LENGTH + " characters.")
    }
    if (description.length < MIN_DESCRIPTION_LENGTH) {
        validationErrors.push("The description needs to be at least " + MIN_DESCRIPTION_LENGTH + " characters.")
    }
    return validationErrors
}
exports.getFaqValidationErrors= function(question, answer) {
    const validationErrors = []

    if (question.length < MIN_QUESTION_LENGTH) {
        validationErrors.push("The question needs to be at least " + MIN_QUESTION_LENGTH + " characters.")
    }
    if (answer.length < MIN_ANSWER_LENGTH) {
        validationErrors.push("The answer needs to be at least " + MIN_ANSWER_LENGTH + " characters.")
    }
    return validationErrors
}

