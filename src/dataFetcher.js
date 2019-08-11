function getChannels(callback) {
  chrome.storage.sync.get("channels", (items) => {
    const callbackValue = Object.keys(items).includes("channels") ? items["channels"] : [];
    callback(chrome.runtime.lastError ? null : callbackValue);
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
    {title: "Channel Page", url: "https://www.youtube.com/channel/", extendUrl: true, icon: "fa fa-home", enabled: true},
    {title: "Dashboard", url: "https://www.youtube.com/dashboard?o=U", extendUrl: false, icon: "fa fa-home", enabled: false},
    {title: "Channel", url: "https://www.youtube.com/features", extendUrl: false, icon: "fa fa-television", enabled: true},
    {title: "Analytics", url: "https://www.youtube.com/analytics?o=U", extendUrl: false, icon: "fa fa-bar-chart", enabled: true},
    {title: "Video", url: "https://www.youtube.com/my_videos?o=U", extendUrl: false, icon: "fa fa-youtube-play", enabled: true},
    {title: "Playlist", url: "https://www.youtube.com/view_all_playlists", extendUrl: false, icon: "fa fa-list", enabled: true},
    {title: "Comments", url: "https://www.youtube.com/comments", extendUrl: false, icon: "fa fa-comment", enabled: true},
    {title: "Messages", url: "https://www.youtube.com/comments", extendUrl: false, icon: "fa fa-comments", enabled: true},
    {title: "Advanced settings", url: "https://www.youtube.com/advanced_settings", extendUrl: false, icon: "fa fa-cogs", enabled: true},
    {title: "Live", url: "https://www.youtube.com/live_dashboard", extendUrl: false, icon: "fa fa-video-camera", enabled: true}
  ];

  chrome.storage.sync.get("actions", (items) => {
    const actionLocalStorage = items["actions"] || [];
    const allActions = _.compact(actionLocalStorage.concat(defaultActions));
    const actions = _.uniqBy(allActions, "title");
    callback(chrome.runtime.lastError ? null : actions);
  });
}

