import * as express from 'express';
import * as mysql from 'mysql';
import {Request, Response} from "express";
import {MysqlError} from "mysql";
import * as bodyParser from 'body-parser';
import {Error} from "./models/Error";
import * as jwt from 'jsonwebtoken';
import {isNumber} from "util";
import {HttpHelper} from "./models/HttpHelper";
import {check, header, validationResult} from "express-validator/check";

const port = 9090;
const app = express();
const secretKey = "KLasi67d76asdg";

let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

app.use(bodyParser.json());

app.use(function (req: Request, res: Response, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'slaptas',
    database: 'restdb'
});

connection.connect((err: MysqlError) => {
    if (err)
        console.log("MySQL connection error" + err.code);
    else
        console.log('Connected to MySQL');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/users', (req: Request, res: Response) => {
    console.log('Kažkas bando gauti vartotojus');
    res.send('{"message": "OK"}');
});

app.post('/user', (req: Request, res: Response) => {
    console.log(`Klientas bando sukurti vartotoja ${JSON.stringify(req.body)}`);
    if (req.body.email &&
        req.body.name &&
        req.body.password &&
        req.body.password.length > 5 &&
        emailRegex.exec(req.body.email)) {
        // Atsiusti visi reikalingi duomenys
        connection.query(`SELECT * FROM users WHERE email="${req.body.email}"`,
            (err: MysqlError | null, results?: any) => {
                if (results.length > 0) {
                    // Vartotojas su tokiu email jau egzistuoja
                    res.status(409);
                    res.send(new Error(409, "User already exists"));
                    return;
                } else {
                    connection.query(`INSERT INTO users (email, password, name) VALUES ('${req.body.email}', '${new Buffer(req.body.password).toString('base64')}', '${req.body.name}')`,
                        (err: MysqlError | null, results?: any) => {
                            if (!err) {
                                // Pavyko sukurti vartotoja
                                res.status(201);
                                res.send('{"message":"OK"}');
                                return;
                            } else {
                                res.status(500);
                                res.send(new Error(500, "Internal server error."));
                                return;
                            }
                        });
                }
            });

    } else {
        // Atsiusti ne visi reikalingi duomenys
        res.status(400);
        res.send(new Error(400, "Bad request"));
        return;
    }
});

let loginValidators = [
    check('password').exists().isLength({min: 5}).withMessage('Password is not provided'),
    check('email').exists().isEmail().trim().normalizeEmail().withMessage('Email is not provided or incorect')
];

app.post(`/login`, loginValidators, (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        connection.query(`SELECT * FROM users WHERE email="${req.body.email}" AND password="${new Buffer(req.body.password).toString('base64')}"`,
            (err: MysqlError | null, results?: any) => {
                if (err) {
                    res.status(500);
                    res.send(new Error(500, "Internal server error."));
                } else {
                    if (results.length > 0) {
                        let user = results[0];
                        delete user.password;
                        let token = jwt.sign({userId: user.id}, secretKey);
                        user.token = token;
                        res.send(user);
                    } else {
                        res.status(401);
                        res.send(new Error(401, "Bad credentials."));
                    }
                }
            });
    } else {
        res.status(400);
        res.json(errors.mapped());
    }
});

app.post("/user/debt", (req: Request, res: Response) => {
    let token = req.get('Authorization').split(' ')[1];

    if (token && req.body.amount && req.body.lender && req.body.debtor && req.body.dueDate) {

        jwt.verify(token, secretKey, (err: any, decoded: any) => {
            if (err) {
                // Token is invalid
                res.status(401);
                res.send(new Error(401, "Bad credentials."));
            } else {

                // Token is valid
                if (decoded.userId == req.body.lender || decoded.userId == req.body.debtor) {
                    if (req.body.debtor === req.body.lender) {
                        // Trying to add debt for yourself
                        res.status(400);
                        res.send(new Error(400, "Lender can not be debtor"));
                    } else {
                        // Adding debt
                        connection.query(`INSERT INTO debts (amount, lender, debtor, due_date, status, creator) VALUES ("${req.body.amount}", "${req.body.lender}", "${req.body.debtor}", "${req.body.dueDate}", "unconfirmed", "${decoded.userId}")`,
                            (err: MysqlError | null, results?: any) => {
                                if (err) {
                                    res.status(500);
                                    res.send(new Error(500, "Internal Server Error"));
                                } else {
                                    res.status(201);
                                    res.send('{"message":"OK"}');
                                }
                            });
                    }
                } else {
                    // No permissions for adding debt
                    res.status(403);
                    res.send(new Error(403, "No permissions."));
                }
            }
        });
    } else {
        res.status(400);
        res.send(new Error(400, "Bad request"));
    }
});

app.delete('/debt/:debtId', (req: Request, res: Response) => {
    if (!req.get('Authorization')) {
        HttpHelper.BadRequest(res);
        return;
    }

    let token = req.get('Authorization').split(' ')[1];
    let debtId = Number(req.params.debtId);

    if (token && isNumber(debtId)) {
        jwt.verify(token, secretKey, (err: any, decoded: any) => {
            if (err) {
                res.status(403);
                res.send(new Error(403, "Bad credentials"));
            } else {
                connection.query(`SELECT * FROM debts WHERE id="${debtId}" AND creator="${decoded.userId}"`, (err: MysqlError | null, results?: any) => {
                    if (!err && results.length > 0) {
                        connection.query(`DELETE FROM debts WHERE id="${debtId}"`,
                            (err: MysqlError | null, results?: any) => {
                                if (err)
                                    HttpHelper.InternalServerError(res);
                                else
                                    HttpHelper.Ok(res);
                            });
                    } else {
                        HttpHelper.BadRequest(res);
                    }
                })
            }
        })
    }
});

app.get('/friendships', [header('Authorization').exists()],
    (req: Request, res: Response) => {
        if (validationResult(req).isEmpty()) {
            let token = req.get('Authorization').split(' ')[1];

            validateToken(token).then((decoded: any) => {
                    connection.query(`SELECT name, f.status AS status FROM users AS u JOIN friendships AS f ON u.id=f.user2 WHERE f.user1="${decoded.userId}" 
                    UNION
                    SELECT name, f.status AS status FROM users AS u JOIN friendships AS f ON u.id=f.user1 WHERE f.user2="${decoded.userId}"`,
                        (err: MysqlError, results: any) => {
                            if (err)
                                HttpHelper.InternalServerError(res);
                            else
                                res.json(results);
                        });
                }
            ).catch((err: any) => {
                HttpHelper.Unauthorized(res);
            });
        } else {
            HttpHelper.Unauthorized(res);
        }
    });

app.post('/friendship',
    [
        check('userId').exists().toInt().isNumeric(),
        header('Authorization').exists(),
    ],
    (req: Request, res: Response) => {
        if (validationResult(req).isEmpty()) {
            let token = req.get('Authorization').split(' ')[1];

            jwt.verify(token, secretKey, (err: any, decoded: any) => {
                if (err)
                    HttpHelper.Unauthorized(res);
                else {
                    connection.query(
                        `INSERT INTO friendships VALUES(0, "${decoded.userId}", ${req.body.userId}, "pending")`
                        ,
                        (sqlErr: MysqlError | null, results?: any) => {
                            if (sqlErr)
                                HttpHelper.InternalServerError(res);
                            else {
                                // HttpHelper.Ok(res);
                                connection.query(
                                    `SELECT id, name, 'pending' AS status FROM users WHERE id="${req.body.userId}"`
                                    ,
                                    (err: MysqlError, results: any) => {
                                        if (err)
                                            HttpHelper.InternalServerError(res);
                                        else
                                            res.json(results[0]);
                                    });
                            }
                        });
                }
            });

        } else {
            HttpHelper.BadRequest(res);
        }
    });

app.put('/debt/:debtId', (req: Request, res: Response) => {
    if (!req.get('Authorization')) {
        HttpHelper.BadRequest(res);
        return;
    }

    let token = req.get('Authorization').split(' ')[1];
    let debtId = Number(req.params.debtId);
    let action = req.query.action;

    if (token && isNumber(debtId) && action) {
        jwt.verify(token, secretKey, (err: any, decoded: any) => {
            if (err) {
                res.status(403);
                res.send(new Error(403, "Bad credentials"));
            } else {
                connection.query(
                    `SELECT * FROM debts WHERE id="${debtId}"`
                    ,
                    (err: MysqlError | null, results?: any) => {
                        if (err) {
                            HttpHelper.InternalServerError(res);
                        } else if (results[0]) {
                            let debt = results[0];

                            let status = null;

                            if (action === "unconfirmed" || action === "pending" || action === "cancled" || action === "done")
                                status = action;

                            if (status === 'done' && debt.status !== 'pending') {
                                HttpHelper.BadRequest(res);
                            } else {

                                if (debt.status === 'unconfirmed' && debt.creator === decoded.userId) {
                                    HttpHelper.Unauthorized(res);
                                } else {

                                    if (status) {
                                        if (debt.lender === decoded.userId || debt.debtor === decoded.userId) {
                                            // Atnaujinam skolos statusą
                                            connection.query(
                                                `UPDATE debts SET status = "${status}" WHERE id="${debtId}"`
                                                , (err: MysqlError, result: any) => {
                                                    if (err) {
                                                        HttpHelper.InternalServerError(res);
                                                    } else {
                                                        HttpHelper.Ok(res);
                                                    }
                                                });
                                        } else {
                                            HttpHelper.Unauthorized(res);
                                        }
                                    } else {
                                        HttpHelper.BadRequest(res);
                                    }
                                }
                            }
                        }
                    });
            }
        });
    }
});

app.get('/user/:userId/debt/', (req: Request, res: Response) => {
    console.log('Bando gauti skolas');
    if (!req.get('Authorization')) {
        HttpHelper.BadRequest(res);
        return;
    }

    let token = req.get('Authorization').split(' ')[1];
    let userId = Number(req.params.userId);

    if (req.params.userId && isNumber(userId)) {
        jwt.verify(token, secretKey, (err: any, decoded: any) => {
            if (err) {
                res.status(403);
                res.send(new Error(403, "Bad credentials"));
            } else {
                // Getting user debts
                if (decoded.userId === userId) {
                    let sql = "";

                    switch (req.query.type) {
                        case "debtor":
                            sql =
                                `SELECT * FROM debts WHERE debtor="${userId}"`
                            ;
                            break;
                        case "lender":
                            sql =
                                `SELECT * FROM debts WHERE lender="${userId}"`
                            ;
                            break;
                        default:
                            sql =
                                `SELECT d.creator AS creator, d.id AS id, d.due_date AS dueDate, d.amount AS amount, d.status AS status, d.debtor AS debtor, d.lender AS lender, debtor.name AS debtorName, lender.name AS lenderName
                FROM debts AS d
                JOIN users AS lender ON d.lender = lender.id
                JOIN users AS debtor ON d.debtor = debtor.id
                WHERE debtor="${userId}" OR lender="${userId}"`
                            ;
                            break;
                    }

                    connection.query(sql, (err: MysqlError | null, results?: any) => {
                        if (err) {
                            res.status(500);
                            res.send(new Error(500, err.code));
                        } else {
                            res.send(results);
                        }
                    });
                } else {
                    res.status(403);
                    res.send(new Error(403, "You have no permissions to access this user's data."));
                }
            }
        });
    } else {
        res.status(400);
        res.send(new Error(400, "Bad request"));
    }
});

app.get('/search/user/', (req: Request, res: Response) => {
    if (req.query.value) {
        connection.query(
            `SELECT id, name FROM users WHERE name LIKE "%${req.query.value}%"`
            ,
            (err: any, results?: any) => {
                if (err) {
                    HttpHelper.InternalServerError(res);
                } else {
                    res.send(results);
                }
            });
    } else {
        HttpHelper.BadRequest(res);
    }
});

function validateToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err: any, decoded: any) => {
            if (!err)
                resolve(decoded);
            else
                reject(err);
        });
    });
}
