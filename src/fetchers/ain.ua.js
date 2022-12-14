module.exports = async (target, { getDomByUrl, dateFns, zonedTimeToUtc }) => {
  const targetUrl = target.url;
  const { window } = await getDomByUrl(targetUrl);

  const items = [];

  const title = window.document.querySelector("title").textContent;
  const articles = window.document.querySelectorAll(`.block-posts .post-item`);

  articles.forEach((article) => {
    const anchor = article.querySelector(".post-link");
    const dateOrTime = article.querySelector(".post-date")?.textContent || "";
    const title = anchor.textContent.trim();
    const [, year, month, day] =
      anchor.href.match(/https:\/\/ain\.ua\/(\d+)\/(\d+)\/(\d+)\//) || [];
    let _date =
      year && month && day
        ? dateFns.parse(`${year}-${month}-${day}`, "yyyy-MM-dd", new Date())
        : null;
    let time = null;
    const important = anchor.classList.contains("item-title-bold");

    if (dateOrTime.match(/\d\d:\d\d/)) {
      time = dateFns.parse(
        dateOrTime.trim().padStart(5, "0"),
        "HH:mm",
        new Date()
      );
    }

    if (_date && time) {
      const url = `${anchor.href}`;
      const date = zonedTimeToUtc(
        dateFns.parse(
          `${dateFns.format(_date, "yyyy-MM-dd")} ${dateFns.format(
            time,
            "HH:mm"
          )}`,
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
    }
  });

  return { title, items };
};
