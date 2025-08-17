//  next.config.js нужен, если вы используете Next.js для построения своего фронтенда,
module.exports = {
    //  Включает "строгий режим" React.
  reactStrictMode: true,
//   который используется для оптимизации изображений
  images: {
    domains: ['ipfs.io']
  }
}