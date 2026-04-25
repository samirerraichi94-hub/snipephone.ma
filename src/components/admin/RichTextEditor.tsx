'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, Strikethrough, List, ListOrdered,
  Heading2, Heading3, Quote, Undo, Redo, Link2, Image as ImageIcon,
} from 'lucide-react'

interface Props {
  content: string
  onChange: (html: string) => void
}

export function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: 'max-w-full rounded-lg my-4' } }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Commencez à écrire votre article...' }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[400px] px-6 py-4',
      },
    },
  })

  if (!editor) return null

  const ToolButton = ({
    onClick,
    active,
    title,
    children,
  }: {
    onClick: () => void
    active?: boolean
    title: string
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        active
          ? 'bg-[#E8691A] text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-[#1a2340]'
      }`}
    >
      {children}
    </button>
  )

  const setLink = () => {
    const url = window.prompt('URL du lien:')
    if (!url) return
    editor.chain().focus().setLink({ href: url }).run()
  }

  const addImage = () => {
    const url = window.prompt('URL de l\'image:')
    if (!url) return
    editor.chain().focus().setImage({ src: url }).run()
  }

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#E8691A]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-200 bg-gray-50">
        <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Gras">
          <Bold size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italique">
          <Italic size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Barré">
          <Strikethrough size={16} />
        </ToolButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Titre H2">
          <Heading2 size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Titre H3">
          <Heading3 size={16} />
        </ToolButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Liste à puces">
          <List size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Liste numérotée">
          <ListOrdered size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Citation">
          <Quote size={16} />
        </ToolButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolButton onClick={setLink} active={editor.isActive('link')} title="Lien">
          <Link2 size={16} />
        </ToolButton>
        <ToolButton onClick={addImage} title="Image">
          <ImageIcon size={16} />
        </ToolButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolButton onClick={() => editor.chain().focus().undo().run()} title="Annuler">
          <Undo size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().redo().run()} title="Refaire">
          <Redo size={16} />
        </ToolButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
