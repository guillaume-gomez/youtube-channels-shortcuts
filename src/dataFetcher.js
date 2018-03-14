function getChannels(callback) {
  chrome.storage.sync.get("channels", (items) => {
    callback(chrome.runtime.lastError ? null : items["channels"]);
  });
}

function getCategories(callback) {
  chrome.storage.sync.get("categories", (items) => {
    getChannels((channels) => {
      const categoriesLocalStorage = _.sortBy(items["categories"] || [], "position");
      // from channels
      const newCategoriesName = _.uniq(channels.map(channel => channel.category));
      const newCategories = newCategoriesName.map(channel => {
        return { position: -1, name: channel };
      });
      const removedCategories = _.difference(categoriesLocalStorage.map((data) =>  data.name), newCategoriesName);
      const categories = _.uniqBy(categoriesLocalStorage.concat(newCategories), "name");

      let position = 1;
      const categoriesSorted = categories.map(({ name }) => {
        // exclude unused categoires
        if(!removedCategories.includes(name)) {
          return { position: position++, name };
        }
      });
      callback(chrome.runtime.lastError ? null : _.compact(categoriesSorted));
    });
  });
}

function getActions(callback) {
  const defaultActions = [
    {title: "Dashboard", url: "https://www.youtube.com/dashboard?o=U", icon: "fa fa-home", enabled: true},
    {title: "Channel", url: "https://www.youtube.com/features", icon: "fa fa-television", enabled: true},
    {title: "Analytics", url: "https://www.youtube.com/analytics?o=U", icon: "fa fa-bar-chart", enabled: true},
    {title: "Video", url: "https://www.youtube.com/my_videos?o=U", icon: "fa fa-youtube-play", enabled: true},
    {title: "Playlist", url: "https://www.youtube.com/view_all_playlists", icon: "fa fa-list", enabled: true},
    {title: "Comments", url: "https://www.youtube.com/comments", icon: "fa fa-comment", enabled: true},
    {title: "Messages", url: "https://www.youtube.com/comments", icon: "fa fa-comments", enabled: true},
    {title: "Advanced settings", url: "https://www.youtube.com/advanced_settings", icon: "fa fa-cogs", enabled: true}
  ];

  chrome.storage.sync.get("actions", (items) => {
    const actionLocalStorage = items["actions"] || [];
    const allActions = _.compact(actionLocalStorage.concat(defaultActions));
    const actions = _.uniqBy(allActions, "title");
    callback(chrome.runtime.lastError ? null : actions);
  });
}

