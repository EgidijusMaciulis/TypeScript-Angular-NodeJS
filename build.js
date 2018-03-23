var Car = (function () {
    function Car(id, modelis, pagaminimoData, spalva, type) {
        this.modelis = modelis;
        this.pagaminimoData = pagaminimoData;
        this.spalva = spalva;
        this.type = type;
        this.id = id;
    }
    return Car;
}());
var cars = [];
var carCount = 0;
var modelioInput = document.getElementById('modelioInput');
var datosInput = document.getElementById('datosInput');
var spalvosInput = document.getElementById('spalvosInput');
var type = document.getElementById('type');
var addButton = document.getElementById('addCar');
var benzinasButton = document.getElementById('addBenzinas');
var dyzelinasButton = document.getElementById('addDyzelinas');
var allButton = document.getElementById('visiTipai');
var table = document.getElementById('table');
addButton.addEventListener('click', function () {
    console.log('Paspaudeme mygtuka!!!!');
    carCount++;
    var car = new Car(carCount, modelioInput.value, datosInput.value, spalvosInput.value, type.value);
    cars.push(car);
    drawCars();
    return;
});
benzinasButton.addEventListener('click', function () {
    console.log('Paspaudeme mygtuka!!!!');
    table.innerHTML = '';
    drawBenzinas();
});
dyzelinasButton.addEventListener('click', function () {
    console.log('Paspaudeme mygtuka!!!!');
    table.innerHTML = '';
    drawDyzelinas();
});
allButton.addEventListener('click', function () {
    console.log('Paspaudeme mygtuka!!!!');
    table.innerHTML = '';
    drawCars();
});
function drawCars() {
    table.innerHTML = '';
    for (var _i = 0, cars_1 = cars; _i < cars_1.length; _i++) {
        var car = cars_1[_i];
        table.innerHTML += "<tr>\n                                <th>Modelis</th>\n                                <th>Pagaminimo data</th>\n                                <th>Spalva</th>\n                                <th>Kuro tipas</th>\n                                <th>Redaguoti</th>\n                                <th>I\u0161trinti</th>\n                            </tr>\n                            \n                            <tr>\n                                <td>" + car.modelis + "</td>\n                                <td>" + car.pagaminimoData + "</td>\n                                <td>" + car.spalva + "</td>\n                                <td>" + car.type + "</td>\n                                <td><img onclick=\"editCar(" + car.id + ")\" class=\"edit\" src=\"images/edit.svg\"></td>\n                                <td><img onclick=\"deleteCar(" + car.id + ")\" class=\"delete\" src=\"images/delete.svg\"></td>\n                            </tr>";
    }
}
function drawBenzinas() {
    table.innerHTML += '';
    for (var i = 0; i < cars.length; i++) {
        if (cars[i].type === 'benzinas') {
            table.innerHTML += "<tr>\n                                    <th>Modelis</th>\n                                    <th>Pagaminimo data</th>\n                                    <th>Spalva</th>\n                                    <th>Kuro tipas</th>\n                                    <th>Redaguoti</th>\n                                    <th>I\u0161trinti</th>\n                                </tr>\n                            \n                                <tr>\n                                    <td>" + cars[i].modelis + "</td>\n                                    <td>" + cars[i].pagaminimoData + "</td>\n                                    <td>" + cars[i].spalva + "</td>\n                                    <td>" + cars[i].type + "</td>\n                                    <td><img onclick=\"editCar(" + cars[i].id + ")\" class=\"edit\" src=\"images/edit.svg\"></td>\n                                    <td><img onclick=\"deleteCar(" + cars[i].id + ")\" class=\"delete\" src=\"images/delete.svg\"></td>\n                                </tr>";
        }
    }
}
function drawDyzelinas() {
    table.innerHTML += '';
    for (var i = 0; i < cars.length; i++) {
        if (cars[i].type === 'dyzelinas') {
            table.innerHTML += "<tr>\n                                    <th>Modelis</th>\n                                    <th>Pagaminimo data</th>\n                                    <th>Spalva</th>\n                                    <th>Kuro tipas</th>\n                                    <th>Redaguoti</th>\n                                    <th>I\u0161trinti</th>\n                                </tr>\n                            \n                                <tr>\n                                    <td>" + cars[i].modelis + "</td>\n                                    <td>" + cars[i].pagaminimoData + "</td>\n                                    <td>" + cars[i].spalva + "</td>\n                                    <td>" + cars[i].type + "</td>\n                                    <td><img onclick=\"editCar(" + cars[i].id + ")\" class=\"edit\" src=\"images/edit.svg\"></td>\n                                    <td><img onclick=\"deleteCar(" + cars[i].id + ")\" class=\"delete\" src=\"images/delete.svg\"></td>\n                                </tr>";
        }
    }
}
function deleteCar(carId) {
    console.log('Ištrynimo mygtukas paspaustas', carId);
    for (var i = 0; i < cars.length; i++) {
        if (cars[i].id === carId) {
            cars.splice(i, 1);
            drawCars();
            return;
        }
    }
}
//# sourceMappingURL=build.js.map