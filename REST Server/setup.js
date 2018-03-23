"use strict";
exports.__esModule = true;
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'asdasd'
});
connection.connect(function (err) {
    if (err)
        console.log("MySQL connection error" + err.code);
    else
        console.log('Connected to MySQL');
    if (process.argv[2] === 'delete') {
        // Trinama duomenų bazė
        connection.query('DROP DATABASE restdb', function (err, results) {
            if (err)
                console.log('Nepavyko ištrinti duomenų bazės');
            else
                console.log('Duomenų bazė restdb ištrinta');
        });
    }
    else {
        // Sukuriama duomenų bazė ir lentelės
        var dbPromise = new Promise(function (resolve, reject) {
            connection.query('CREATE DATABASE restdb', function (err, results) {
                if (err) {
                    // Mysql error
                    reject(err.code);
                }
                else {
                    resolve('Duomenų "restdb" bazė sukurta');
                }
            });
        });
        dbPromise["catch"](function (err) {
            // Neavyko sukurti duomenų bazės
            console.log(err);
        }).then(function (value) {
            // Pavyko sukurti duomenų bazę
            console.log(value);
            connection.query("CREATE TABLE restdb.users(\n                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,\n                email VARCHAR(50) NOT NULL,\n                password VARCHAR(150) NOT NULL,\n                name VARCHAR(50) NOT NULL)", function (err, results) {
                if (err)
                    console.log(err.code);
                else
                    console.log('Pavyko sukurti lentelę "users"');
            });
            connection.query("CREATE TABLE restdb.debts(\n                id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,\n                amount INT UNSIGNED NOT NULL,\n                debtor INT UNSIGNED NOT NULL,\n                lender INT UNSIGNED NOT NULL,\n                status VARCHAR(25) NOT NULL,\n                creator INT UNSIGNED NOT NULL,\n                due_date DATE NOT NULL\n            )", function (err, results) {
                if (err)
                    console.log(err.code);
                else
                    console.log('Pavyko sukurti lentelę "debts"');
            });
            connection.query("CREATE TABLE restdb.friendships(\n                id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,\n                user1 INT,\n                user2 INT,\n                status VARCHAR(20))", function (err, results) {
                if (err)
                    console.log(err.code);
                else
                    console.log('Pavyko sukurti lentelę "friendships"');
            });
        });
    }
});
