function fillDropdown(id = "dropdown") {
  let dropdown = document.getElementById(id);
  getChannels((channels) => {
    if(channels) {
      channels.forEach(item => {
        const added = document.createElement('option');
        added.text = item.name;
        added.value = item.url;
        dropdown.append(added);
      });
    }
  });
}

function connectToChannel(url) {
  setTimeout(function() {
    chrome.tabs.update({url: 'https://www.youtube.com/my_videos?o=U'});
    window.close();
  }, 2000);
  chrome.tabs.update({url: url});
}

document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.getElementById('dropdown');

  fillDropdown();
  dropdown.addEventListener('change', () => {
    connectToChannel(dropdown.value);
  });
});


function getChannels(callback) {
  chrome.storage.sync.get("channels", (items) => {
    callback(chrome.runtime.lastError ? null : items["channels"]);
  });
}
