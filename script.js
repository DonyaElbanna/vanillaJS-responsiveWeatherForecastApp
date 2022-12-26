const apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
const apiForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?";
const apiKey = "50cad967ed3c808b110f530438a02e3b";
const input = document.getElementById("city-search").value;
const url = `${apiUrl}q=${input}&appid=${apiKey}&units=metric`;
const cardInfo = document.getElementById("card-info");
const errorMsg = document.getElementById("error-msg");

const btn = document.getElementById("btn");
btn.addEventListener("click", (e) => {
  e.preventDefault();
  const input = document.getElementById("city-search").value;
  fetch(`${apiUrl}q=${input}&appid=${apiKey}&units=metric`)
    .then((response) => response.json())
    .then((data) => {
      let cityData = data.name.includes(" ")
        ? data.name.replace(" ", "")
        : data.name;
      let conutryData = data.sys.country;
      let tempData = data.main.temp;
      let weatherData = data.weather[0].description.toUpperCase();
      let timeZone = data.timezone / 3600;
      let icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.weather[0].icon}.svg`;
      let hour = new Date().toJSON().slice(11, 13);
      let min = new Date().toJSON().slice(13, 16);
      let localHour = Number(hour) + timeZone;
      let localTime = localHour + min;
      let precip = data.snow
        ? data.snow["1h"] + " mm of snow per hour"
        : data.rain
        ? data.rain["1h"] + " mm of rain per hour"
        : "0";
      let wind = data.wind ? data.wind["speed"] + " m/s" : "0";
      let humid = data.main.humidity + "%";

      const div = document.createElement("div");
      div.setAttribute("class", "tempCard");
      const markup = `<div>
        <h3 class="city" style="margin-bottom: 0">${input}, ${conutryData}</h3> 
        <!-- <span id='close'>&#10006;</span> --!>
        <p class="temp"><strong>${Math.round(
          tempData
        )}</strong><sup style="font-size:1.8rem">°C</sup></p>
        <figure class="weather">
        <img src=${icon} alt=${weatherData} class="icon">
        <figcaption>${weatherData}</figcaption>
        </figure>
        <div class="center-btn"><button
        class="btn btn-secondary"
        data-bs-toggle="modal"
        href=#${cityData + conutryData}
        role="button" style="margin-left:0px"
        >More Weather Details</button>
        </div>
        <!-- MODAL ONE --!>
        <div 
        class="modal fade "
        id=${cityData + conutryData}
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal1-bkg">
            <div class="modal-body modal1-body">
              <div id="${cityData + conutryData}info">
              </div>
              <div class="close-btn1">
              <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
              </div>
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-secondary"
                data-bs-target=#${cityData + conutryData + "f"}
                data-bs-toggle="modal"
              >
                View week's forecast
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- MODEL TWO -->
      <div
        class="modal fade"
        id=${cityData + conutryData + "f"}
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal2-bkg">
            <div class="modal-body">
            <h3 class="modal2-title"> ${input + ", " + conutryData}</h3>
              <div id=${
                cityData + conutryData + "forecast"
              } class="forecast-container"> 
              </div>
              <div class="close-btn2">
              <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
              </div>
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-secondary"
                data-bs-target=#${cityData + conutryData}
                data-bs-toggle="modal"
              >
                Previous window
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>`;

      div.innerHTML = markup;
      cardInfo.appendChild(div);

      // const hide = () => {
      //   let tempCard = document.querySelector(".tempCard");
      //   tempCard.style.display = "none";
      // };

      // let closeBtn = document.getElementById("close");
      // closeBtn.onclick = () => hide();

      // MODAL ONE

      const modalOne = document.getElementById(cityData + conutryData);
      modalOne.addEventListener("show.bs.modal", (event) => {
        const button = event.relatedTarget;
        const modalOneBody = document.getElementById(
          cityData + conutryData + "info"
        );
        modalOneBody.innerHTML = `<h3 class="modal1-title">${
          input + ", " + conutryData
        }</h3>
        <p class="info-item">
          <span class="material-symbols-outlined">
            humidity_percentage
          </span>  Humidity: ${humid} </p>
        <p class="info-item">
        <span class="material-symbols-outlined">
          air
        </span>  Wind speed: ${wind} </p>
        <p class="info-item">
          <span class="material-symbols-outlined">
            water_drop
        </span>  Precipitation: ${precip} </p>`;
      });

      // Closing a tempCard

      // MODAL TWO

      const modalTwo = document.getElementById(cityData + conutryData + "f");
      modalTwo.addEventListener("show.bs.modal", (event) => {
        const button = event.relatedTarget;
        const inputForecast = input + "," + conutryData;

        fetch(
          `${apiForecastUrl}q=${inputForecast}&appid=${apiKey}&units=metric`
        )
          .then((response) => response.json())
          .then((data) => {
            let forecastDays = [];
            let forecastTemps = [];
            let forecastObjArr = [];
            for (let i = 0; i < data.list.length; i++) {
              // let weekDay = forecastDay.slice(0, 4);
              let forecastDay = new Date(data.list[i].dt * 1000)
                .toString()
                .slice(0, 24);
              let forecastTemp = Math.round(data.list[i].main.temp);
              let forecastIcon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.list[i].weather[0].icon}.svg`;
              let forecastDes =
                data.list[i].weather[0].description.toUpperCase();
              forecastDays.push(new Date(forecastDay));
              forecastTemps.push(forecastTemp);

              let forecastObj = {
                day: forecastDay,
                temp: forecastTemp,
                icon: forecastIcon,
                des: forecastDes,
              };
              forecastObjArr.push(forecastObj);
            }

            let endData = {};

            for (const [key, value] of Object.entries(forecastObjArr)) {
              // key being the numerical key - 0, 1, etc, and value being the associated json
              // going with the value, we can extract the day and the date (we'll use slice and the first 15 characters for that) from the timestamp-like format, and the associated temperature
              const dayEndData = parseInt(value.day.slice(8, 10));
              const tempEndData = value.temp;
              const iconEndData = value.icon;
              const desEndData = value.des;
              const dayDateEndData = value.day.slice(0, 10);
              // next, we check if the day already exists in the endData object
              if (!endData[dayEndData]) {
                // if it doesn't, we'll add it, and set the min and max temp values to the current temp value, just so we have something to work with later on
                endData[dayEndData] = {
                  min: tempEndData,
                  max: tempEndData,
                  icon: iconEndData,
                  des: value.des,
                  date: dayDateEndData,
                };
              } else {
                // if our day is already in the endData object, we'll update the min and max temp values if necessary
                // the new min value for the current day will be whatever is the lower value between what was already in the endData object, and what we're currently getting with const temp. The same goes for max value
                endData[dayEndData].min = Math.min(
                  endData[dayEndData].min,
                  tempEndData
                );
                endData[dayEndData].max = Math.max(
                  endData[dayEndData].max,
                  tempEndData
                );
              }
            }
            const modalTwoBody = document.getElementById(
              cityData + conutryData + "forecast"
            );
            //if there's only the title in the modal body, populate with data, else don't repopulate (means there's already forecast data)
            if (modalTwoBody.childNodes.length === 1) {
              let days = Object.keys(endData);
              days.forEach((day) => {
                const forecastDiv = document.createElement("div");
                forecastDiv.setAttribute("class", "forecast-day");
                forecastDiv.innerHTML = `<h3 class="modal2-date">${endData[day].date}</h3>
              <figure>
              <img src=${endData[day].icon} class="modal2-icon">
              <figcaption>${endData[day].des}</figcaption>
              </figure>
              <div class="modal2-temp">Low: <strong class="modal2-no">${endData[day].min} </strong>°C</div>
              <div class="modal2-temp">High: <strong class="modal2-no">${endData[day].max} </strong>°C</div>`;
                modalTwoBody.appendChild(forecastDiv);
              });
            } else {
              // console.log(modalTwoBody.childNodes);
              return;
            }
          });
      });

      // getting values for the searched cities
      let cityInput = document.querySelectorAll(".city");
      let cityItem, i;
      let citiesArr = [];
      let fullCitiesArr = [];
      for (i = 0; i < cityInput.length; i++) {
        // if searched input doesn't contain country code
        if (!input.toLowerCase().includes(",")) {
          // not a duplicate search
          if (!citiesArr.includes(input.toLowerCase())) {
            citiesArr.push(cityInput[i].innerHTML.toLowerCase().split(",")[0]);
            // console.log(citiesArr);
          } else {
            //if search input is duplicate
            const duplicateToast = document.getElementById("duplicateToast");
            const toast = new bootstrap.Toast(duplicateToast);
            toast.show();
            div.style.display = "none";
          }
          // if search input contains country code
        } else if (!fullCitiesArr.includes(input.toLowerCase())) {
          fullCitiesArr.push(cityInput[i].innerHTML.toLowerCase());
          // console.log(fullCitiesArr);
        } else {
          const duplicateToast = document.getElementById("duplicateToast");
          const toast = new bootstrap.Toast(duplicateToast);
          toast.show();
          div.style.display = "none";
        }
      }
    })
    // incorrect city name entered
    .catch((error) => {
      const errorToast = document.getElementById("errorToast");
      const toast = new bootstrap.Toast(errorToast);
      toast.show();
      console.log(error);
    });
  document.getElementById("city-search").value = "";
  document.getElementById("city-search").focus();
});

// console.log(document.getElementsByClassName("close"));

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
