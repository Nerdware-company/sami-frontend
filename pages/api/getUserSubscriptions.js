import cookie from "cookie";
import { getStrapiURL } from "utils/api";

export default async (req, res) => {
  const jwt = cookie.parse(req);

  const result = await fetch(getStrapiURL("/subscriptions"), {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });

  const data = await result.json();
  console.log("hhh", jwt);
  res.status(200).json({ data });
};
