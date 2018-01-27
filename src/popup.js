const redirections = [
  {title: "dashboard", url: "https://www.youtube.com/dashboard?o=U", icon: "fa fa-home"},
  {title: "channel", url: "https://www.youtube.com/features", icon: "fa fa-television"},
  {title: "analytics", url: "ttps://www.youtube.com/analytics?o=U", icon: "fa fa-bar-chart"},
  {title: "video", url: "https://www.youtube.com/my_videos?o=U", icon: "fa fa-youtube-play"},
  {title: "playlist", url: "https://www.youtube.com/view_all_playlists", icon: "fa fa-list"}
];

function connectToChannel(url, redirection = redirections[0].url) {
  setTimeout(function() {
    chrome.tabs.update({url: redirection});
    window.close();
  }, 2000);
  chrome.tabs.update({url: url});
}

function getChannels(callback) {
  chrome.storage.sync.get("channels", (items) => {
    callback(chrome.runtime.lastError ? null : items["channels"]);
  });
}


function fillCards() {
  const cardDeck = document.getElementsByClassName('card-deck')[0];
  getChannels((channels) => {
    if(channels) {
      channels.forEach(item => {
        cardDeck.appendChild(createCard(item));
      });
    }
  });
}

function createActionInCard(channel_url, params) {
  let buttonItem = document.createElement("button");
  buttonItem.setAttribute('class', 'btn btn-secondary btn-sm');
  buttonItem.setAttribute('type', 'button');

  let contentText = document.createTextNode(params.title);
  buttonItem.addEventListener('click', () => {
    connectToChannel(channel_url, params.url);
  })

  let iItem = document.createElement("span");
  iItem.setAttribute('class', params.icon);

  //buttonItem.appendChild(contentText);
  buttonItem.appendChild(iItem);
  return buttonItem;
}

function createCard(item) {
  let cardDiv = document.createElement("div");
  cardDiv.setAttribute('class', "card");

  let cardBloclDiv = document.createElement("div");
  cardBloclDiv.setAttribute('class', "card-block");

  let cardTitle = document.createElement("h6");
  cardTitle.setAttribute('class', 'card-title');
  let cardTitleText = document.createTextNode(item.name);
  cardTitle.appendChild(cardTitleText);

  cardDiv.appendChild(cardBloclDiv);
  cardBloclDiv.appendChild(cardTitle);

  let buttonGroup = document.createElement("div");
  buttonGroup.setAttribute('class', 'btn-group');
  buttonGroup.setAttribute('role', 'group')
  cardBloclDiv.appendChild(buttonGroup);

  redirections.forEach(params => {
    buttonGroup.appendChild(createActionInCard(item.url, params));
  });

  return cardDiv;
}

document.addEventListener('DOMContentLoaded', () => {
  const linkToOption = document.getElementById('link-to-options');
  linkToOption.addEventListener('click', () => {
    chrome.tabs.create({'url': "/src/options.html" });
  });

  fillCards();

});