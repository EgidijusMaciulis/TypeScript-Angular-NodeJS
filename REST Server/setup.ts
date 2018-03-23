import * as mysql from 'mysql';
import {MysqlError} from "mysql";

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'asdasd',
});

connection.connect((err: MysqlError) => {
    if (err)
        console.log("MySQL connection error" + err.code);
    else
        console.log('Connected to MySQL');

    if (process.argv[2] === 'delete') {
        // Trinama duomenų bazė
        connection.query('DROP DATABASE restdb', (err: MysqlError | null, results?: any) => {
            if (err)
                console.log('Nepavyko ištrinti duomenų bazės');
            else
                console.log('Duomenų bazė restdb ištrinta');
        });
    } else {

        // Sukuriama duomenų bazė ir lentelės
        let dbPromise = new Promise((resolve, reject) => {
            connection.query('CREATE DATABASE restdb', (err: MysqlError | null, results?: any) => {
                if (err) {
                    // Mysql error
                    reject(err.code);
                } else {
                    resolve('Duomenų "restdb" bazė sukurta');
                }
            });
        });

        dbPromise.catch((err: any) => {
            // Neavyko sukurti duomenų bazės
            console.log(err);
        }).then((value: any) => {
            // Pavyko sukurti duomenų bazę
            console.log(value)

            connection.query(`CREATE TABLE restdb.users(
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
                email VARCHAR(50) NOT NULL,
                password VARCHAR(150) NOT NULL,
                name VARCHAR(50) NOT NULL)`, (err: MysqlError | null, results?: any) => {
                if (err)
                    console.log(err.code);
                else
                    console.log('Pavyko sukurti lentelę "users"');
            });

            connection.query(`CREATE TABLE restdb.debts(
                id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                amount INT UNSIGNED NOT NULL,
                debtor INT UNSIGNED NOT NULL,
                lender INT UNSIGNED NOT NULL,
                status VARCHAR(25) NOT NULL,
                creator INT UNSIGNED NOT NULL,
                due_date DATE NOT NULL
            )`, (err: MysqlError | null, results?: any) => {
                if (err)
                    console.log(err.code);
                else
                    console.log('Pavyko sukurti lentelę "debts"');
            });

            connection.query(`CREATE TABLE restdb.friendships(
                id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                user1 INT,
                user2 INT,
                status VARCHAR(20))`, (err: MysqlError | null, results?: any) => {
                if (err)
                    console.log(err.code);
                else
                    console.log('Pavyko sukurti lentelę "friendships"');
            });

        });
    }
});




