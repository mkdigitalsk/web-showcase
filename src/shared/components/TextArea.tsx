import { Field } from '@base-ui/react/field'
import { FieldFrame, type FieldFrameProps } from './fields/FieldFrame'

/** The control's props are Base UI's, which type every field control as an input even when it draws a textarea. */
interface TextAreaProps extends FieldFrameProps, Omit<Field.Control.Props, 'className' | 'render' | 'size'> {
  /** The lines shown before anything is typed; the area grows by hand from there. */
  minRows?: number
}

/** Several lines of text — notes, a message, an analysis. */
export function TextArea({
  label,
  error,
  errorText,
  helperText,
  size,
  disabled,
  endAdornment,
  className,
  minRows = 3,
  ...props
}: TextAreaProps) {
  return (
    <FieldFrame
      label={label}
      error={error}
      errorText={errorText}
      helperText={helperText}
      size={size}
      disabled={disabled}
      endAdornment={endAdornment}
      className={className}
    >
      <Field.Control render={<textarea rows={minRows} />} {...props} />
    </FieldFrame>
  )
}
