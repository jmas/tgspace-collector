const jsdom = require("jsdom");
const axios = require("axios");
const iconv = require("iconv-lite");
const URL = require("url");
const dateFns = require("date-fns");
const fs = require("fs");
const path = require("path");
const fetchers = require("./fetchers");
const RSS = require("rss-generator");

const { JSDOM } = jsdom;

const getDomByHtml = (html) => {
  const virtualConsole = new jsdom.VirtualConsole();
  return new JSDOM(html, { virtualConsole });
};

const getHtmlByUrl = async (url, options) => {
  return (await axios.get(url, options)).data;
};

const getDomByUrl = async (url, axiosOptions) => {
  return getDomByHtml(await getHtmlByUrl(url, axiosOptions));
};

const convEncoding = (data, from = "win1251", to = "utf8") => {
  const encMap = {
    utf8: "utf-8",
  };
  return iconv.encode(iconv.decode(data, from), to).toString(encMap[to]);
};

const cleanupTitle = (title) => {
  return title.replace(/\s\s+/g, " ");
};

const tools = {
  getDomByHtml,
  getHtmlByUrl,
  getDomByUrl,
  convEncoding,
  cleanupTitle,
  URL,
  axios,
  dateFns,
};

module.exports = async () => {
  const fetcherKeys = Object.keys(fetchers);
  console.log(`Available fetchers: ${fetcherKeys.join(", ")}`);

  const urls = [
    "https://pravda.com.ua",
    "https://epravda.com.ua",
    "https://ain.ua",
    "https://gamedev.dou.ua/news/",
    "https://ua.korrespondent.net",
    "https://t.me/s/novinach",
    "https://t.me/s/uaserialsPRO",
    "https://t.me/s/kinoriumUA",
  ];

  for (let url of urls) {
    const hostname = URL.parse(url).hostname;
    const pathname = URL.parse(url).pathname;
    const fetcherName = `${hostname}${
      pathname.length > 1
        ? `_${pathname
            .substring(1)
            .split("/")
            .map((item) => item.trim())
            .filter((item) => Boolean(item))
            .join("-")}`
        : ""
    }`;
    const fetcher = fetchers[hostname];

    if (!fetcher) {
      throw new Error(`Fetcher for URL '${url}' is not found.`);
    }

    console.log(`[${fetcherName}] Start fetcher`);

    try {
      const target = {
        url,
      };

      const feed = new RSS({
        title: fetcherName,
        custom_elements: [{ "tgspace:performance": "" }],
      });

      // Fetch items
      const items = await fetcher(target, tools);

      // Add items to feed
      items.forEach((item) => feed.item(item));

      console.log(`[${fetcherName}] Result count: ${items.length}`);

      if (process.env.DEBUG_FETCHER === hostname) {
        console.log(`[${fetcherName}] Debug result: `, items);
      }

      // Write feed to disk
      fs.writeFileSync(
        path.join(".", "build", `${fetcherName}.xml`),
        feed.xml({ indent: true }),
        {
          encoding: "utf-8",
        }
      );
    } catch (error) {
      console.log(error);
      console.log(`[${fetcherName}] Error fetcher: ${error.message}`);
    }

    console.log(`[${fetcherName}] End fetcher`);
  }
};
