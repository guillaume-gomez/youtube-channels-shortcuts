function getChannels(callback) {
  chrome.storage.sync.get("channels", (items) => {
    callback(chrome.runtime.lastError ? null : items["channels"]);
  });
}

function getCategories(callback) {
  chrome.storage.sync.get("categories", (items) => {
    getChannels((channels) => {
      const categoriesLocalStorage = items["categories"] || [];
      let position =  categoriesLocalStorage.length;
      // from channels
      const newCategoriesName = _.uniq(channels.map(channel => channel.category));
      const newCategories = newCategoriesName.map(channel => {
        position++;
        return { position: position, name: channel };
      });
      const categories = _.uniqBy( categoriesLocalStorage.concat(newCategories), "name");
      callback(chrome.runtime.lastError ? null : categories);
    });
  });
}

function getActions(callback) {
  const defaultActions = [
    {title: "Dashboard", url: "https://www.youtube.com/dashboard?o=U", icon: "fa fa-home", enabled: true},
    {title: "Channel", url: "https://www.youtube.com/features", icon: "fa fa-television", enabled: true},
    {title: "Analytics", url: "https://www.youtube.com/analytics?o=U", icon: "fa fa-bar-chart", enabled: true},
    {title: "Video", url: "https://www.youtube.com/my_videos?o=U", icon: "fa fa-youtube-play", enabled: true},
    {title: "Playlist", url: "https://www.youtube.com/view_all_playlists", icon: "fa fa-list", enabled: true}
  ];

  chrome.storage.sync.get("actions", (items) => {
    const actionChoosed = items["actions"] || [];
    const allActions = _.compact(actionChoosed.concat(defaultActions));
    const actions = _.uniqBy(allActions, "title");
    callback(chrome.runtime.lastError ? null : actions);
  });
}

