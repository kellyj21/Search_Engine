export const HTTP_HEADERS = {
    "Content-Security-Policy": "script-src * default-src 'self' 'unsafe-inline'",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Frame-Options": "sameorigin",
};

export const SERVER = {
    port: 80
};

export const ERROR_SERVER = {
    "200": " requires elevated privileges.",
    "201": " is already in use.",
};

export const SETTINGS = {
    "URL_LIST": [
        "http://feeds.bbci.co.uk/news/world/rss.xml",
        "https://www.dailymail.co.uk/home/index.rss",
        "http://feeds.skynews.com/feeds/rss/home.xml",
        "https://www.yahoo.com/news/rss/world",
        "https://www.theguardian.com/uk/rss"
    ],
    "CRAWLER_LOOP_TIME_INTERVAL": "600000"
}