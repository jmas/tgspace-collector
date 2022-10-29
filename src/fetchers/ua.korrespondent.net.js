module.exports = async (target, { getDomByUrl, dateFns, zonedTimeToUtc }) => {
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

    const url = anchor.href;
    const date = zonedTimeToUtc(
      dateFns.parse(
        `${dateFns.format(
          new Date(),
          "yyyy-MM-dd"
        )} ${time.textContent.trim()}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      ),
      "Europe/Kiev"
    );
    const custom_elements = [].concat([{ "tgspace:important": important }]);

    items.push({
      title,
      url,
      date,
      custom_elements,
    });
  });

  return { title, items };
};
