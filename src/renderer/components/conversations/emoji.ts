// @ts-ignore
// We only really need the emoji data of this module
import EmojiConvertor from 'emoji-js-clean'
import { getLogger } from '../../../shared/logger'
// @ts-ignore
import emojiRegexRGI from 'emoji-regex/RGI_Emoji'

const log = getLogger('renderer/emoji')

const instance = new EmojiConvertor()
instance.init_colons()

export const emojiRegEx: RegExp = emojiRegexRGI()

// taken from (new EmojiConvertor()).rx_colons
const colonEmojiCodeRegExp = /:[a-zA-Z0-9-_+]+:(:skin-tone-[2-6]:)?/g

export function replaceColons(str: string) {
  return str.replace(colonEmojiCodeRegExp, m => {
    const name = m.split(':')[1]
    const skintoneString = m.split(':')[3] // this property is optional
    const codePoints = instance.map.colons[name]
      ?.split('-')
      .map((c: string) => parseInt(c, 16))
    if (codePoints) {
      if (skintoneString) {
        const skintoneNumber = Number(
          /^skin-tone-([2-6])$/.exec(skintoneString)[1]
        )
        codePoints.push(0x1f3fb + (skintoneNumber - 2))
      }

      return String.fromCodePoint(...codePoints)
    }

    return m
  })
}

export function replaceColonsSafe(message: string) {
  try {
    return replaceColons(message)
  } catch (error) {
    log.warn('replaceColons failed', error)
    return message
  }
}

export function getSizeClass(str: string) {
  const conv = str.replace(/-/g, '').replace(emojiRegEx, '-')
  if (conv.replace(/-/g, '').trim().length > 0) {
    // has normal characters?
    return ''
  }
  const emojiCount = conv.match(/-/g)?.length

  if (emojiCount > 8) {
    return ''
  } else if (emojiCount > 6) {
    return 'small'
  } else if (emojiCount > 4) {
    return 'medium'
  } else if (emojiCount > 2) {
    return 'large'
  } else {
    return 'jumbo'
  }
}
