/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack: (config) => {
    // Handle GLSL shader files
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: 'raw-loader'
    });
    
    return config;
  },
  turbopack: {
 // Handle GLSL shader files
        rules: {
            '*.{glsl,vs,fs,vert,frag}': {
                loaders: ['raw-loader'],
                as: '*.js',
            },
        },
  },
  // Optimize images
  images: {
    unoptimized: true
  },
  // Fix lockfile warning
  outputFileTracingRoot: __dirname
}

module.exports = nextConfig
