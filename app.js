window.onload = function() {
    Load();
};

const currentShows = JSON.parse(localStorage.getItem('currentShows')) || {};

const showWatchHistory = JSON.parse(localStorage.getItem('showWatchHistory')) || {};

function enterStart(func, event, parameter){ 
    if (event.key === 'Enter') {
        func(parameter);
    }
}

function addNewShow() {
    const newShow = document.querySelector('#js-new-show-input');
    currentShows[Object.keys(currentShows).length + 1] = {
        showName: newShow.value,
        season: 1,
        episode: 0,
        liveSeason: 1,
        liveEpisode: 1
    };
    showWatchHistory[newShow.value] = {};
    saveCookies();
    Load();
    newShow.value = '';
}

function Load(){
    const showsList = document.querySelector('#js-shows-container')
    showsList.innerHTML = '';
    for(i = 1; i < Object.keys(currentShows).length + 1; i++){
        const showObject = currentShows[i];
        const seasonMinusBoxHTML = `<div class="minus-container"><i class="fa-regular fa-square-minus fa-2xl minus-box" onclick="changeShowNum('${i}', 'season', -1)"></i></div>`
        const episodeMinusBoxHTML = `<div class="minus-container"><i class="fa-regular fa-square-minus fa-2xl minus-box" onclick="changeShowNum('${i}', 'episode', -1)"></i></div>`
        const seasonPlusBoxHTML = `<div class="plus-container"><i class="fa-regular fa-square-plus fa-2xl plus-box" onclick="changeShowNum('${i}', 'season', 1)"></i></div>`
        const episodePlusBoxHTML = `<div class="plus-container"><i class="fa-regular fa-square-plus fa-2xl plus-box" onclick="changeShowNum('${i}', 'episode', 1)"></i></div>`
        showsList.innerHTML += `<div class="show-container"> <h3>${showObject.showName}</h3>
        <P>Last episode watched: Season: ${showObject.season} Episode: ${showObject.episode}</P>
        <div class="adjustable-div"> ${seasonMinusBoxHTML} <p class="adjustable-p"> Season: ${showObject.liveSeason}</p> ${seasonPlusBoxHTML}</div>
        <div class="adjustable-div"> ${episodeMinusBoxHTML} <p class="adjustable-p">Episode: ${showObject.liveEpisode}</p> ${episodePlusBoxHTML}</div>
        <div class="adjustable-div"> <p>Date: </p> <input class="date-box" id="${'Date' + i}" value="${new Date().toJSON().slice(0, 10)}" type="date"></div>
        <button onclick="updateShow(${i}, ${showObject.liveSeason}, ${showObject.liveEpisode})">Watched Season ${showObject.liveSeason} Episode ${showObject.liveEpisode}</button> <div>`
    };
}

function changeShowNum(index, seasonOrEpisode, amount) {
    const showObject = currentShows[index];
    if (seasonOrEpisode === 'season') {
        showObject.liveSeason += amount;
    }
    else {
        showObject.liveEpisode += amount;
    }
    saveCookies();
    Load();
}

function updateShow(index, season, episode) {
    const showObject = currentShows[index];
    showObject.season = season;
    showObject.episode = episode;
    showObject.liveEpisode ++;
    
    showWatchHistory[showObject.showName][Object.keys(showWatchHistory[showObject.showName]).length + 1] = {
        showName: showObject.showName,
        date: document.querySelector('#Date'+ index).value,
        season: season,
        episode: episode
    }
    
    saveCookies();
    Load();
    console.log(showWatchHistory);
}

function saveCookies() {
    localStorage.setItem('currentShows', JSON.stringify(currentShows));
    localStorage.setItem('showWatchHistory', JSON.stringify(showWatchHistory));
}

function deleteAll() {
    localStorage.removeItem('currentShows');
    localStorage.removeItem('showWatchHistory');
    location.reload();
}