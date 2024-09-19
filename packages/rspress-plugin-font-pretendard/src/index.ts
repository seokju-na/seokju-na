import path from 'node:path';
import type { RspressPlugin } from '@rspress/shared';

export const pluginFontPretendard = (): RspressPlugin => {
  return {
    name: 'plugin-font-pretendard',
    builderConfig: {
      html: {
        tags: [
          {
            tag: 'link',
            head: true,
            append: false,
            attrs: {
              rel: 'stylesheet',
              as: 'style',
              crossorigin: '',
              href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css',
            },
          },
        ],
      },
      source: {
        preEntry: [path.join(__dirname, '..', 'static', 'pretendard.css')],
      },
    },
  };
};
