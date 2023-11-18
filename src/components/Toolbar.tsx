import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faBold,
  faChevronDown,
  faChevronUp,
  faCode,
  faHighlighter,
  faItalic,
  faListOl,
  faListUl,
  faQuoteRight,
  faStrikethrough,
  faUnderline,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EditorState, RichUtils } from 'draft-js'
import { Dispatch, MouseEvent } from 'react'

type ToolbarProps = {
  editorState: EditorState
  setEditorState: Dispatch<React.SetStateAction<EditorState>>
}

export default function Toolbar({ editorState, setEditorState }: ToolbarProps) {
  const tools = [
    {
      label: 'In đậm',
      style: 'BOLD',
      icon: <FontAwesomeIcon icon={faBold} />,
      method: 'inline',
    },
    {
      label: 'In nghiêng',
      style: 'ITALIC',
      icon: <FontAwesomeIcon icon={faItalic} />,
      method: 'inline',
    },
    {
      label: 'Gạch chân',
      style: 'UNDERLINE',
      icon: <FontAwesomeIcon icon={faUnderline} />,
      method: 'inline',
    },
    {
      label: 'Highlight',
      style: 'HIGHLIGHT',
      icon: <FontAwesomeIcon icon={faHighlighter} />,
      method: 'inline',
    },
    {
      label: 'Gạch ngang',
      style: 'STRIKETHROUGH',
      icon: <FontAwesomeIcon icon={faStrikethrough} />,
      method: 'inline',
    },
    {
      label: 'Trích dẫn',
      style: 'blockQuote',
      icon: <FontAwesomeIcon icon={faQuoteRight} transform='grow-2' />,
      method: 'block',
    },
    {
      label: 'Danh sách',
      style: 'unordered-list-item',
      method: 'block',
      icon: <FontAwesomeIcon icon={faListUl} transform='grow-6' />,
    },
    {
      label: 'Danh sách đánh số',
      style: 'ordered-list-item',
      method: 'block',
      icon: <FontAwesomeIcon icon={faListOl} transform='grow-6' />,
    },
    {
      label: 'Code',
      style: 'CODEBLOCK',
      icon: <FontAwesomeIcon icon={faCode} transform='grow-3' />,
      method: 'inline',
    },
    {
      label: 'In hoa',
      style: 'UPPERCASE',
      icon: <FontAwesomeIcon icon={faChevronUp} transform='grow-3' />,
      method: 'inline',
    },
    {
      label: 'In thường',
      style: 'LOWERCASE',
      icon: <FontAwesomeIcon icon={faChevronDown} transform='grow-3' />,
      method: 'inline',
    },
    {
      label: 'Căn trái',
      style: 'leftAlign',
      icon: <FontAwesomeIcon icon={faAlignLeft} transform='grow-2' />,
      method: 'block',
    },
    {
      label: 'Căn giữa',
      style: 'centerAlign',
      icon: <FontAwesomeIcon icon={faAlignCenter} transform='grow-2' />,
      method: 'block',
    },
    {
      label: 'Căn phải',
      style: 'rightAlign',
      icon: <FontAwesomeIcon icon={faAlignRight} transform='grow-2' />,
      method: 'block',
    },
    { label: 'H1', style: 'header-one', method: 'block' },
    { label: 'H2', style: 'header-two', method: 'block' },
    { label: 'H3', style: 'header-three', method: 'block' },
    { label: 'H4', style: 'header-four', method: 'block' },
    { label: 'H5', style: 'header-five', method: 'block' },
    { label: 'H6', style: 'header-six', method: 'block' },
  ]

  const applyStyle = (e: MouseEvent<HTMLButtonElement>, style: string, method: string) => {
    e.preventDefault()
    method === 'block'
      ? setEditorState(RichUtils.toggleBlockType(editorState, style))
      : setEditorState(RichUtils.toggleInlineStyle(editorState, style))
  }

  const isActive = (style: string, method: string) => {
    if (method === 'block') {
      const selection = editorState.getSelection()
      const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType()
      return blockType === style
    } else {
      const currentStyle = editorState.getCurrentInlineStyle()
      return currentStyle.has(style)
    }
  }

  return (
    <div>
      {tools.map((item, idx) => (
        <button
          className='mr-2 cursor-pointer border-none bg-white p-2 text-base'
          style={{
            color: isActive(item.style, item.method) ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)',
          }}
          key={`${item.label}-${idx}`}
          title={item.label}
          onClick={(e) => applyStyle(e, item.style, item.method)}
          onMouseDown={(e) => e.preventDefault()}
        >
          {item.icon || item.label}
        </button>
      ))}
    </div>
  )
}
