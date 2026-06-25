import { defineField, defineType } from 'sanity'

export const artworkSchema = defineType({
  name: 'artwork',
  title: '作品',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: '作品名稱', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'URL slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'artist', title: '藝術家', type: 'reference', to: [{ type: 'artist' }], validation: (r) => r.required() }),
    defineField({ name: 'year', title: '創作年份', type: 'number' }),
    defineField({ name: 'medium', title: '媒材', type: 'string' }),
    defineField({ name: 'dimensions', title: '尺寸', type: 'string' }),
    defineField({ name: 'series', title: '系列', type: 'string' }),
    defineField({
      name: 'status',
      title: '收藏狀態',
      type: 'string',
      options: {
        list: [
          { title: '開放收藏', value: 'available' },
          { title: '洽詢收藏', value: 'inquire' },
          { title: '僅展覽', value: 'not-for-sale' },
        ],
        layout: 'radio',
      },
      initialValue: 'inquire',
    }),
    defineField({ name: 'price', title: '價格（台幣）', type: 'number' }),
    defineField({ name: 'description', title: '作品描述', type: 'text', rows: 3 }),
    defineField({ name: 'story', title: '創作故事', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'workProcessLabel', title: '創作過程 — 小標籤', type: 'string' }),
    defineField({ name: 'workProcessTitle', title: '創作過程 — 主標題', type: 'string' }),
    defineField({ name: 'workProcess1Title', title: '步驟一標題', type: 'string' }),
    defineField({ name: 'workProcess1Body', title: '步驟一說明', type: 'text', rows: 2 }),
    defineField({ name: 'workProcess2Title', title: '步驟二標題', type: 'string' }),
    defineField({ name: 'workProcess2Body', title: '步驟二說明', type: 'text', rows: 2 }),
    defineField({ name: 'workProcess3Title', title: '步驟三標題', type: 'string' }),
    defineField({ name: 'workProcess3Body', title: '步驟三說明', type: 'text', rows: 2 }),
    defineField({
      name: 'images',
      title: '作品圖片',
      type: 'array',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [
          { name: 'alt', type: 'string', title: '圖片說明' },
          { name: 'caption', type: 'string', title: '圖說' },
        ],
      }],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'artist.name', media: 'images.0' },
  },
})
