import { Check, X } from 'lucide-react'

const PasswordCriteria = ({ password }: { password: string }) => {
  const criteria = [
    {
      label: 'Độ dài ký tự từ 8 đến 30 ký tự!',
      met: password?.length >= 8 && password?.length <= 30,
    },
    {
      label: 'Chứa ký tự viết hoa!',
      met: password && /[A-Z]/.test(password),
    },
    {
      label: 'Chứa ký tự viết thường!',
      met: password && /[a-z]/.test(password),
    },
    {
      label: 'Chứa số!',
      met: password && /\d/.test(password),
    },
    {
      label: 'Chứa ký tự đặc biệt!',
      met: password && /[^A-Za-z0-9]/.test(password),
    },
  ]

  return (
    <div className='mt-[10px]'>
      {criteria.map((item) => (
        <div className='flex items-center' key={item.label}>
          {item.met ? (
            <Check className='mr-2 h-4 w-4 text-[green]' />
          ) : (
            <X className='mr-2 h-4 w-4 text-[red]' />
          )}
          <span
            className={`mr-[1px] font-semibold ${item.met ? 'text-[green]' : 'text-[red]'}`}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

const PasswordStrength = ({ password }: { password: string }) => {
  const getStrength = (pass: string) => {
    if (!pass) return 0

    let strength = 0
    if (pass.length >= 8 && pass.length <= 30) strength++
    if (pass.match(/[A-Z]/)) strength++
    if (pass.match(/[a-z]/)) strength++
    if (pass.match(/\d/)) strength++
    if (pass.match(/[^a-zA-Z\d]/)) strength++

    return strength
  }

  const strength = getStrength(password)

  const getColor = (strength: number) => {
    switch (strength) {
      case 1:
        return '#D32F2F'
      case 2:
        return '#F57C00'
      case 3:
        return '#FFEB3B'
      case 4:
        return '#8BC34A'
      default:
        return '#1976D2'
    }
  }

  const getStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
        return 'Rất Yếu'
      case 1:
        return 'Yếu'
      case 2:
        return 'Khá'
      case 3:
        return 'Tốt'
      case 4:
        return 'Khá Tốt'
      default:
        return 'Mạnh'
    }
  }

  return (
    <div className='mt-[30px]'>
      <div className='mb-1 flex items-center justify-between'>
        <span className='m-0 font-semibold capitalize text-[gray]'>
          độ mạnh mật khẩu
        </span>
        <span className='font-semibold text-[gray]'>
          {getStrengthText(strength)}
        </span>
      </div>
      <div className='flex gap-1'>
        {[...Array(5)].map((_, index) => (
          <div
            className='h-2 w-[25%] transition duration-300'
            key={index}
            style={{
              backgroundColor:
                strength > index ? getColor(strength) : 'lightgray',
            }}
          />
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  )
}

export default PasswordStrength
