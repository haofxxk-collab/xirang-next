import { defineField, defineType } from 'sanity'

export const artistSchema = defineType({
  name: 'artist',
  title: '藝術家',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: '姓名', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'nameEn', title: '英文姓名', type: 'string' }),
    defineField({ name: 'slug', title: 'URL slug', type: 'slug', options: { source: 'nameEn' }, validation: (r) => r.required() }),
    defineField({ name: 'index', title: '排序', type: 'number' }),
    defineField({ name: 'featured', title: '精選藝術家', type: 'boolean', initialValue: false }),
    defineField({ name: 'portrait', title: '肖像照片', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroImage', title: 'Hero 大圖', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'medium',
      title: '創作媒材',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          '水墨', '書法', '油彩', '水彩', '版畫',
          '雕刻', '陶藝', '纖維', '裝置藝術', '攝影', '膠彩',
        ],
      },
    }),
    defineField({ name: 'yearsActive', title: '創作資歷（年）', type: 'number' }),
    defineField({ name: 'birthYear', title: '出生年份', type: 'number' }),
    defineField({ name: 'location', title: '所在地', type: 'string' }),
    defineField({ name: 'quote', title: '代表語錄', type: 'text', rows: 2 }),
    defineField({ name: 'bio', title: '藝術家簡介', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'timeline',
      title: '年表',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'year', type: 'number', title: '年份' },
          { name: 'title', type: 'string', title: '事件標題' },
          { name: 'description', type: 'text', title: '說明' },
        ],
      }],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'location', media: 'portrait' },
  },
})
