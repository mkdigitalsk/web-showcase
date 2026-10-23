import { FormattedDate } from 'react-intl'
import { DateFormats } from '../../../utils'
import type { BaseTextProps } from './types'
import { TextBody1Neutral60 } from './TextBody1'

type TextTimestampProps = Omit<BaseTextProps, 'children'> & {
  value: number
  format?: Intl.DateTimeFormatOptions
}

export function TextTimestamp({ value, format = DateFormats.DATETIME, ...props }: TextTimestampProps) {
  return (
    <TextBody1Neutral60 {...props}>
      <FormattedDate value={value} {...format} />
    </TextBody1Neutral60>
  )
}
