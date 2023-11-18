import { ContentBlock, DraftStyleMap, Editor, EditorCommand, EditorState, RichUtils } from 'draft-js'
import { Dispatch, useEffect, useRef } from 'react'
import Toolbar from './Toolbar'

type TextEditorProps = {
  editorState: EditorState
  setEditorState: Dispatch<React.SetStateAction<EditorState>>
}

export default function TextEditor({ editorState, setEditorState }: TextEditorProps) {
  const editor = useRef<Editor>(null)

  useEffect(() => {
    focusEditor()
  }, [])

  const focusEditor = () => {
    editor.current?.focus()
  }

  const handleKeyCommand = (command: EditorCommand, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      setEditorState(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  // FOR INLINE STYLES
  const styleMap: DraftStyleMap = {
    CODE: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
    HIGHLIGHT: {
      backgroundColor: '#F7A5F7',
    },
    UPPERCASE: {
      textTransform: 'uppercase',
    },
    LOWERCASE: {
      textTransform: 'lowercase',
    },
    CODEBLOCK: {
      fontFamily: '"fira-code", "monospace"',
      fontSize: 'inherit',
      background: '#ffeff0',
      fontStyle: 'italic',
      lineHeight: 1.5,
      padding: '0.3rem 0.5rem',
      borderRadius: ' 0.2rem',
    },
    SUPERSCRIPT: {
      verticalAlign: 'super',
      fontSize: '80%',
    },
    SUBSCRIPT: {
      verticalAlign: 'sub',
      fontSize: '80%',
    },
  }

  // For block level styles: returns CSS classes from tailwindcss)
  const myBlockStyleFn = (contentBlock: ContentBlock): string => {
    const type = contentBlock.getType()
    switch (type) {
      case 'blockQuote':
        return 'text-gray-400 background-white italic border-l pl-4'
      case 'leftAlign':
        return 'text-left'
      case 'rightAlign':
        return 'text-right'
      case 'centerAlign':
        return 'text-center'
      case 'justifyAlign':
        return 'text-justify'
      default:
        break
    }
    return ''
  }

  return (
    <div className='rounded-3xl border bg-white p-4' onClick={focusEditor}>
      <Toolbar editorState={editorState} setEditorState={setEditorState} />
      <div className='prose min-h-[400px] w-full max-w-full rounded-xl border p-4'>
        <Editor
          ref={editor}
          handleKeyCommand={handleKeyCommand}
          editorState={editorState}
          customStyleMap={styleMap}
          blockStyleFn={myBlockStyleFn}
          onChange={(editorState) => {
            setEditorState(editorState)
          }}
        />
      </div>
    </div>
  )
}
