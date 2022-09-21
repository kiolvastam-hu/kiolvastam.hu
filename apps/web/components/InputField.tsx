import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
  Textarea,
  TextareaProps,
} from '@chakra-ui/react'
import { useField } from 'formik'
import React, { InputHTMLAttributes } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
  textarea?: boolean
} & InputProps &
  TextareaProps


export const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  hidden,
  size: _,
  ...props
}) => {
  let InputOrTextarea: typeof Input | typeof Textarea = Input
  if (textarea) {
    InputOrTextarea = Textarea
  }
  const [field, { error }] = useField(props)
  return (
    <FormControl isInvalid={!!error}>
      {!hidden && <FormLabel htmlFor={field.name}>{label}</FormLabel>}
      <InputOrTextarea {...field} {...props} id={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  )
}
