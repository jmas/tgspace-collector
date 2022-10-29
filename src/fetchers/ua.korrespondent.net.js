module.exports = async (target, { getDomByUrl, dateFns, changeTimeZone }) => {
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
      date: changeTimeZone(
        dateFns.parse(
          `${dateFns.format(
            changeTimeZone(new Date(), "Europe/Kiev"),
            "yyyy-MM-dd"
          )} ${time.textContent.trim()}`,
          "yyyy-MM-dd HH:mm",
          changeTimeZone(new Date(), "Europe/Kiev")
        ),
        "Europe/Kiev"
      ),
      custom_elements: [].concat([{ "tgspace:important": important }]),
    });
  });

  return { title, items };
};
