// The seed's markdown is three shapes: paragraphs, bullet lists and level-1
// headings, with inline links and bold. Building the lexical document here
// keeps the seed readable as the markdown it came from.

type Node = Record<string, unknown>

const text = (value: string, format = 0): Node => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text: value,
  version: 1,
})

const link = (label: string, url: string): Node => ({
  type: 'link',
  children: [text(label)],
  direction: 'ltr',
  fields: { linkType: 'custom', newTab: false, url },
  format: '',
  indent: 0,
  version: 3,
})

// **bold** and [label](url); everything else is literal.
const inline = (value: string): Node[] => {
  const nodes: Node[] = []
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g
  let last = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(value)) !== null) {
    if (match.index > last) nodes.push(text(value.slice(last, match.index)))
    if (match[1] !== undefined) nodes.push(link(match[1], match[2]))
    else nodes.push(text(match[3], 1))
    last = match.index + match[0].length
  }
  if (last < value.length) nodes.push(text(value.slice(last)))
  return nodes.length ? nodes : [text('')]
}

const block = (type: string, children: Node[], extra: Node = {}): Node => ({
  type,
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  ...extra,
})

export const markdown = (source: string) => {
  const children: Node[] = []
  let list: Node[] | null = null

  const closeList = () => {
    if (!list) return
    children.push(block('list', list, { listType: 'bullet', start: 1, tag: 'ul' }))
    list = null
  }

  for (const raw of source.trim().split('\n')) {
    const line = raw.trim()
    if (!line) {
      closeList()
      continue
    }
    if (line.startsWith('* ')) {
      list = list || []
      list.push(
        block('listitem', inline(line.slice(2)), { checked: undefined, value: list.length + 1 }),
      )
      continue
    }
    closeList()
    const heading = /^(#+)\s+(.*)$/.exec(line)
    if (heading) {
      children.push(block('heading', inline(heading[2]), { tag: `h${heading[1].length}` }))
      continue
    }
    children.push(block('paragraph', inline(line), { textFormat: 0 }))
  }
  closeList()

  return { root: block('root', children) }
}
