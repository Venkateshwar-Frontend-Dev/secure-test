import Bowser from "bowser";

export function detectBrowser() {
  const parser = Bowser.getParser(window.navigator.userAgent);
  const browser = parser.getBrowser();

  return {
    browserName: browser.name,
    version: browser.version,
  };
}

export function isChromeOnly() {
  const parser = Bowser.getParser(window.navigator.userAgent);
  if (
    !parser.satisfies({
      chrome: ">=100",
    })
  ) {
    return false;
  }

  return true;
}
