const uk = require("date-fns/locale/uk");

module.exports = async (target, { getDomByUrl, dateFns, changeTimeZone }) => {
  const targetUrl = target.url;
  const { window } = await getDomByUrl(targetUrl);

  const items = [];

  const title = window.document.querySelector("title").textContent;
  const articles = window.document.querySelectorAll(".b-lenta .b-postcard");

  articles.forEach((article) => {
    const anchor = article.querySelector(".title a");
    const date = article.querySelector(".date").textContent;
    const title = anchor.textContent.trim();
    const [day, month, time] = date.split(" ");
    const _date = dateFns.parse(
      `${day} ${month.slice(0, 4)}.`,
      "d LLL",
      changeTimeZone(new Date(), "Europe/Kiev"),
      { locale: uk }
    );
    const _time = dateFns.parse(
      `${time.trim().padStart(5, "0")}`,
      "HH:mm",
      changeTimeZone(new Date(), "Europe/Kiev"),
      {
        locale: uk,
      }
    );

    items.push({
      title,
      url: `${anchor.href}`,
      date: changeTimeZone(
        `${dateFns.format(_date, "yyyy-MM-dd")} ${dateFns.format(
          _time,
          "HH:mm"
        )}`,
        "Europe/Kiev"
      ),
      custom_elements: [].concat([{ "tgspace:important": false }]),
    });
  });

  return { title, items };
};
