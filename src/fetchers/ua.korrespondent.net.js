module.exports = async (target, { getDomByUrl, dateFns }) => {
  const targetUrl = target.url;
  const { window } = await getDomByUrl(targetUrl);

  const items = [];

  const title = window.document.querySelector("title").textContent;

  const articles = window.document.querySelectorAll(
    ".time-articles > .article"
  );

  articles.forEach((article) => {
    const anchor = article.querySelector("a");
    const time = article.querySelector(".article__time");
    const title = anchor.textContent.trim();
    const important = article.classList.contains("text_bold");

    items.push({
      title,
      url: anchor.href,
      date: `${dateFns.format(
        new Date(),
        "yyyy-MM-dd"
      )} ${time.textContent.trim()}`,
      custom_elements: [].concat(
        important ? [{ "tgspace:important": true }] : []
      ),
    });
  });

  return { title, items };
};
