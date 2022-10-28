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

  const targetUrlParsed = URL.parse(targetUrl);
  const baseUrl = `${targetUrlParsed.protocol}//${targetUrlParsed.host}`;

  const result = [];

  Array.from(
    window.document.querySelectorAll(
      ".container_sub_news_wrapper .article_news"
    )
  ).forEach((child) => {
    if (child.querySelector(".article_time")) {
      const important = child.classList.contains("article_bold");
      const anchor = child.querySelector("a");
      const [, , year, month, day] = anchor.href
        .replace(baseUrl, "")
        .replace(/^https:\/\/.+\.(epravda|pravda|eurointegration)\.com\.ua/, "")
        .split("/");

      result.push({
        title: (
          anchor.querySelector("[data-vr-headline]") || anchor
        ).textContent.trim(),
        url: anchor.href.startsWith("http")
          ? anchor.href
          : `${baseUrl}${anchor.href}`,
        date: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${
          child.querySelector(".article_time")?.textContent.trim() || ""
        }`,
      });
    }
  });

  return result;
};
