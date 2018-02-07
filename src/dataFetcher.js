function getChannels(callback) {
  chrome.storage.sync.get("channels", (items) => {
    callback(chrome.runtime.lastError ? null : items["channels"]);
  });
}

function getCategories(callback) {
  chrome.storage.sync.get("categories", (items) => {
    callback(chrome.runtime.lastError ? null : items["categories"]);
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
    const actions = _.uniq(defaultActions.concat(_.compact(items["actions"])));
    callback(chrome.runtime.lastError ? null : actions);
  });
}

