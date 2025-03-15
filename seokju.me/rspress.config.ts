import { pluginFontPretendard } from '@seokju-na/rspress-plugin-font-pretendard';
import rspressPluginGoogleAnalytics from 'rspress-plugin-google-analytics';
import { defineConfig } from 'rspress/config';

const { RELEASE_ID } = process.env;

export default defineConfig({
  root: 'articles',
  outDir: './dist',
  title: 'seokju.me',
  lang: 'en',
  ssg: {
    strict: true,
  },
  locales: [
    {
      lang: 'en',
      label: 'English',
      title: 'seokju.me',
      description: `Seokju Na's personal blog`,
    },
    {
      lang: 'ko',
      label: '한국어',
      title: 'seokju.me',
      description: '나석주 블로그',
    },
  ],
  themeConfig: {
    locales: [
      {
        lang: 'en',
        label: 'English',
        nav: [
          {
            text: 'Intro',
            link: '/',
          },
        ],
      },
      {
        lang: 'ko',
        label: '한국어',
        nav: [
          {
            text: '소개',
            link: '/ko',
            activeMatch: '^/ko$|^/ko.index.html$',
          },
          {
            text: '글',
            link: '/ko/notes',
            activeMatch: '^/ko/notes$|^/ko/notes.html$',
          },
        ],
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
      assetPrefix:
        RELEASE_ID != null ? `https://seokju.me/${RELEASE_ID}/` : undefined,
    },
  },
});
