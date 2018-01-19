function fillDropdown(id = "dropdown") {
  let dropdown = document.getElementById(id);
  channels.forEach(item => {
    const added = document.createElement('option');
    added.text = item.name;
    added.value = item.url;
    dropdown.append(added);
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
  console.log(channels)
  var dropdown = document.getElementById('dropdown');

  fillDropdown();
  dropdown.addEventListener('change', () => {
    connectToChannel(dropdown.value);
  });
});
