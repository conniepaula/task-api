export function buildRouteUrl(url) {
  const routeParamRegex = /:([a-zA-Z]+)/g;
  const routeParams = url.replaceAll(routeParamRegex, "(?<$1>[a-z0-9-_]+)");
  const regexUrl = new RegExp(`^${routeParams}$`);
  return regexUrl;
}
