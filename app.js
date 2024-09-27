//---------------Service worker-------------------------------------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('sw.js')
      .catch(err => 'SW registration failed'));
}
//----------------------------------------------------------

// var offlineIcon = `<img src = "icons/offline-72.png" alt="status" height="36" width="36">`;
// var onlineIcon = `<img src = "icons/online-72.png" alt="status" height="36" width="36">`;
// window.addEventListener("load", function (e) {
// const onlineStatus = document.getElementById('onlineStatus');

//   if (!navigator.onLine) onlineStatus.innerHTML = offlineIcon;
//   if (navigator.onLine) onlineStatus.innerHTML = onlineIcon;

// });
// window.addEventListener("offline", function (e) { onlineStatus.innerHTML = offlineIcon; });

// window.addEventListener("online", function (e) { onlineStatus.innerHTML = onlineIcon; });


//---------------------------Settings-----------------------------------------------------------------



//let matchdayId ;//string z.: fmd-1092019
let selectedMatchDayId ;//string z.: fmd-1092019
//let matchdayIndex;//int z.B.: 1092019
let matchdayDayNumber;//string z.B: 34
let selectedMatchDayName; //string z.: 34. Spieltag
let competitionId;
let competitionName;

//const opta_ids = { "bl1": "sdc_fmdo-22", "bl2": "sdc_fmdo-87", "bl3": "sdc_fmdo-374", "el": "sdc_fmdo-6", "dfb": "sdc_fmdo-231", "cl": "sdc_fmdo-5" };
//const proxy = "https://api.allorigins.win/get?url=";
const proxy = "https://sj-sam.de/proxy/uniProxy2.php?url=";



const matchdayContainer = document.getElementById('matchdayContainer');
const content1 = document.getElementById('content1');
const content2 = document.getElementById('content2');
const content3 = document.getElementById('content3');
const minusButton = document.getElementById('minusButton');
const plusButton = document.getElementById('plusButton');

const divFupa = document.getElementById("divFupa");
const refreshButton = document.getElementById('refreshButton');
const btnMenu = document.getElementById("btnMenu")

document.getElementById("bl1").addEventListener("click", function () {
  show('sdc_fmdo-22')
  .then(competitionId=>{
    drawStandings(competitionId);
  })
  
});
document.getElementById("bl2").addEventListener("click", function () {
  show('sdc_fmdo-87')
  .then(competitionId=>{
    drawStandings(competitionId);
  })
});
document.getElementById("bl3").addEventListener("click", function () {
  show('sdc_fmdo-374')
  .then(competitionId=>{
    drawStandings(competitionId);
  })
});
document.getElementById("cl").addEventListener("click", function () {
  show('sdc_fmdo-5')
  .then(competitionId=>{
    drawStandings(competitionId);
  })
});
document.getElementById("el").addEventListener("click", function () {
  show('sdc_fmdo-6')
  .then(competitionId=>{
    drawStandings(competitionId);
  })
});
document.getElementById("dfb").addEventListener("click", function () {
  show('sdc_fmdo-231')
  .then(competitionId=>{
    drawStandings(competitionId);
  })
});

document.getElementById("today").addEventListener("click", function () {
  getToday();

});
// document.getElementById("llso").addEventListener("click", function () {
//   competitionName = this.innerHTML;
//   getFupaData('73842');
// });

// document.getElementById("kl").addEventListener("click", function () {
//   competitionName = this.innerHTML;
//   getFupaData('74939');
// });
// document.getElementById("rlb").addEventListener("click", function () {
//   competitionName = this.innerHTML;
//   getFupaData('73836');
// });

minusButton.addEventListener('click', function () {
  changeMatchday(-1);
});

plusButton.addEventListener('click', function () {
  changeMatchday(1);
});
//-------------------------------------------------------------------------------
btnMenu.addEventListener("click", (e) => {
  toggleMenu();
});
//-------------------------------------------------------------------------------

//--------------End of DOM-Settings-----------------------------------------------


//---------------------------------swipe-EventListener----------hammer.js-------------------
// var hammertime = new Hammer(contentTop);
// hammertime.on('swipe', function (ev) {
//   if (ev.direction == 2) {
//     changeMatchday(1);
//   }
//   if (ev.direction == 4) {
//     changeMatchday(-1);
//   }
// });

//-----------------------------------------------------------------------------------
function toggleMenu(){
  //infobox.innerHTML = "";
  let m = document.getElementById("mainMenu");
  if (m.className == "") {
    m.className = "show";
  } else {
    m.className = "";
  }
}
//---------------------------- increase or decrease matchday---------
function changeMatchday(direction) {
  let matchdayIndex = parseInt(selectedMatchDayId.split("-")[1]);//get number from fmd-1091985

  matchdayIndex = matchdayIndex + direction;
  matchdayId = "fmd-"+matchdayIndex;
  show(matchdayId);

  // if (matchdayIndex >= 0 && matchdayIndex <= maxIndex) {
  //   let matchDayId = allMatchdays[matchdayIndex].id;
  //  // getResults(matchDayId);
  // }
}
//-----------------------------------------------------------------------------------------


//--------------- displays results and standings of an opta--------------------------------
async function show(matchDay) {
  content1.innerHTML = "";
  content2.innerHTML = "";
  content3.innerHTML = "";
  content2.innerHTML = `<img src="icons/loading.gif">`;
  const query = `https://frontend-next.sportdaten.t-online.de/api/matches/matchday/daygroups/${matchDay}`;
  const route = proxy+query;
  const response = await (fetch(route));
  const data = await response.json();
  content2.innerHTML="";
  // const data = JSON.parse(json.contents);
  try{matchdayId = data.dayGroups[0].matches[0].matchday.id} catch{};
  try{selectedMatchDayName = data.selectedMatchDay.name} catch{};
  try{selectedMatchDayId = data.selectedMatchDay.id} catch{};
  try{competitionId = data.dayGroups[0].matches[0].competition.id} catch{};
  try{competitionName = data.dayGroups[0].matches[0].competition.name} catch{};
  matchdayContainer.innerHTML = selectedMatchDayName;
  content1.innerHTML = `<h3>${competitionName}</h3>`;
  data.dayGroups.forEach(dayGroup =>{
    
    const h3 = document.createElement("h3");
    let dayGroupDayLabel = "noch kein Datum ";
    try{dayGroupDayLabel = dayGroup.dayLabel} catch{};
    const table = document.createElement("table");
    const headRow = document.createElement("tr");
    table.setAttribute('class', 'tblResults');
    headRow.setAttribute('class', 'headRow');
    headRow.innerHTML = `<td colspan="6">${dayGroupDayLabel}</td>`;
    table.appendChild(headRow);
    dayGroup.matches.forEach(match => {
      let matchTime = "--:--";
      let matchLatestScoreHome = "-";
      let matchLatestScoreAway = "-";
      let matchHomeTeamNameShort = "NN";
      let matchAwayTeamNameShort = "NN";

      if(match.time) matchTime = match.time;
      if(match.homeTeam.name.short) matchHomeTeamNameShort = match.homeTeam.name.short;
      if(match.awayTeam.name.short) matchAwayTeamNameShort = match.awayTeam.name.short;
      try{matchLatestScoreHome = match.latestScore.home} catch{};
      try{matchLatestScoreAway = match.latestScore.away} catch{};
      
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${matchTime}</td><td>${matchHomeTeamNameShort}</td><td>${matchAwayTeamNameShort}</td><td>${matchLatestScoreHome} : ${matchLatestScoreAway}</td>`;
      table.appendChild(tr);
    })
    content2.appendChild(table);
  })
  return competitionId;
}
//------------------------------------------------------------------------------------------------

async function drawStandings(competitionId){
  content3.innerHTML="";
  const query = `https://frontend-next.sportdaten.t-online.de/api/competitions/standingsTable/?competitionId=sdc_fs-${competitionId}`;
  const route = proxy+query;
  const response = await (fetch(route));
  const data = await (response.json());
  // const data = JSON.parse(res_json.contents);


  data.standings.forEach(element => {
    const table = document.createElement("table");
    const headRow = document.createElement("tr");
    table.setAttribute('class', 'tblResults');
    headRow.setAttribute('class', 'headRow');
    headRow.innerHTML = `<td colspan="6">Tabelle</td>`;
    table.appendChild(headRow);
    element.tableBody.rows.forEach(row =>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${row.position}</td><td>${row.played}</td><td>${row.teamName}</td><td>${row.points}</td><td>${row.difference}</td>`;
      table.appendChild(tr);

    })
    content3.appendChild(table);
  });
}




//-------------begin of function getToday-------------------------------------------------------------------------------------------------------
async function getToday() {
  content1.innerHTML = "";
  content2.innerHTML = "";
  content3.innerHTML = "";
  content2.innerHTML = `<img src="icons/loading.gif">`;
  matchdayContainer.innerHTML = "";
  const query = `https://frontend-next.sportdaten.t-online.de/api/matches/day/heute/`;
  const route = proxy+query;
  const response = await fetch(route);
  const data = await response.json();
  // const data = JSON.parse(res_json.contents);
  content2.innerHTML="";
  data.forEach(element => {
    if (element.__typename == "FootballCompetition") {
      const table = document.createElement("table");
      const headRow = document.createElement("tr");
      table.setAttribute('class', 'tblResults');
      headRow.setAttribute('class', 'headRow');
      headRow.innerHTML = `<td class="twenty">Zeit<td class="fifty">${element.name}</td><td class="ten">Erg</td>`;
      table.appendChild(headRow);
      element.sportEvents.forEach(event => {
        let when = event.weekday.substring(0, 2) + " ," + event.time + "<br>" + event.date;
        let result = `<span class= "">-:-</span>`;
        if (event.latestScore && event.state == "LIVE") result = `<span class="live">${event.latestScore.home} : ${event.latestScore.away}`;
        if (event.latestScore && event.state == "FINISHED") result = `<span class="green">${event.latestScore.home} : ${event.latestScore.away}`;
        if (event.latestScore && event.state == "BREAK") result = `<span class="green">${event.latestScore.home} : ${event.latestScore.away}`;
        let row = document.createElement("tr");
        row.innerHTML = `<td>${when}</td><td>${event.homeTeam.name.full}<br>${event.awayTeam.name.full}</td><td>${result}</td>`;
        table.appendChild(row);
      })
      content2.appendChild(table);
    }
  });
}
//---------------------End of function------------------------------------------------------------------------------------------------------



function getFupaData(w) {
  contentTop.innerHTML = "";
  contentBottom.innerHTML="";
  matchdayContainer.innerHTML = "";
  divFupa.innerHTML = "loading!";
  var uri = "https://sj-sam.de/apps/fb5/proxy2.php?w=" + w;
  fetch(uri)
    .then(function (response) {
      console.log(response);
      return response.text();
    })
    .then(function (data) {
      divFupa.innerHTML = data;
    })

}

