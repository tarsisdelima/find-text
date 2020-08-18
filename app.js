const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const superagent = require('superagent');
const $$ = require('cheerio').load;
const path = require('path');

const when_search = require('./urls').urls;

app.use(express.static(path.join(__dirname, 'public')));

// searches
const searchers = [];

class Found {
  tag = '';
  phrase = '';

  constructor(tag, phrase) {
    this.tag = tag;
    this.phrase = phrase;
  }
}

class Searcher {
  found = [];
  searching = false;
  term = '';

  constructor(term) { this.term = term; }

  start() {
    if (!this.term) { return; }
    this.searching = true;
    when_search.map(u => this.request(u));
  }

  request(url) {
    if (!this.searching) { return Promise.resolve([]); }
    superagent.get(url, (err, res) => {
      if (err) { return console.error(err); }

      const $ = $$(res.text);
      this.found = this.processTexts($('h1,h2,h3,h4,h5,div,span,p'));
      this.processLinks($('a')); 
    });
  }

  processTexts(ch) {
    return ch
      .text()
      .split(/\n/g)
      .map(s => s.trim())
      .map(s => s.toLocaleLowerCase())
      .map(s => {
        const m = s.match(new RegExp(this.term, 'g'));
        return { s, m };
      })
      .filter(s => s.m)
      .reduce((arr, s) => {
        if (arr.indexOf(s.s) == -1) arr.push(s.s);
        return arr;
      }, [])
  }

  processLinks() {
    // continue: processar links subsequentes
  }
}

// websocket events
io.on('connection', (socket) => {
  const search_results = () => socket.emit('search results', searchers);
  setInterval(search_results, 1000);

  socket.on('search start', search => {
    let searcher = searchers.find(s => s.term == search);
    if (!searcher) {
      searcher = new Searcher(search);
      searchers.push(searcher);
    }
    searcher.start();
    search_results();
  });
  
});

http.listen(3000, () => console.log('available on http://localhost:3000'));