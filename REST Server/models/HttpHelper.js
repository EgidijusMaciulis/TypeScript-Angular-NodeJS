"use strict";
exports.__esModule = true;
var Error_1 = require("./Error");
var HttpHelper = /** @class */ (function () {
    function HttpHelper() {
    }
    HttpHelper.BadRequest = function (res) {
        res.status(400);
        res.send(new Error_1.Error(400, "Bad request."));
    };
    HttpHelper.Unauthorized = function (res) {
        res.status(403);
        res.send(new Error_1.Error(403, "Unauthorized."));
    };
    HttpHelper.InternalServerError = function (res) {
        res.status(500);
        res.send(new Error_1.Error(500, "Internal server error."));
    };
    HttpHelper.Ok = function (res) {
        res.status(201);
        res.send({ status: 201, message: "OK" });
    };
    return HttpHelper;
}());
exports.HttpHelper = HttpHelper;
