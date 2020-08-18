// elements
const search = document.getElementsByClassName('search').item(0); // input
const searches = document.getElementsByClassName('searches').item(0); // div
const status = document.getElementsByClassName('status').item(0); // span
const btnSearch = document.getElementsByClassName('btn-search').item(0); // button

// handlers
const setStatus = (s) => {
  status.classList.remove('on');
  status.classList.remove('off');
  status.classList.add(s);
  status.innerText = s;
};

// socket events
const ws = io();

ws.on('connect', (socket) => {
  setStatus('on');

  ws.on('disconnect', () => {
    setStatus('off');
  });

  // handlers with socket events
  btnSearch.onclick = () => {
    const val = search.value;
    console.log('value', val);
    ws.emit('search', val);
  };

});
