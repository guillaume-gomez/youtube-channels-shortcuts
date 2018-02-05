const maxLength = 40;

const redirections = [
  {title: "dashboard", url: "https://www.youtube.com/dashboard?o=U", icon: "fa fa-home"},
  {title: "channel", url: "https://www.youtube.com/features", icon: "fa fa-television"},
  {title: "analytics", url: "https://www.youtube.com/analytics?o=U", icon: "fa fa-bar-chart"},
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

function fillCards() {
  let cardDeckContainer = document.getElementById('cards-container');
  getChannels((channels) => {
    getCategories((categories) => {
      if(channels && categories) {
        const sortedChannelsByCategory = sortChannelsByCategory(channels);
        sortCategories(categories).forEach((category) => {
          let cardDeck = createDeck(category);
          cardDeckContainer.appendChild(cardDeck);
          sortedChannelsByCategory[category].forEach(channel => {
            cardDeck.appendChild(createCard(channel));
          });
        });
      }
    });
  });

}

function sortCategories(categories) {
  const sortedCategories = Object.values(categories).sort((a,b) => {
    return a.position > b.position;
  });
  return sortedCategories.map(categoryObj => categoryObj.name);
}

function sortChannelsByCategory(channels) {
  let channelsByCategory = {};
  channels.forEach(channel => {
    if(channelsByCategory[channel.category]) {
      channelsByCategory[channel.category].push(channel);
    } else {
      channelsByCategory[channel.category] = [channel];
    }
   });
  return channelsByCategory;
}

function createDeck(name) {
  let containerDeck = document.createElement("div");
  containerDeck.setAttribute('class', 'container');

  let deck = document.createElement("div");
  deck.setAttribute('class', 'card-deck');

  let p = document.createElement("p");
  p.setAttribute('class', 'badge badge-pill badge-default');
  const nameFiltered = (name.length > maxLength) ? name.substring(0, maxLength - 3) + "..." : name;
  const contentText = document.createTextNode(nameFiltered);
  p.appendChild(contentText);

  let hr = document.createElement("hr");

  containerDeck.appendChild(hr);
  containerDeck.appendChild(p);
  containerDeck.appendChild(deck);

  return containerDeck;
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

  let cardTitle = document.createElement("span");
  cardTitle.setAttribute('class', 'card-title channel-name red-text');
  const nameFiltered = (item.name.length > maxLength) ? item.name.substring(0, maxLength - 3) + "..." : item.name;
  let cardTitleText = document.createTextNode(nameFiltered + " ");
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
