module.exports = async (target, { getDomByUrl, dateFns, changeTimeZone }) => {
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
    let date =
      year && month && day
        ? dateFns.parse(
            `${year}-${month}-${day}`,
            "yyyy-MM-dd",
            changeTimeZone(new Date(), "Europe/Kiev")
          )
        : null;
    let time = changeTimeZone(new Date(), "Europe/Kiev");
    const important = anchor.classList.contains("item-title-bold");

    if (dateOrTime.match(/\d\d:\d\d/)) {
      time = dateFns.parse(
        dateOrTime.trim().padStart(5, "0"),
        "HH:mm",
        changeTimeZone(new Date(), "Europe/Kiev")
      );
    }

    if (date) {
      items.push({
        title,
        url: `${anchor.href}`,
        date: changeTimeZone(
          new Date(
            `${dateFns.format(date, "yyyy-MM-dd")} ${dateFns.format(
              time,
              "HH:mm"
            )}`
          ),
          "Europe/Kiev"
        ),
        custom_elements: [].concat([{ "tgspace:important": important }]),
      });
    }
  });

  return { title, items };
};
