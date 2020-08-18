// elements
const search = document.getElementsByClassName('search').item(0); // input
const searches = document.getElementsByClassName('searches').item(0); // div
const status = document.getElementsByClassName('status').item(0); // span
const btnSearch = document.getElementsByClassName('btn-search').item(0); // button

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
      const h1 = document.createElement('h1');
      h1.innerText = s.term;
      h1.classList.add('title');

      const ul = document.createElement('ul');
      ul.classList.add('found');

      s.found.forEach(f => {
        const li = document.createElement('li');
        li.innerText = f;
        ul.appendChild(li);
      });

      const div = document.createElement('div');
      div.innerText = 'procurando';
      if (!s.searching) div.innerText = 'não ' + div.innerText;

      const block = document.createElement('div');
      block.appendChild(h1);
      block.appendChild(ul);
      block.appendChild(div);

      searches.appendChild(block);
    });
  });

  ws.on('disconnect', () => {
    setStatus('off');
  });

  // handlers with socket events
  btnSearch.onclick = () => {
    const val = search.value;
    console.log('search start', val);
    ws.emit('search start', val);
  };

});
