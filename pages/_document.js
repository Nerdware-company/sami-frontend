import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <script
            type="text/javascript"
            src="https://goSellJSLib.b-cdn.net/v1.6.0/js/gosell.js"
            strategy="beforeInteractive"
          ></script>
          <link
            href="https://goSellJSLib.b-cdn.net/v1.6.0/css/gosell.css"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Cairo:400,700&amp;subset=arabic"
            rel="stylesheet"
          ></link>
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
            integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            type="text/css"
            charset="UTF-8"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          />
          <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
          {/* <script
            type="text/javascript"
            src="https://secure.gosell.io/js/sdk/tap.min.js"
            strategy="beforeInteractive"
          ></script>
          <script
            type="text/javascript"
            src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js"
            strategy="beforeInteractive"
          ></script> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
