const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      const https = require('https');
      const http = require('http');

      devServer.app.get('/api/proxy-video', (req, res) => {
        const videoUrl = req.query.url;
        if (!videoUrl) {
          return res.status(400).json({ error: 'URL required' });
        }

        try {
          const parsed = new URL(videoUrl);
          const client = parsed.protocol === 'https:' ? https : http;

          const proxyReq = client.get(videoUrl, (proxyRes) => {
            const contentType = proxyRes.headers['content-type'] || 'video/mp4';
            res.setHeader('Content-Type', contentType);
            res.setHeader('Access-Control-Allow-Origin', '*');
            if (proxyRes.headers['content-length']) {
              res.setHeader('Content-Length', proxyRes.headers['content-length']);
            }
            // Follow redirects
            if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
              return res.redirect(proxyRes.headers.location);
            }
            proxyRes.pipe(res);
          });

          proxyReq.on('error', (err) => {
            console.error('[proxy-video] error:', err.message);
            if (!res.headersSent) res.status(500).json({ error: err.message });
          });
        } catch (e) {
          res.status(400).json({ error: e.message });
        }
      });

      return middlewares;
    }
  }
})
