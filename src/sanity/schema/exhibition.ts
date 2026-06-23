import { defineField, defineType } from 'sanity'

export const exhibitionSchema = defineType({
  name: 'exhibition',
  title: '策展',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: '展覽名稱（中文）', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'titleEn', title: '展覽名稱（英文）', type: 'string' }),
    defineField({ name: 'slug', title: 'URL slug', type: 'slug', options: { source: 'titleEn' }, validation: (r) => r.required() }),
    defineField({
      name: 'type',
      title: '展覽類型',
      type: 'string',
      options: {
        list: [
          { title: '個展', value: 'solo' },
          { title: '雙人展', value: 'duo' },
          { title: '聯展', value: 'group' },
          { title: '年度大展', value: 'annual' },
          { title: '開幕首展', value: 'opening' },
        ],
      },
    }),
    defineField({
      name: 'status',
      title: '展覽狀態',
      type: 'string',
      options: {
        list: [
          { title: '當期展出', value: 'current' },
          { title: '即將展出', value: 'upcoming' },
          { title: '已結束', value: 'past' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'startDate', title: '開始日期', type: 'date' }),
    defineField({ name: 'endDate', title: '結束日期', type: 'date' }),
    defineField({ name: 'coverImage', title: '封面圖片', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'description', title: '展覽說明', type: 'text', rows: 4 }),
    defineField({ name: 'curatorNote', title: '策展人語', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'artists',
      title: '參展藝術家',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'artist' }] }],
    }),
    defineField({
      name: 'works',
      title: '參展作品',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'artwork' }] }],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'status', media: 'coverImage' },
    prepare({ title, subtitle, media }) {
      const statusMap: Record<string, string> = { current: '當期', upcoming: '即將', past: '已結束' }
      return { title, subtitle: statusMap[subtitle] ?? subtitle, media }
    },
  },
})
