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
