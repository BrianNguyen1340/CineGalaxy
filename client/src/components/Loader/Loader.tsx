import { PacmanLoader } from 'react-spinners'

const Loader = () => {
  return (
    <div className='flex h-screen w-full items-center justify-center bg-white'>
      <PacmanLoader color='#06d6a0' />
    </div>
  )
}

export default Loader
