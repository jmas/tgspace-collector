module.exports = async (target, { getDomByUrl, dateFns }) => {
  const targetUrl = target.url;
  const { window } = await getDomByUrl(targetUrl);

  const result = [];

  const articles = window.document.querySelectorAll(
    ".time-articles > .article"
  );

  articles.forEach((article) => {
    const anchor = article.querySelector("a");
    const time = article.querySelector(".article__time");
    const title = anchor.textContent.trim();

    result.push({
      title,
      url: anchor.href,
      date: `${dateFns.format(
        new Date(),
        "yyyy-MM-dd"
      )} ${time.textContent.trim()}`,
    });
  });

  return result;
};
