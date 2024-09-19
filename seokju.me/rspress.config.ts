import { pluginFontPretendard } from '@seokju-na/rspress-plugin-font-pretendard';
import rspressPluginGoogleAnalytics from 'rspress-plugin-google-analytics';
import { defineConfig } from 'rspress/config';

const { RELEASE_ID } = process.env;

export default defineConfig({
  root: 'articles',
  outDir: './dist',
  title: 'seokju.me',
  lang: 'ko',
  ssg: {
    strict: true,
  },
  themeConfig: {
    nav: [
      {
        text: '소개',
        link: '/',
      },
    ],
    search: false,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/seokju-na',
      },
    ],
    enableScrollToTop: true,
  },
  plugins: [
    pluginFontPretendard(),
    rspressPluginGoogleAnalytics({
      id: 'G-9TERTB1MFR',
    }),
  ],
  builderConfig: {
    output: {
      assetPrefix: RELEASE_ID != null ? `https://seokju.me/${RELEASE_ID}/` : undefined,
    },
  },
});
