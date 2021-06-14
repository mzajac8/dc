import React from 'react'
import classNames from 'classnames'
import { useTranslationFunction } from '../contexts'

export function ClearButton(props: {
  onChange: (event: { target: { value: '' } }) => void
  value: string
}) {
  const { onChange, value } = props
  const onClear = () => onChange({ target: { value: '' } })

  return (
    <button
      aria-label='Clear'
      className={classNames(
        'bp3-dialog-close-button bp3-button bp3-minimal bp3-icon-large bp3-icon-cross clear-button',
        { 'clear-button--hidden': value === '' }
      )}
      onClick={onClear}
    />
  )
}

export default function SearchInput(props: {
  onChange: (
    event: React.ChangeEvent<HTMLInputElement> & { target: { value: '' } }
  ) => void
  value: string
  className: string
  id: string
  inputRef?: React.ClassAttributes<HTMLInputElement>['ref']
}) {
  const { onChange, value, className, id } = props
  const tx = useTranslationFunction()
  return (
    <>
      <input
        id={id}
        placeholder={tx('search')}
        autoFocus
        onChange={onChange}
        value={value}
        className={'search-input ' + className}
        ref={props.inputRef}
        spellCheck={false}
      />
      <ClearButton value={value} onChange={onChange} />
    </>
  )
}
