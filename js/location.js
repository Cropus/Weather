//                      CHECK FOR GEOLOCATION API
if (navigator.geolocation) {
    console.log('Geolocation is supported!');
} else {
    alert("Geolocation is not supported for this Browser/OS version yet.");
}

//                      CALLBACKS FOR GEOLOCATION
// Callback for success
const geoSuccess = (position) => {
    return fetchByLocation(position.coords.latitude, position.coords.longitude)
};
// Callback for error
const geoError = (error) => {
    console.error(error);
    return fetchByLocation(59.937500, 30.308611);
};




//                      FETCH-METHODS
// Use only for current-section
const fetchByLocation = (latitude, longitude) => {
    fetch(`https://community-open-weather-map.p.rapidapi.com/forecast?units=metric&lat=${latitude}&lon=${longitude}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "294cdc2942msh00e9cefa5ffe8d7p1dd66ejsncbd442974b97",
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
        }
    })
        .then((res) => {
            if (res.status >= 200 && res.status < 300) {
                return res.json();
            } else {
                let error = new Error();
                if (res.status >= 500 && res.status < 600) {
                    alert("server error, " + res.status);
                } else if (res.status >= 400 && res.status < 500) {
                    alert("client error, " + res.status);
                } else if (res.status >= 300 && res.status < 400) {
                    alert("redirection, " + res.status);
                }
                error.response = res;
                throw error;
            }
        })
        .then(function (data) {
            // Set regular location weather-data
            setCurrent(data);
        })
        .catch ((e) => {
            if (!navigator.onLine) {
                alert("Please, check your network connection");
            }
            console.log(e);
            document.querySelector('h1').textContent = "Ошибка";
        });

}
// Use only for regular-section
function fetchByCity (city) {
    let ans = "";
    fetch(`https://community-open-weather-map.p.rapidapi.com/weather?q=${city}&units=metric`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "294cdc2942msh00e9cefa5ffe8d7p1dd66ejsncbd442974b97",
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
        }
    })
        .then((res) => {
            if (res.status >= 200 && res.status < 300) {
                return res.json();
            } else {
                let error = new Error();
                if (res.status >= 500 && res.status < 600) {
                    alert("server error, " + res.status);
                } else if (res.status >= 400 && res.status < 500) {
                    alert("client error, " + res.status);
                } else if (res.status >= 300 && res.status < 400) {
                    alert("redirection, " + res.status);
                }
                error.response = res;
                throw error;
            }
        })
        .then(function (data) {
            // Set regular location weather-data
            setRegular(city, data);
            ans = data.id;
        })
        .catch ((e) => {
            if (!navigator.onLine) {
                alert("Please, check your network connection");
            }
            console.log(e);
            if (document.getElementById(`li-${city}`) !== null) {
                document.getElementById(`li-${city}`).remove();
            }
            localStorage.removeItem(city);
        });
    return ans;
}



//                      SET-METHODS FOR SECTIONS
function setCurrent(data) {
    document.querySelector('h1').textContent = data.city.name;
    document.querySelector('.current-temperature').innerHTML = Math.round(data.list[0].main.temp) + '&deg;';
    document.getElementById("wind-0").innerHTML = `${data.list[0].wind.speed}km/h`;
    document.getElementById("cloud-0").innerHTML = `${data.list[0].clouds.all}%`;
    document.getElementById("pressure-0").innerHTML = `${data.list[0].main.pressure}`;
    document.getElementById("humidity-0").innerHTML = `${data.list[0].main.humidity}%`;
    document.getElementById("cords-0").innerHTML = `${data.city.coord.lat} && ${data.city.coord.lon}`;
    document.querySelector('.current-image').src = `./icons/${data.list[0].weather[0].icon}.png`;
}
function setRegular(city, data) {
    document.getElementById(`temp-${city}`).innerHTML = Math.round(data.main.temp) + '&deg;';
    document.getElementById(`wind-${city}`).innerHTML = `${data.wind.speed}km/h`;
    document.getElementById(`cloud-${city}`).innerHTML = `${data.clouds.all}%`;
    document.getElementById(`pressure-${city}`).innerHTML = `${data.main.pressure}`;
    document.getElementById(`humidity-${city}`).innerHTML = `${data.main.humidity}%`;
    document.getElementById(`cords-${city}`).innerHTML = `${data.coord.lat} && ${data.coord.lon}`;
    document.getElementById(`img-${city}`).src = `./icons/${data.weather[0].icon}.png`;
}



//                      OTHER METHODS
// Add template-container on page (and close-button for it)
function add(value) {
    // Create template-container for regular city
    if ('content' in document.createElement('template')) {
        var template = document.querySelector('#template');
        var container = document.querySelector('.reg-container');
        var c = template.content;
        c.querySelector('h3').textContent = value;
        c.querySelector('button').id = `close-${value}`;
        c.querySelector('span').id = `temp-${value}`;
        c.querySelector('img').id = `img-${value}`;
        c.querySelector('.fav').id = `li-${value}`;
        let features = c.querySelectorAll('.feature-content');
        features[0].id = `wind-${value}`;
        features[1].id = `cloud-${value}`;
        features[2].id = `pressure-${value}`;
        features[3].id = `humidity-${value}`;
        features[4].id = `cords-${value}`;
        container.appendChild(c.cloneNode(true));
    } else {
        document.querySelector(".reg-container").insertAdjacentHTML('beforeend', `<li class="fav" id="li-${value}">
                <h3>${value}</h3>
                <button class="button close-button" id="close-${value}">X</button>
                <span class="regular-temperature" id="temp-${value}">?&degC</span>
                <img class="city-image" id="img-${value}" src="./icons/unknown.png" alt="tmp">
                <ul class="inner-ul">
                    <li class="condition">
                        <div class="feature">Ветер</div><div class="feature-content" id="wind-${value}">&#8634</div>
                    </li>
                    <li class="condition">
                        <div class="feature">Облачность</div><div class="feature-content" id="cloud-${value}">&#8634</div>
                    </li>
                    <li class="condition">
                        <div class="feature">Давление</div><div class="feature-content" id="pressure-${value}">&#8634</div>
                    </li>
                    <li class="condition">
                        <div class="feature">Влажность</div><div class="feature-content" id="humidity-${value}">&#8634</div>
                    </li>
                    <li class="condition">
                        <div class="feature">Координаты</div><div class="feature-content" id="cords-${value}">&#8634</div>
                    </li>
                </ul>
            </li>`);
    }
    // Set close-button for template-container
    document.getElementById(`close-${value}`).onclick = () => {
        document.getElementById(`li-${value}`).remove();
        localStorage.removeItem(value);
    }
}



//                      BUTTONS
// Set refresh-button for desktop version
document.querySelector(".desktop-ref").onclick = function () {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}
// Set refresh-button for mobile version
document.querySelector(".mobile-ref").onclick = function () {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}
// Set add-button for favorite-section
document.querySelector(".add-button").onclick = function () {
    const value = document.querySelector(".search-type").value;
    // add(value);
    // let id = fetchByCity(value);
    // let flag = false;
    // for (var i = 0; i < localStorage.length; i++) {
    //     if (localStorage.getItem(localStorage.key(i)) === id) {
    //         flag = true;
    //     }
    // }
    // if (value !== "" && !flag) {
    //     localStorage.setItem(value, id);
    // } else {
    //     document.getElementById(`li-${value}`).remove();
    // }
    let flag = false;
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) === value) {
            flag = true;
        }
    }
    if (value !== "" && !flag) {
        add(value);
        let id = fetchByCity(value);
        localStorage.setItem(value, id);
        // for (var i = 0; i < localStorage.length; i++) {
        //     if (localStorage.getItem(localStorage.key(i)) === id) {
        //         flag = true;
        //         console.log(id);
        //     }
        // }
        // if (!flag) {
        //     localStorage.setItem(value, id);
        // } else {
        //     document.getElementById(`li-${value}`).remove();
        // }
    }
    // if (value !== "") {
    //     add(value);
    //     let id = fetchByCity(value);
    //     for (var i = 0; i < localStorage.length; i++) {
    //         if (localStorage.getItem(localStorage.key(i)) === id) {
    //             flag = true;
    //         }
    //     }
    //     if (!flag) {
    //         localStorage.setItem(value, id);
    //     } else {
    //         document.getElementById(`li-${value}`).remove();
    //     }
    // }
    document.querySelector(".search-type").value = "";
    return false;
}



//                      PAGE START
window.onload = () => {
    // Get geolocation
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);


    // Add favorite cities
    for (let i = localStorage.length - 1; i >= 0; i--) {
        add(localStorage.key(i));
    }
    // Set weather-data on favorite cities
    for (let i = localStorage.length - 1; i >= 0; i--) {
        setTimeout(fetchByCity, (localStorage.length - i) * 2000, localStorage.key(i));
    }
}