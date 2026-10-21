'use client';

import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaLink,
  FaUnlink,
  FaUndo,
  FaRedo,
} from 'react-icons/fa';
import { UploadButton } from '@/lib/uploadthing';
import { useT } from '@/lib/i18n/I18nProvider';

type Props = {
  value: string;
  onChange: (html: string, plainText: string) => void;
};
type TextAlignValue = 'left' | 'center' | 'right' | 'justify';
type MaybeTextAlign = TextAlignValue | null | undefined;
type FontSizeValue = '12px' | '14px' | '16px' | '18px' | '20px' | '24px';

const FONT_SIZE_OPTIONS: FontSizeValue[] = ['12px', '14px', '16px', '18px', '20px', '24px'];

function normalizeEditorHtml(html: string): string {
  return html === '<p></p>' ? '' : html;
}

const CustomTextAlign = Extension.create({
  name: 'customTextAlign',
  addGlobalAttributes() {
    return [
      {
        types: ['heading', 'paragraph'],
        attributes: {
          textAlign: {
            default: 'left',
            parseHTML: (element: HTMLElement) => {
              const align = element.style.textAlign;
              if (align === 'center' || align === 'right' || align === 'justify') {
                return align;
              }
              return 'left';
            },
            renderHTML: (attributes: { textAlign?: MaybeTextAlign }) => {
              if (!attributes.textAlign || attributes.textAlign === 'left') {
                return {};
              }
              return { style: `text-align: ${attributes.textAlign}` };
            },
          },
        },
      },
    ];
  },
});

const CustomFontSize = Extension.create({
  name: 'customFontSize',
  addGlobalAttributes() {
    return [
      {
        types: ['heading', 'paragraph'],
        attributes: {
          fontSize: {
            default: '14px',
            parseHTML: (element: HTMLElement) => {
              const size = element.style.fontSize;
              if (FONT_SIZE_OPTIONS.includes(size as FontSizeValue)) {
                return size;
              }
              return '14px';
            },
            renderHTML: (attributes: { fontSize?: FontSizeValue | null }) => {
              if (!attributes.fontSize || attributes.fontSize === '14px') {
                return {};
              }
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
});

export default function NewsletterRichEditor({ value, onChange }: Props) {
  const t = useT();
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkValue, setLinkValue] = useState('https://');
  const [currentAlign, setCurrentAlign] = useState<TextAlignValue>('left');
  const [currentFontSize, setCurrentFontSize] = useState<FontSizeValue>('14px');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        protocols: ['https'],
        defaultProtocol: 'https',
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      CustomTextAlign,
      CustomFontSize,
    ],
    content: value || '<p></p>',
    editorProps: {
      attributes: {
        class:
          'min-h-[220px] rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none focus-within:border-orange-300/70 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-1',
      },
    },
    onUpdate({ editor: tiptapEditor }) {
      onChange(
        normalizeEditorHtml(tiptapEditor.getHTML()),
        tiptapEditor.getText().trim(),
      );
    },
    onSelectionUpdate({ editor: tiptapEditor }) {
      const headingAlign = tiptapEditor.getAttributes('heading').textAlign as MaybeTextAlign;
      const paragraphAlign = tiptapEditor.getAttributes('paragraph').textAlign as MaybeTextAlign;
      const nextAlign = headingAlign || paragraphAlign || 'left';
      setCurrentAlign(nextAlign);

      const headingFontSize = tiptapEditor.getAttributes('heading').fontSize as FontSizeValue | undefined;
      const paragraphFontSize = tiptapEditor.getAttributes('paragraph').fontSize as FontSizeValue | undefined;
      const nextFontSize = headingFontSize || paragraphFontSize || '14px';
      setCurrentFontSize(
        FONT_SIZE_OPTIONS.includes(nextFontSize) ? nextFontSize : '14px',
      );
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = normalizeEditorHtml(editor.getHTML());
    if (value !== current) {
      editor.commands.setContent(value || '<p></p>', { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  const toolbarButtonClass =
    'inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-2.5 py-1.5 text-white/80 hover:bg-white/10 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer';
  const activeToolbarButtonClass =
    'inline-flex items-center justify-center rounded-lg border border-orange-300/50 bg-orange-400/20 px-2.5 py-1.5 text-orange-100 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer';

  const openLinkModal = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    setLinkValue(previousUrl || 'https://');
    setIsLinkModalOpen(true);
  };

  const applyLink = () => {
    const trimmedUrl = linkValue.trim();
    if (!trimmedUrl) {
      editor.chain().focus().unsetLink().run();
      setIsLinkModalOpen(false);
      return;
    }

    const normalizedUrl = /^https?:\/\//i.test(trimmedUrl)
      ? trimmedUrl
      : `https://${trimmedUrl}`;

    editor.chain().focus().setLink({ href: normalizedUrl }).run();
    setIsLinkModalOpen(false);
  };

  const applyTextAlign = (align: TextAlignValue) => {
    if (editor.isActive('heading')) {
      editor.chain().focus().updateAttributes('heading', { textAlign: align }).run();
    } else {
      editor.chain().focus().updateAttributes('paragraph', { textAlign: align }).run();
    }
    setCurrentAlign(align);
  };

  const applyFontSize = (fontSize: FontSizeValue) => {
    if (editor.isActive('heading')) {
      editor.chain().focus().updateAttributes('heading', { fontSize }).run();
    } else {
      editor.chain().focus().updateAttributes('paragraph', { fontSize }).run();
    }
    setCurrentFontSize(fontSize);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/25 p-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={toolbarButtonClass}>
          <FaBold className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={toolbarButtonClass}>
          <FaItalic className="h-3.5 w-3.5" />
        </button>
        <select
          value={currentFontSize}
          onChange={(e) => applyFontSize(e.target.value as FontSizeValue)}
          className="rounded-lg border border-white/20 bg-white/5 px-2.5 py-1.5 text-xs text-white outline-none focus:border-orange-300/70"
        >
          {FONT_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size} className="bg-slate-900 text-white">
              {size}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => applyTextAlign('left')}
          className={currentAlign === 'left' ? activeToolbarButtonClass : toolbarButtonClass}
        >
          <FaAlignLeft className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => applyTextAlign('center')}
          className={currentAlign === 'center' ? activeToolbarButtonClass : toolbarButtonClass}
        >
          <FaAlignCenter className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => applyTextAlign('right')}
          className={currentAlign === 'right' ? activeToolbarButtonClass : toolbarButtonClass}
        >
          <FaAlignRight className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => applyTextAlign('justify')}
          className={currentAlign === 'justify' ? activeToolbarButtonClass : toolbarButtonClass}
        >
          <FaAlignJustify className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toolbarButtonClass}
        >
          <FaListUl className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={toolbarButtonClass}
        >
          <FaListOl className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={openLinkModal} className={toolbarButtonClass}>
          <FaLink className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          className={toolbarButtonClass}
          disabled={!editor.isActive('link')}
        >
          <FaUnlink className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={toolbarButtonClass}>
          <FaUndo className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={toolbarButtonClass}>
          <FaRedo className="h-3.5 w-3.5" />
        </button>
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            const url = res?.[0]?.serverData?.url ?? res?.[0]?.ufsUrl ?? res?.[0]?.url;
            if (url && typeof url === 'string') {
              editor.chain().focus().setImage({ src: url, alt: 'Newsletter image' }).run();
            }
          }}
          appearance={{
            button:
              'inline-flex items-center justify-center rounded-lg border border-orange-300/35 bg-orange-400/15 px-2.5 py-1.5 text-[11px] font-semibold text-orange-200 hover:bg-orange-400/25 transition',
            container: 'inline-flex',
            allowedContent: 'hidden',
          }}
          content={{
            button: t('admin.newsletter.addImage'),
          }}
        />
      </div>
      {isLinkModalOpen && (
        <div className="rounded-xl border border-white/15 bg-slate-950/95 p-3">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-medium uppercase tracking-wider text-white/60">
              {t('admin.newsletter.linkUrl')}
            </label>
            <input
              type="text"
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              placeholder={t('admin.newsletter.linkPlaceholder')}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/35 outline-none focus:border-orange-300/70 focus:ring-1 focus:ring-orange-300/40"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={applyLink}
                className="rounded-lg border border-orange-300/35 bg-orange-400/15 px-3 py-1.5 text-xs font-semibold text-orange-200 hover:bg-orange-400/25 transition"
              >
                {t('admin.newsletter.addLink')}
              </button>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 transition"
              >
                {t('admin.common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
