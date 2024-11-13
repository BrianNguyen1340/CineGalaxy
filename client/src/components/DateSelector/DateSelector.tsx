import { FC } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'

type DateSelectorProps = {
  selectedDate?: Date
  onDateChange?: (date: Date) => void
}

const DateSelector: FC<DateSelectorProps> = ({
  selectedDate = new Date(),
  onDateChange = () => {},
}) => {
  const days = ['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy']

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const getWeekDays = (startDate: Date): Date[] => {
    const week: Date[] = []
    const dayOfWeek = startDate.getDay()
    const startOfWeek = new Date(startDate)
    startOfWeek.setDate(startDate.getDate() - dayOfWeek)

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      week.push(date)
    }

    return week
  }

  const currentWeek = getWeekDays(selectedDate)

  const handleDateClick = (date: Date) => {
    onDateChange(date)
  }

  const handleWeekChange = (direction: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + direction * 7)
    onDateChange(newDate)
  }
  return (
    <div className='h-fit w-full border-b-[5px] border-t-[5px] border-[#dad2b4] py-4 text-center'>
      <div className='mb-4 flex items-center justify-center'>
        <div className='mx-8 font-semibold'>
          <span className='mr-6 text-[34px] underline'>
            {selectedDate.getDate()}
          </span>
          <span className='mr-1 text-sm'>
            {months[selectedDate.getMonth()]}
          </span>
          <span className='text-sm'>{selectedDate.getFullYear()}</span>
        </div>
      </div>
      <div className='flex justify-between'>
        <button
          onClick={() => handleWeekChange(-1)}
          className='text-2xl font-bold text-gray-600'
        >
          <FaAngleLeft size='30' />
        </button>
        {currentWeek.map((date, index) => (
          <div
            key={index}
            onClick={() => handleDateClick(date)}
            className='flex cursor-pointer flex-col items-center rounded-full p-2'
          >
            <div className='text-sm font-semibold text-gray-500'>
              {days[date.getDay()]}
            </div>
            <div
              className={`${date.toDateString() === selectedDate.toDateString() ? 'bg-gray-800 text-white' : 'text-black'} mt-2 flex h-6 w-6 items-center justify-center rounded-full p-4 text-lg font-semibold`}
            >
              {date.getDate()}
            </div>
          </div>
        ))}
        <button
          onClick={() => handleWeekChange(1)}
          className='text-2xl font-bold text-gray-600'
        >
          <FaAngleRight size='30' />
        </button>
      </div>
    </div>
  )
}

export default DateSelector
