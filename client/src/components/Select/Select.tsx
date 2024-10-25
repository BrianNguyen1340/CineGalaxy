import './Select.scss'
type SelectOption = {
  label: string
  value: string
}

type SelectProps = {
  options: SelectOption[]
  value?: SelectOption | undefined
  onChange: (value: SelectOption | undefined) => void
}

const Select = ({ value, onChange, options }: SelectProps) => {
  return <div className='select-container'></div>
}

export default Select
