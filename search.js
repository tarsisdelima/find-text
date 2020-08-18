
module.exports.Search = () => {
  const self = this;

  self.searching = true;
  self.pages = [];

  self.addPage = (page) => {
    self.pages.push(page);
  };
};

module.exports.Page = (term, url) => {
  const self = this;

  self.term = term;
  self.url = url;
};
