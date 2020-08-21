// elements
const search = document.getElementsByClassName('search').item(0); // input
const searches = document.getElementsByClassName('searches').item(0); // div
const status = document.getElementsByClassName('status').item(0); // span
const btnSearch = document.getElementsByClassName('btn-search').item(0); // button
const btnLooper = document.getElementsByClassName('btn-looper').item(0); // button

// handlers
const setStatus = (s, id) => {
  status.classList.remove('on');
  status.classList.remove('off');
  status.classList.add(s);
  status.innerText = s;
  if (id) console.log('id', id);
};

// socket events
const ws = io();

ws.on('connect', () => {
  console.clear();
  setStatus('on', ws.id);

  ws.on('search results', res => {
    console.log('res', res);
    searches.innerHTML = '';
    res.forEach((s) => {
      const title = document.createElement('p');
      title.innerText = s.term;
      title.classList.add('title');
      if (s.searching) {
        title.classList.add('on');
      } else {
        title.classList.add('off');
      }

      const ul = document.createElement('ul');
      ul.classList.add('found');

      s.found.forEach(f => {
        const li = document.createElement('li');
        li.innerText = f;
        ul.appendChild(li);
      });

      const block = document.createElement('div');
      block.classList.add('block');
      block.appendChild(title);
      block.appendChild(ul);

      searches.appendChild(block);
    });
  });

  ws.on('looper is', on => btnLooper.innerText = on ? 'Stop' : 'Start');

  ws.on('disconnect', () => {
    setStatus('off');
  });

  // handlers with socket events
  btnSearch.onclick = () => {
    const val = search.value;
    console.log('search start', val);
    ws.emit('search start', val);
  };

  btnLooper.onclick = () => {
    ws.emit('looper toogle');
  };

});
