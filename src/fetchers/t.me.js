const { html2markdown } = require("../utils/html2markdown");
const truncate = require("truncate-html");

const unwrapImage = (image) => {
  return image.replace(/^url\(/, "").replace(/\)$/, "");
};

module.exports = async (target, { getDomByUrl }) => {
  const { window } = await getDomByUrl(target.url);

  const title = window.document.querySelector("title").textContent;

  const items = Array.from(
    window.document.querySelectorAll(
      ".js-message_history > .js-widget_message_wrap"
    )
  ).map((item) => {
    const url = item
      .querySelector(".tgme_widget_message_date")
      .getAttribute("href");
    const date = item.querySelector("time[datetime]").getAttribute("datetime");
    const description = html2markdown(
      item.querySelector(".js-message_text").innerHTML
    );
    const title =
      item.querySelector(".js-message_text > b:first-child")?.textContent ||
      truncate(description, 10, { byWords: true, stripTags: true });
    const images = Array.from(
      item.querySelectorAll(".tgme_widget_message_photo_wrap") || []
    ).map((item) => item.style.backgroundImage);

    const enclosure =
      images.length > 0
        ? {
            url: unwrapImage(images[0]),
          }
        : undefined;

    return {
      url,
      date,
      title,
      description,
      enclosure,
      custom_elements: [].concat(
        images.map((image) => ({ "tgspace:image": unwrapImage(image) }))
      ),
    };
  });

  return { title, items };
};
