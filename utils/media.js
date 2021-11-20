export function getStrapiMedia(url) {
  if (url == null) {
    return null;
  }

  // Return the full URL if the media is hosted on an external provider
  if (url.startsWith("http") || url.startsWith("//")) {
    return `https://cors-anywhere.herokuapp.com/http:${url}`;
  }

  // Otherwise prepend the URL path with the Strapi URL
  return `${
    process.env.NEXT_PUBLIC_STRAPI_API_URL ||
    "https://cors-anywhere.herokuapp.com/http://161.97.161.196:1337"
  }${url}`;
}
