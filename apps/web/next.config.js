/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['moly.hu', 'source.boringavatars.com'],
    dangerouslyAllowSVG: true,
  }
}

module.exports = nextConfig
