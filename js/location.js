if (navigator.geolocation) {
    console.log('Geolocation is supported!');
}
else {
    console.log('Geolocation is not supported for this Browser/OS version yet.');
}
var problemsAPI = false;

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
        console.log(data);
        problemsAPI = false;
        document.querySelector('h1').textContent = data.city.name;
        document.querySelector('.current-temperature').innerHTML = Math.round(data.list[0].main.temp) + '&deg;';
        document.getElementById("wind-0").innerHTML = `${data.list[0].wind.speed}km/h`;
        document.getElementById("cloud-0").innerHTML = `${data.list[0].clouds.all}%`;
        document.getElementById("pressure-0").innerHTML = `${data.list[0].main.pressure}`;
        document.getElementById("humidity-0").innerHTML = `${data.list[0].main.humidity}%`;
        document.getElementById("cords-0").innerHTML = `${data.city.coord.lat} && ${data.city.coord.lon}`;
        document.querySelector('.current-image').src = `./icons/${data.list[0].weather[0].icon}.png`;
        })
        .catch(function () {
            if (!problemsAPI) {
                problemsAPI = true;
                alert("Problems with API")
            }
        });
}

function cit(city) {
    fetch(`https://community-open-weather-map.p.rapidapi.com/weather?q=${city}&units=metric`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "29fc1a655fmsh424fa4327ee5de8p123dc4jsn9b2fc6baa3ea",
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
        }
    })
        .then(function (resp) {
            return resp.json();
        })
        .then(function (data) {
            console.log(data)
            problemsAPI = false;
            document.getElementById(`temp-${city}`).innerHTML = Math.round(data.main.temp) + '&deg;';
            document.getElementById(`wind-${city}`).innerHTML = `${data.wind.speed}km/h`;
            document.getElementById(`cloud-${city}`).innerHTML = `${data.clouds.all}%`;
            document.getElementById(`pressure-${city}`).innerHTML = `${data.main.pressure}`;
            document.getElementById(`humidity-${city}`).innerHTML = `${data.main.humidity}%`;
            document.getElementById(`cords-${city}`).innerHTML = `${data.coord.lat} && ${data.coord.lon}`;
            document.getElementById(`img-${city}`).src = `./icons/${data.weather[0].icon}.png`;
        })
        .catch(function () {
            if (!problemsAPI) {
                problemsAPI = true;
                alert("Problems with API")
                var li = document.getElementById(`li-${city}`);
                li.remove();
                localStorage.removeItem(city);
            }
        });
}


const geoSuccess = (position) => {
     return loc(position.coords.latitude, position.coords.longitude)
};
const geoError = (error) => {
    console.error(error);
    return cit("St. Petersburg");
};

window.onload = () => {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    for (let i = 0; i < localStorage.length; i++) {
        setTimeout(add, (i+1)*2000, localStorage.getItem(localStorage.key(i)));
    }
}

function add(val) {
    document.querySelector(".reg-container").insertAdjacentHTML('afterbegin', `<li class="fav" id="li-${val}">
                <h3>${val}</h3>
                <button class="button close-button" id="close-${val}">X</button>
                <span class="regular-temperature" id="temp-${val}">?&degC</span>
                <img class="city-image" id="img-${val}" src="./icons/unknown.png" alt="tmp">
                <ul class="inner-ul">
                    <li class="condition">
                        <div class="feature">Ветер</div><div class="feature-content" id="wind-${val}"></div>
                    </li>
                    <li class="condition">
                        <div class="feature">Облачность</div><div class="feature-content" id="cloud-${val}"></div>
                    </li>
                    <li class="condition">
                        <div class="feature">Давление</div><div class="feature-content" id="pressure-${val}"></div>
                    </li>
                    <li class="condition">
                        <div class="feature">Влажность</div><div class="feature-content" id="humidity-${val}"></div>
                    </li>
                    <li class="condition">
                        <div class="feature">Координаты</div><div class="feature-content" id="cords-${val}"></div>
                    </li>
                </ul>
            </li>`);
    document.getElementById(`close-${val}`).onclick = () => {
        var li = document.getElementById(`li-${val}`);
        li.remove();
        localStorage.removeItem(val);
    }
    cit(val);
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
        add(val);
    }
    return false;
}

