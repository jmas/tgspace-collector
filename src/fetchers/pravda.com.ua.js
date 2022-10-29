module.exports = async (
  target,
  { getDomByHtml, getHtmlByUrl, convEncoding, URL, dateFns, changeTimeZone }
) => {
  const targetUrl = target.url;

  const { window } = getDomByHtml(
    convEncoding(
      await getHtmlByUrl(targetUrl, {
        responseEncoding: "binary",
      })
    )
  );

  const title = window.document.querySelector("title").textContent;

  const targetUrlParsed = URL.parse(targetUrl);
  const baseUrl = `${targetUrlParsed.protocol}//${targetUrlParsed.host}`;

  const items = [];

  Array.from(
    window.document.querySelectorAll(
      ".container_sub_news_wrapper .article_news"
    )
  ).forEach((child) => {
    if (child.querySelector(".article_time")) {
      const important = child.classList.contains("article_news_bold");
      const anchor = child.querySelector("a");
      const [, , year, month, day] = anchor.href
        .replace(baseUrl, "")
        .replace(/^https:\/\/.+\.(epravda|pravda|eurointegration)\.com\.ua/, "")
        .split("/");

      items.push({
        title: (
          anchor.querySelector("[data-vr-headline]") || anchor
        ).textContent.trim(),
        url: anchor.href.startsWith("http")
          ? anchor.href
          : `${baseUrl}${anchor.href}`,
        date: changeTimeZone(
          dateFns.parse(
            `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${
              child.querySelector(".article_time")?.textContent.trim() || ""
            }`,
            "yyyy-MM-dd HH:mm",
            changeTimeZone(new Date(), "Europe/Kiev")
          ),
          "Europe/Kiev"
        ),
        custom_elements: [].concat([{ "tgspace:important": important }]),
      });
    }
  });

  return { title, items };
};
