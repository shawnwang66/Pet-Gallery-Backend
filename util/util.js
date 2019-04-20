// HTTP status code
const statusCode = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER_ERR: 500 
};

// Check if email address is valid
// credit: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function isEmailValid(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Check if document ID is valid
// credit: https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id
function isIdValid(id) {
    return id.match(/^[0-9a-fA-F]{24}$/);
}

module.exports = { statusCode, isEmailValid, isIdValid };