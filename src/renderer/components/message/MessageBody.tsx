import React from 'react'
import classNames from 'classnames'
import { getSizeClass, emojiRegEx, replaceColons } from '../conversations/emoji'
import { rules } from './MessageMarkdown'
import SimpleMarkdown from 'simple-markdown'

const parser = SimpleMarkdown.parserFor(rules)
const ast2react = (SimpleMarkdown.outputFor as any)(rules, 'react')

export default function MessageBody(props: {
  text: string
  disableJumbomoji?: boolean
  preview?: boolean
}) {
  const { text, disableJumbomoji, preview } = props
  // if text is only emojis and Jumbomoji is enabled
  const emojifiedText = trim(text.replace(/:[\w\d_\-+]*:/g, replaceColons))
  if (
    emojifiedText.length < 50 &&
    !disableJumbomoji &&
    emojifiedText.replace(emojiRegEx, '') === ''
  ) {
    const sizeClass = disableJumbomoji ? '' : getSizeClass(emojifiedText)
    return (
      <span className={classNames('emoji-container', sizeClass)}>
        {emojifiedText}
      </span>
    )
  }
  if (preview) return emojifiedText
  const ast = parser(emojifiedText)
  const res = ast2react(ast)
  return res
}
const trimRegex = /^[\s\uFEFF\xA0\n\t]+|[\s\uFEFF\xA0\n\t]+$/g

/** removes linebreaks at start and end */
function trim(str: string) {
  return str.replace(trimRegex, '')
}
