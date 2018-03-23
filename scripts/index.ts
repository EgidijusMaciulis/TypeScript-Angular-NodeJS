/// <reference path="Car.ts"/>

let cars: Car[] = [];

let carCount: number = 0;

let modelioInput: any = document.getElementById('modelioInput');
let datosInput: any = document.getElementById('datosInput');
let spalvosInput: any = document.getElementById('spalvosInput');
let type: any = document.getElementById('type');

let addButton: any = document.getElementById('addCar');

let benzinasButton: any = document.getElementById('addBenzinas');
let dyzelinasButton: any = document.getElementById('addDyzelinas');
let allButton: any = document.getElementById('visiTipai');

let table: any = document.getElementById('table');



addButton.addEventListener('click', () => {
    console.log('Paspaudeme mygtuka!!!!');

    carCount++;
    let car = new Car(carCount, modelioInput.value, datosInput.value, spalvosInput.value, type.value);
    cars.push(car);
    drawCars();
    return;
});

benzinasButton.addEventListener('click', () => {
    console.log('Paspaudeme mygtuka!!!!');
    table.innerHTML = '';
    drawBenzinas();
});

dyzelinasButton.addEventListener('click', () => {
    console.log('Paspaudeme mygtuka!!!!');
    table.innerHTML = '';
    drawDyzelinas();
});

allButton.addEventListener('click', () => {
    console.log('Paspaudeme mygtuka!!!!');
    table.innerHTML = '';
    drawCars();
});


// Visu automobiliu atvaizdavimo funkcija

function drawCars(): void {
    table.innerHTML = '';
    for (let car of cars) {

        table.innerHTML += `<tr>
                                <th>Modelis</th>
                                <th>Pagaminimo data</th>
                                <th>Spalva</th>
                                <th>Kuro tipas</th>
                                <th>Redaguoti</th>
                                <th>Ištrinti</th>
                            </tr>
                            
                            <tr>
                                <td>${car.modelis}</td>
                                <td>${car.pagaminimoData}</td>
                                <td>${car.spalva}</td>
                                <td>${car.type}</td>
                                <td><img onclick="editCar(${car.id})" class="edit" src="images/edit.svg"></td>
                                <td><img onclick="deleteCar(${car.id})" class="delete" src="images/delete.svg"></td>
                            </tr>`;
    }
}


// Benziniu automobiliu atvaizdavimo funkcija

function drawBenzinas(): void {
    table.innerHTML += '';
    for (let i=0; i < cars.length; i++) {
        if (cars[i].type === 'benzinas') {
            table.innerHTML += `<tr>
                                    <th>Modelis</th>
                                    <th>Pagaminimo data</th>
                                    <th>Spalva</th>
                                    <th>Kuro tipas</th>
                                    <th>Redaguoti</th>
                                    <th>Ištrinti</th>
                                </tr>
                            
                                <tr>
                                    <td>${cars[i].modelis}</td>
                                    <td>${cars[i].pagaminimoData}</td>
                                    <td>${cars[i].spalva}</td>
                                    <td>${cars[i].type}</td>
                                    <td><img onclick="editCar(${cars[i].id})" class="edit" src="images/edit.svg"></td>
                                    <td><img onclick="deleteCar(${cars[i].id})" class="delete" src="images/delete.svg"></td>
                                </tr>`;
        }
    }
}

// Dyzeliniu automobiliu atvaizdavimo funkcija

function drawDyzelinas(): void {
    table.innerHTML += '';
    for (let i=0; i < cars.length; i++) {
        if (cars[i].type === 'dyzelinas') {
            table.innerHTML += `<tr>
                                    <th>Modelis</th>
                                    <th>Pagaminimo data</th>
                                    <th>Spalva</th>
                                    <th>Kuro tipas</th>
                                    <th>Redaguoti</th>
                                    <th>Ištrinti</th>
                                </tr>
                            
                                <tr>
                                    <td>${cars[i].modelis}</td>
                                    <td>${cars[i].pagaminimoData}</td>
                                    <td>${cars[i].spalva}</td>
                                    <td>${cars[i].type}</td>
                                    <td><img onclick="editCar(${cars[i].id})" class="edit" src="images/edit.svg"></td>
                                    <td><img onclick="deleteCar(${cars[i].id})" class="delete" src="images/delete.svg"></td>
                                </tr>`;
        }
    }
}


// Automobiliu istrinimas

function deleteCar(carId: number): void {
    console.log('Ištrynimo mygtukas paspaustas', carId);

    for (let i = 0; i < cars.length; i++) {
        if (cars[i].id === carId) {
            cars.splice(i, 1);
            drawCars();
            return;
        }
    }
}
// Automobiliu atnaujinimas
//
// function carEdit(id): void {
//
//     for (let i = 0; i < cars.length; i++) {
//         if (cars[i].id == id) {
//             modelioInput.value = cars[i].modelis;
//             datosInput.value = cars[i].pagaminimoData;
//             spalvosInput.value = cars[i].spalva;
//             type.value = cars[i].type;
//             return;
//         }
//     }
// }

