import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet(); // Создаем экземпляр ServerStyleSheet
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />), // Используем collectStyles для сбора стилей
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()} {/* Получаем и добавляем стили в head */}
          </>
        ),
      };
    } finally {
      sheet.seal(); // Завершаем сбор стилей
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Ваши мета-теги и ссылки здесь */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
