module.exports = async (
  target,
  { getDomByHtml, getHtmlByUrl, convEncoding, URL }
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

  Array.from(window.document.querySelectorAll(".news > *")).forEach((child) => {
    if (
      child.classList.contains("article") &&
      child.querySelector(".article__time")
    ) {
      const important = child.classList.contains("article_bold");
      const anchor = child.querySelector("a");
      const [, , year, month, day] = anchor.href
        .replace(/^https:\/\/.+\.(epravda|pravda|eurointegration)\.com\.ua/, "")
        .split("/");

      items.push({
        title: (
          anchor.querySelector("[data-vr-headline]") || anchor
        ).textContent.trim(),
        url: anchor.href.startsWith("http")
          ? anchor.href
          : `${baseUrl}${anchor.href}`,
        date: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${
          child.querySelector(".article__time")?.textContent.trim() || ""
        }`.trim(),
        custom_elements: [].concat(
          important ? [{ "tgspace:important": true }] : []
        ),
      });
    }
  });

  return { title, items };
};
