const apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
const apiKey = "50cad967ed3c808b110f530438a02e3b";
const city = document.getElementById("city-search").value;
const url = `${apiUrl}q=${city}&appid=${apiKey}&units=metric`;
const cardInfo = document.getElementById("card-info");
const errorMsg = document.getElementById("error-msg");

const btn = document.getElementById("btn");
btn.addEventListener("click", (e) => {
  e.preventDefault();
  const city = document.getElementById("city-search").value;
  fetch(`${apiUrl}q=${city}&appid=${apiKey}&units=metric`)
    .then((response) => response.json())
    .then((data) => {
      let cityData = data.name;
      let conutryData = data.sys.country;
      let tempData = data.main.temp;
      let weatherData = data.weather[0].description;
      let timeZone = data.timezone / 3600;
      let icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      let hour = new Date().toJSON().slice(11, 13);
      let min = new Date().toJSON().slice(13, 16);
      let localHour = Number(hour) + timeZone;
      let localTime = localHour + min;
      console.log(
        cityData,
        conutryData,
        tempData,
        weatherData,
        // icon,
        // timeZone,
        // timeZone,
        // parseInt(timeZone),
        localTime
      );

      const div = document.createElement("div");
      div.setAttribute("id", "card");
      const markup = `<div>
    <h3 id="city">${cityData}, <span id="country">${conutryData}</span></h3>
    <p id="temp">Temperature: ${Math.round(tempData)} °C</p>
    <p id="time">Local time: ${localTime}</p>
    <figure id="weather">
    <img src=${icon} alt=${weatherData} id="icon">
    <figcaption>${weatherData}</figcaption>
  </figure>
    </div>`;

      div.innerHTML = markup;
      cardInfo.appendChild(div);
    })
    .catch((error) => {
      // const toastTrigger = document.getElementById("liveToastBtn");
      const toastLiveExample = document.getElementById("liveToast");
      // if (toastTrigger) {
      // btn.addEventListener("click", () => {
      const toast = new bootstrap.Toast(toastLiveExample);
      toast.show();
      // });
      // }
      console.log(error);
    });
});

// Toast

// End Toast

// The old way to fetch data
/*
let request = new XMLHttpRequest();

function getData(e) {
  e.preventDefault();
  const city = document.getElementById("city").value;
  console.log(city);
  request.open(
    "GET",
    "https://api.openweathermap.org/data/2.5/weather?q=cairo&appid=50cad967ed3c808b110f530438a02e3b&units=metric"
  );
  request.send();
  request.onload = () => {
    let dataGot = JSON.parse(request.response);
    const { main, weather } = dataGot;
    console.log(
      dataGot.name,
      dataGot.sys.country,
      dataGot.main.temp,
      dataGot.weather[0].main,
      dataGot.weather[0].icon
    );
  };
}
*/
