"use strict";
exports.__esModule = true;
var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var Error_1 = require("./models/Error");
var jwt = require("jsonwebtoken");
var util_1 = require("util");
var HttpHelper_1 = require("./models/HttpHelper");
var check_1 = require("express-validator/check");
var port = 9090;
var app = express();
var secretKey = "KLasi67d76asdg";
var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'asdasd',
    database: 'restdb'
});
connection.connect(function (err) {
    if (err)
        console.log("MySQL connection error" + err.code);
    else
        console.log('Connected to MySQL');
});
app.listen(port, function () {
    console.log("Server is running on port " + port);
});
app.get('/users', function (req, res) {
    console.log('Kažkas bando gauti vartotojus');
    res.send('{"message": "OK"}');
});
app.post('/user', function (req, res) {
    console.log("Klientas bando sukurti vartotoja " + JSON.stringify(req.body));
    if (req.body.email &&
        req.body.name &&
        req.body.password &&
        req.body.password.length > 5 &&
        emailRegex.exec(req.body.email)) {
        // Atsiusti visi reikalingi duomenys
        connection.query("SELECT * FROM users WHERE email=\"" + req.body.email + "\"", function (err, results) {
            if (results.length > 0) {
                // Vartotojas su tokiu email jau egzistuoja
                res.status(409);
                res.send(new Error_1.Error(409, "User already exists"));
                return;
            }
            else {
                connection.query("INSERT INTO users (email, password, name) VALUES ('" + req.body.email + "', '" + new Buffer(req.body.password).toString('base64') + "', '" + req.body.name + "')", function (err, results) {
                    if (!err) {
                        // Pavyko sukurti vartotoja
                        res.status(201);
                        res.send('{"message":"OK"}');
                        return;
                    }
                    else {
                        res.status(500);
                        res.send(new Error_1.Error(500, "Internal server error."));
                        return;
                    }
                });
            }
        });
    }
    else {
        // Atsiusti ne visi reikalingi duomenys
        res.status(400);
        res.send(new Error_1.Error(400, "Bad request"));
        return;
    }
});
var loginValidators = [
    check_1.check('password').exists().isLength({ min: 5 }).withMessage('Password is not provided'),
    check_1.check('email').exists().isEmail().trim().normalizeEmail().withMessage('Email is not provided or incorect')
];
app.post("/login", loginValidators, function (req, res) {
    var errors = check_1.validationResult(req);
    if (errors.isEmpty()) {
        connection.query("SELECT * FROM users WHERE email=\"" + req.body.email + "\" AND password=\"" + new Buffer(req.body.password).toString('base64') + "\"", function (err, results) {
            if (err) {
                res.status(500);
                res.send(new Error_1.Error(500, "Internal server error."));
            }
            else {
                if (results.length > 0) {
                    var user = results[0];
                    delete user.password;
                    var token = jwt.sign({ userId: user.id }, secretKey);
                    user.token = token;
                    res.send(user);
                }
                else {
                    res.status(401);
                    res.send(new Error_1.Error(401, "Bad credentials."));
                }
            }
        });
    }
    else {
        res.status(400);
        res.json(errors.mapped());
    }
});
app.post("/user/debt", function (req, res) {
    var token = req.get('Authorization').split(' ')[1];
    if (token && req.body.amount && req.body.lender && req.body.debtor && req.body.dueDate) {
        jwt.verify(token, secretKey, function (err, decoded) {
            if (err) {
                // Token is invalid
                res.status(401);
                res.send(new Error_1.Error(401, "Bad credentials."));
            }
            else {
                // Token is valid
                if (decoded.userId == req.body.lender || decoded.userId == req.body.debtor) {
                    if (req.body.debtor === req.body.lender) {
                        // Trying to add debt for yourself
                        res.status(400);
                        res.send(new Error_1.Error(400, "Lender can not be debtor"));
                    }
                    else {
                        // Adding debt
                        connection.query("INSERT INTO debts (amount, lender, debtor, due_date, status, creator) VALUES (\"" + req.body.amount + "\", \"" + req.body.lender + "\", \"" + req.body.debtor + "\", \"" + req.body.dueDate + "\", \"unconfirmed\", \"" + decoded.userId + "\")", function (err, results) {
                            if (err) {
                                res.status(500);
                                res.send(new Error_1.Error(500, "Internal Server Error"));
                            }
                            else {
                                res.status(201);
                                res.send('{"message":"OK"}');
                            }
                        });
                    }
                }
                else {
                    // No permissions for adding debt
                    res.status(403);
                    res.send(new Error_1.Error(403, "No permissions."));
                }
            }
        });
    }
    else {
        res.status(400);
        res.send(new Error_1.Error(400, "Bad request"));
    }
});
app["delete"]('/debt/:debtId', function (req, res) {
    if (!req.get('Authorization')) {
        HttpHelper_1.HttpHelper.BadRequest(res);
        return;
    }
    var token = req.get('Authorization').split(' ')[1];
    var debtId = Number(req.params.debtId);
    if (token && util_1.isNumber(debtId)) {
        jwt.verify(token, secretKey, function (err, decoded) {
            if (err) {
                res.status(403);
                res.send(new Error_1.Error(403, "Bad credentials"));
            }
            else {
                connection.query("SELECT * FROM debts WHERE id=\"" + debtId + "\" AND creator=\"" + decoded.userId + "\"", function (err, results) {
                    if (!err && results.length > 0) {
                        connection.query("DELETE FROM debts WHERE id=\"" + debtId + "\"", function (err, results) {
                            if (err)
                                HttpHelper_1.HttpHelper.InternalServerError(res);
                            else
                                HttpHelper_1.HttpHelper.Ok(res);
                        });
                    }
                    else {
                        HttpHelper_1.HttpHelper.BadRequest(res);
                    }
                });
            }
        });
    }
});
app.get('/friendships', [check_1.header('Authorization').exists()], function (req, res) {
    if (check_1.validationResult(req).isEmpty()) {
        var token = req.get('Authorization').split(' ')[1];
        validateToken(token).then(function (decoded) {
            connection.query("SELECT name, f.status AS status FROM users AS u JOIN friendships AS f ON u.id=f.user2 WHERE f.user1=\"" + decoded.userId + "\" \n                    UNION\n                    SELECT name, f.status AS status FROM users AS u JOIN friendships AS f ON u.id=f.user1 WHERE f.user2=\"" + decoded.userId + "\"", function (err, results) {
                if (err)
                    HttpHelper_1.HttpHelper.InternalServerError(res);
                else
                    res.json(results);
            });
        })["catch"](function (err) {
            HttpHelper_1.HttpHelper.Unauthorized(res);
        });
    }
    else {
        HttpHelper_1.HttpHelper.Unauthorized(res);
    }
});
app.post('/friendship', [
    check_1.check('userId').exists().toInt().isNumeric(),
    check_1.header('Authorization').exists(),
], function (req, res) {
    if (check_1.validationResult(req).isEmpty()) {
        var token = req.get('Authorization').split(' ')[1];
        jwt.verify(token, secretKey, function (err, decoded) {
            if (err)
                HttpHelper_1.HttpHelper.Unauthorized(res);
            else {
                connection.query("INSERT INTO friendships VALUES(0, \"" + decoded.userId + "\", " + req.body.userId + ", \"pending\")", function (sqlErr, results) {
                    if (sqlErr)
                        HttpHelper_1.HttpHelper.InternalServerError(res);
                    else {
                        // HttpHelper.Ok(res);
                        connection.query("SELECT id, name, 'pending' AS status FROM users WHERE id=\"" + req.body.userId + "\"", function (err, results) {
                            if (err)
                                HttpHelper_1.HttpHelper.InternalServerError(res);
                            else
                                res.json(results[0]);
                        });
                    }
                });
            }
        });
    }
    else {
        HttpHelper_1.HttpHelper.BadRequest(res);
    }
});
app.put('/debt/:debtId', function (req, res) {
    if (!req.get('Authorization')) {
        HttpHelper_1.HttpHelper.BadRequest(res);
        return;
    }
    var token = req.get('Authorization').split(' ')[1];
    var debtId = Number(req.params.debtId);
    var action = req.query.action;
    if (token && util_1.isNumber(debtId) && action) {
        jwt.verify(token, secretKey, function (err, decoded) {
            if (err) {
                res.status(403);
                res.send(new Error_1.Error(403, "Bad credentials"));
            }
            else {
                connection.query("SELECT * FROM debts WHERE id=\"" + debtId + "\"", function (err, results) {
                    if (err) {
                        HttpHelper_1.HttpHelper.InternalServerError(res);
                    }
                    else if (results[0]) {
                        var debt = results[0];
                        var status = null;
                        if (action === "unconfirmed" || action === "pending" || action === "cancled" || action === "done")
                            status = action;
                        if (status === 'done' && debt.status !== 'pending') {
                            HttpHelper_1.HttpHelper.BadRequest(res);
                        }
                        else {
                            if (debt.status === 'unconfirmed' && debt.creator === decoded.userId) {
                                HttpHelper_1.HttpHelper.Unauthorized(res);
                            }
                            else {
                                if (status) {
                                    if (debt.lender === decoded.userId || debt.debtor === decoded.userId) {
                                        // Atnaujinam skolos statusą
                                        connection.query("UPDATE debts SET status = \"" + status + "\" WHERE id=\"" + debtId + "\"", function (err, result) {
                                            if (err) {
                                                HttpHelper_1.HttpHelper.InternalServerError(res);
                                            }
                                            else {
                                                HttpHelper_1.HttpHelper.Ok(res);
                                            }
                                        });
                                    }
                                    else {
                                        HttpHelper_1.HttpHelper.Unauthorized(res);
                                    }
                                }
                                else {
                                    HttpHelper_1.HttpHelper.BadRequest(res);
                                }
                            }
                        }
                    }
                });
            }
        });
    }
});
app.get('/user/:userId/debt/', function (req, res) {
    console.log('Bando gauti skolas');
    if (!req.get('Authorization')) {
        HttpHelper_1.HttpHelper.BadRequest(res);
        return;
    }
    var token = req.get('Authorization').split(' ')[1];
    var userId = Number(req.params.userId);
    if (req.params.userId && util_1.isNumber(userId)) {
        jwt.verify(token, secretKey, function (err, decoded) {
            if (err) {
                res.status(403);
                res.send(new Error_1.Error(403, "Bad credentials"));
            }
            else {
                // Getting user debts
                if (decoded.userId === userId) {
                    var sql = "";
                    switch (req.query.type) {
                        case "debtor":
                            sql =
                                "SELECT * FROM debts WHERE debtor=\"" + userId + "\"";
                            break;
                        case "lender":
                            sql =
                                "SELECT * FROM debts WHERE lender=\"" + userId + "\"";
                            break;
                        default:
                            sql =
                                "SELECT d.creator AS creator, d.id AS id, d.due_date AS dueDate, d.amount AS amount, d.status AS status, d.debtor AS debtor, d.lender AS lender, debtor.name AS debtorName, lender.name AS lenderName\n                FROM debts AS d\n                JOIN users AS lender ON d.lender = lender.id\n                JOIN users AS debtor ON d.debtor = debtor.id\n                WHERE debtor=\"" + userId + "\" OR lender=\"" + userId + "\"";
                            break;
                    }
                    connection.query(sql, function (err, results) {
                        if (err) {
                            res.status(500);
                            res.send(new Error_1.Error(500, err.code));
                        }
                        else {
                            res.send(results);
                        }
                    });
                }
                else {
                    res.status(403);
                    res.send(new Error_1.Error(403, "You have no permissions to access this user's data."));
                }
            }
        });
    }
    else {
        res.status(400);
        res.send(new Error_1.Error(400, "Bad request"));
    }
});
app.get('/search/user/', function (req, res) {
    if (req.query.value) {
        connection.query("SELECT id, name FROM users WHERE name LIKE \"%" + req.query.value + "%\"", function (err, results) {
            if (err) {
                HttpHelper_1.HttpHelper.InternalServerError(res);
            }
            else {
                res.send(results);
            }
        });
    }
    else {
        HttpHelper_1.HttpHelper.BadRequest(res);
    }
});
function validateToken(token) {
    return new Promise(function (resolve, reject) {
        jwt.verify(token, secretKey, function (err, decoded) {
            if (!err)
                resolve(decoded);
            else
                reject(err);
        });
    });
}
