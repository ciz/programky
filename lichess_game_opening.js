// ==UserScript==
// @name        lichess rapid games
// @namespace   Violentmonkey Scripts
// @match       https://lichess.org/*
// @grant       none
// @version     1.0
// @author      -
// @description Show opening names on Lichess TV preview games
// ==/UserScript==

(function() {
    'use strict';

      // Add a small CSS style for the label

  if (!document.getElementById('opening-style')) {
    const style = document.createElement('style');
    style.id = 'opening-style';
    style.textContent = `
        .opening-tag {
            font-size: 12px;
            color: #88f;
            margin-top: 4px;
        }
    `;
    document.head.appendChild(style);
}

    // Observe changes to the TV games container

  const pgncache = new Map();

async function getOpening(id) {
   // If we already have a Promise or a final value, return it
    if (pgncache.has(id)) {
        return pgncache.get(id);
    }

    // Create a Promise immediately and store it
    const promise = fetch(`https://lichess.org/game/export/${id}?pgnInJson=true`, {
        headers: { 'Accept': 'application/json' }
    })
    .then(r => r.json())
    .then(data => {
        const opening = data.opening?.name || "Unknown";
        pgncache.set(id, opening);   // Replace Promise with final value
        return opening;
    })
    .catch(err => {
        console.error("Opening fetch failed:", err);
        pgncache.delete(id); // allow retry later
        return "Unknown";
    });

    // Store the Promise immediately so parallel calls share it
    pgncache.set(id, promise);

    return promise;

}

  // -------------------------------
    // ROUTING BASED ON URL
    // -------------------------------
    const path = location.pathname;

    // game previews
    if (path.startsWith("/games")) {

        runRapidGamesScript();
        return;
    }

    // individual game eg. https://lichess.org/PC7Rsd27
    // some are from black's POV eg. https://lichess.org/PC7Rsd27/black
  if (/^\/[A-Za-z0-9]{8}(\/black)?$/.test(path)) {
        runGamePageScript();
        return;
    }

    // no match
    return;

    // -------------------------------
    // 1) RAPID GAMES PAGE
    // -------------------------------
    function runRapidGamesScript() {

function addOpening(minigame, opening) {
    // Remove old labels
    minigame.querySelectorAll('.opening-tag').forEach(e => e.remove());

    // Create new label
    const tag = document.createElement('div');
    tag.className = 'opening-tag';
    tag.textContent = opening;

    minigame.appendChild(tag);
}

function scan() {
        const nowplaying = document.querySelector('.now-playing');
        nowplaying.childNodes.forEach(processMinigame);
}

  const gamecache = new WeakSet();


async function processMinigame(minigame) {

    if (gamecache.has(minigame)) return;  // already processed

    gamecache.add(minigame);

            //const minigame = nowplaying.childNodes.item(0);
            const idecko = minigame.pathname.split('/')[1];
          const opening = await getOpening(idecko);
    addOpening(minigame, opening);

}

    const observer = new MutationObserver(scan);

    observer.observe(document.body, { childList: true, subtree: true });
}

    // -------------------------------
    // 2) INDIVIDUAL GAME PAGE
    // -------------------------------
    function runGamePageScript() {
        const id = location.pathname.split('/')[1];

       // Wait for .material-bottom to appear
        waitForMaterialBottom(async bottom => {
            const opening = await getOpening(id);

            bottom.querySelectorAll('.opening-tag').forEach(e => e.remove());

            const tag = document.createElement('div');
            tag.className = 'opening-tag';
            tag.textContent = opening;

//            bottom.appendChild(tag);
          bottom.insertAdjacentElement("afterend", tag);

        });
    }

    // -------------------------------
    // Helper: wait for .material-bottom
    // -------------------------------
    function waitForMaterialBottom(callback) {
          let done = false;

    const check = () => {
        if (done) return;
        const bottom = document.querySelector('.material-bottom');
        if (bottom) {
            done = true;
            obs.disconnect();
            callback(bottom);
        }
    };
    const obs = new MutationObserver(check);
    obs.observe(document.body, { childList: true, subtree: true });

    check(); // run immediately in case it's already there

 }

})();
