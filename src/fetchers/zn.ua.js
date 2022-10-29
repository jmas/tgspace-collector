module.exports = async (target, { getDomByUrl, dateFns, URL }) => {
  const targetUrl = target.url;
  const { window } = await getDomByUrl(targetUrl);

  const title = window.document.querySelector("title").textContent;

  const targetUrlParsed = URL.parse(targetUrl);
  const baseUrl = `${targetUrlParsed.protocol}//${targetUrlParsed.host}`;

  const items = [];

  const articles = window.document.querySelectorAll(
    ".news_list .news_block_item"
  );

  articles.forEach((article) => {
    const anchor = article.querySelector("a");
    const time = article.dataset.type;
    const title = anchor.textContent.trim();
    const important = anchor.classList.contains("bold");

    if (time) {
      items.push({
        title,
        url: `${baseUrl}${anchor.href}`,
        date: dateFns.parse(
          `${dateFns.format(new Date(), "yyyy-MM-dd")} ${time.trim()}`,
          "yyyy-MM-dd HH:mm",
          new Date(
            new Date().toLocaleString("en-US", {
              timeZone: "Europe/Kiev",
              timeZoneName: "short",
            })
          )
        ),
        custom_elements: [].concat([{ "tgspace:important": important }]),
      });
    }
  });

  return { title, items };
};
