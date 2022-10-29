const truncate = require("truncate-html");
const sanitizeHtml = require("sanitize-html");

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
    const description = sanitizeHtml(
      item.querySelector(".js-message_text").innerHTML,
      {
        allowedTags: [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "blockquote",
          "hr",
          "li",
          "ol",
          "p",
          "pre",
          "ul",
          "a",
          "b",
          "br",
          "code",
          "em",
          "i",
          "img",
          "strong",
          "table",
          "tbody",
          "td",
          "tfoot",
          "th",
          "thead",
          "tr",
        ],
        allowedAttributes: {
          a: ["href"],
          img: ["src", "alt", "title"],
        },
        allowedSchemes: ["http", "https", "ftp", "mailto", "tel"],
        allowProtocolRelative: false,
      }
    );
    const title =
      item.querySelector(".js-message_text > b:first-child")?.textContent ||
      truncate(item.querySelector(".js-message_text").innerHTML, 10, {
        byWords: true,
        stripTags: true,
      });
    const images = Array.from(
      item.querySelectorAll(".tgme_widget_message_photo_wrap") || []
    ).map((item) => item.style.backgroundImage);

    const enclosure =
      images.length > 0
        ? {
            url: unwrapImage(images[0]),
          }
        : undefined;

    const custom_elements = []
      .concat([{ "tgspace:important": false }])
      .concat(images.map((image) => ({ "tgspace:image": unwrapImage(image) })));

    return {
      url,
      date,
      title,
      description,
      enclosure,
      custom_elements,
    };
  });

  return { title, items };
};
