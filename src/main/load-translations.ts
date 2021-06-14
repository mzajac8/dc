import path from 'path'
import fs from 'fs'

import { getLogger } from '../shared/logger'
const log = getLogger('load-transaltions')

import { app as rawApp } from 'electron'
import { ExtendedAppMainProcess } from './types'
import { translate } from '../shared/localize'
const app = rawApp as ExtendedAppMainProcess

export default function setLanguage(locale: string) {
  const localeData = loadTranslations(locale)
  app.localeData = localeData
  app.translate = translate(app.localeData.messages)
}

export function loadTranslations(locale: string) {
  const messagesEnglish = getLocaleMessages(retrieveLocaleFile('en'))

  let messages

  let localeFile = retrieveLocaleFile(locale)
  let localeMessages = getLocaleMessages(localeFile)

  if (!localeMessages && locale.indexOf('-') !== -1) {
    // We couldn't load the file for the locale but it's a dialect. Try to fall
    // back to the main language (example: de-CH -> de)
    locale = locale.split('-')[0]
    localeFile = retrieveLocaleFile(locale)
    localeMessages = getLocaleMessages(localeFile)
  } else if (!localeMessages) {
    log.error(`Could not load messages for ${locale}`, locale)
    locale = 'en'
    messages = messagesEnglish
  }

  if (localeMessages) {
    messages = Object.assign({}, messagesEnglish, localeMessages)
  }

  const experimentalFile = retrieveLocaleFile('_untranslated_en')
  const experimentalMessages = getLocaleMessages(experimentalFile)
  if (experimentalMessages) {
    messages = Object.assign(messages, experimentalMessages)
  } else {
    log.debug(`No experimental language file (${experimentalFile}) found`)
  }

  log.debug(messages['no_chat_selected_suggestion_desktop'])
  return { messages, locale }
}

function retrieveLocaleFile(locale: string) {
  const onDiskLocale = locale.replace('-', '_')
  return path.join(__dirname, '..', '..', '_locales', onDiskLocale + '.json')
}

function getLocaleMessages(file: string) {
  if (!fs.existsSync(file)) return false
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch (err) {
    log.error(`JSON parse error in language file '${file}'`, err)
    throw err
  }
}
