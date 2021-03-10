if (navigator.geolocation) {
    console.log('Geolocation is supported!');
}
else {
    console.log('Geolocation is not supported for this Browser/OS version yet.');
}

let latitude;
let longitude;
const loc = (latitude, longitude) => {
    fetch(`https://community-open-weather-map.p.rapidapi.com/forecast?units=metric&lat=${latitude}&lon=${longitude}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "29fc1a655fmsh424fa4327ee5de8p123dc4jsn9b2fc6baa3ea",
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
        }
    })
        .then(function (resp) {
        return resp.json()
        })
        .then(function (data) {
        console.log(data)
        document.querySelector('h1').textContent = data.city.name;
        document.querySelector('.current-temperature').innerHTML = Math.round(data.list[0].main.temp) + '&deg;';
        document.getElementById("wind-0").innerHTML = `${data.list[0].wind.speed}km/h`;
        document.getElementById("cloud-0").innerHTML = `${data.list[0].clouds.all}%`;
        document.getElementById("pressure-0").innerHTML = `${data.list[0].main.pressure}`;
        document.getElementById("humidity-0").innerHTML = `${data.list[0].main.humidity}%`;
        document.getElementById("cords-0").innerHTML = `${data.city.coord.lat} && ${data.city.coord.lon}`;
        document.querySelector('.current-image').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png">`;
        })
        .catch(function () {
        });
}

function cit(city) {
    console.log("3");
    fetch(`https://community-open-weather-map.p.rapidapi.com/weather?q=${city}&units=metric`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "29fc1a655fmsh424fa4327ee5de8p123dc4jsn9b2fc6baa3ea",
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
        }
    })
        .then(function (resp) {
            console.log("4");
            return resp.json();
        })
        .then(function (data) {
            console.log(data)
            console.log("7");
            document.getElementById(`temp-${city}`).innerHTML = Math.round(data.main.temp) + '&deg;';
            document.getElementById(`wind-${city}`).innerHTML = `${data.wind.speed}km/h`;
            document.getElementById(`cloud-${city}`).innerHTML = `${data.clouds.all}%`;
            document.getElementById(`pressure-${city}`).innerHTML = `${data.main.pressure}`;
            document.getElementById(`humidity-${city}`).innerHTML = `${data.main.humidity}%`;
            document.getElementById(`cords-${city}`).innerHTML = `${data.coord.lat} && ${data.coord.lon}`;
            document.getElementById(`img-${city}`).innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`;
        })
        .catch(function () {
        });
}


const geoSuccess = (position) => {
     return loc(position.coords.latitude, position.coords.longitude)
};
const geoError = (error) => {
    latitude = 59.938;
    longitude = 30.314;
    console.error(error);
    return loc(latitude, longitude);
};

window.onload = () => {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}



document.querySelector(".desktop-ref").onclick = function () {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}
document.querySelector(".mobile-ref").onclick = function () {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}
document.querySelector(".add-button").onclick = function () {
    console.log(document.querySelector(".search-type").value);
    const val = document.querySelector(".search-type").value;
    if (val !== "") {
        localStorage.setItem(val, val)
        document.querySelector(".reg-container").firstElementChild.insertAdjacentHTML('beforebegin', `<li class="fav">
                <h3>${val}</h3>
                <button class="button close-button">X</button>
                <span class="regular-temperature" id="temp-${val}">8&degC</span>
                <div class="city-image" id="img-${val}"></div>
                <ul class="inner-ul">
                    <li class="condition">
                        <div class="feature">Ветер</div><div class="feature-content" id="wind-${val}"></div>
                    </li>
                    <li class="condition">
                        <div class="feature">Облачность</div><div class="feature-content" id="cloud-${val}"></div>
                    </li>
                    <li class="condition">
                        <div class="feature">Давление</div><div class="feature-content"id="pressure-${val}"></div>
                    </li>
                    <li class="condition">
                        <div class="feature">Влажность</div><div class="feature-content" id="humidity-${val}"></div>
                    </li>
                    <li class="condition">
                        <div class="feature">Координаты</div><div class="feature-content" id="cords-${val}"></div>
                    </li>
                </ul>
            </li>`);
        console.log("1");
        cit(val);
        console.log("2");
    }
    return false;
}