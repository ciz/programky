// ==UserScript==
// @name        lichess games opening tagger
// @namespace   Violentmonkey Scripts
// @match       https://lichess.org/games*
// @grant       none
// @version     1.0
// @author      Vitezslav Cizek
// @description Show opening names on Lichess preview games
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
    if (pgncache.has(id)) return pgncache.get(id);

    const pgn = `https://lichess.org/game/export/${id}?pgnInJson=true`;
    const data = await fetch(pgn,  {
            headers: { 'Accept': 'application/json' }
        }).then(r => r.json());
    const opening = data.opening?.name || "Unknown";
//console.log(opening)
 pgncache.set(id, opening);
    return opening;
}


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
})();
