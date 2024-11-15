import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TbPlayerPlay } from 'react-icons/tb'
import ReactPlayer from 'react-player'
import ReactModal from 'react-modal'

import { useGetMovieQuery } from '~/services/movie.service'
import { paths } from '~/utils/paths'
import { MovieType } from '~/types/movie.type'
import useTitle from '~/hooks/useTitle'

ReactModal.setAppElement('#root')

const MovieDetails = () => {
  useTitle('Chi tiết phim')
  const { id } = useParams()

  const {
    data: movie,
    isLoading: isLoadingMovie,
    isSuccess: isSuccessMovie,
    refetch: refetchMovie,
  } = useGetMovieQuery(id)
  console.log(movie)

  useEffect(() => {
    refetchMovie()
  }, [refetchMovie])

  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const currentDate = new Date()

  const upcomingMovie =
    new Date(movie?.data?.releaseDate).getTime() > currentDate.getTime()

  let content
  if (isLoadingMovie) content = <div>Loading...</div>
  if (isSuccessMovie) {
    content = (
      <div className='h-fit w-full'>
        <div
          className='bg-[#efebdb] py-5 text-center text-sm font-semibold uppercase tracking-[0.5px]'
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        >
          phim hot tại rạp
        </div>
        <div className='bg-[#231f20]'>
          <div className='relative mx-auto h-[470px] w-[850px] overflow-hidden'>
            <img
              src={movie?.data?.banner}
              alt='banner'
              className='w-[850px] object-cover'
            />
            {!isOpen && (
              <button
                onClick={openModal}
                className='absolute left-[50%] top-[50%] z-10 flex h-[120px] w-[120px] translate-x-[-50%] translate-y-[-50%] cursor-pointer items-center justify-center rounded-full border-[3px] border-white'
              >
                <TbPlayerPlay size='50' color='white' />
              </button>
            )}
          </div>
          <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={{
              overlay: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                maxWidth: '800px',
              },
            }}
          >
            <ReactPlayer
              url={movie?.data?.trailer}
              controls
              playing
              width='100%'
            />
          </ReactModal>
        </div>
        <div className='mx-auto w-[980px] pb-[50px] pt-[30px]'>
          <div className='flex items-start'>
            <div className='mr-[30px]'>
              <div>
                <img
                  src={movie?.data?.poster}
                  alt='poster'
                  className='w-[220px] object-cover'
                />
              </div>
              {upcomingMovie ? (
                <></>
              ) : (
                <button className='mt-3 w-full bg-[#ef233c] text-base font-semibold capitalize text-white transition duration-500 hover:opacity-80'>
                  <Link to={paths.userPaths.showtimes} className='block p-4'>
                    đặt vé
                  </Link>
                </button>
              )}
            </div>
            <div className='flex w-full flex-col gap-3 text-sm'>
              <div className='text-2xl font-bold uppercase'>
                {movie?.data?.name}
              </div>
              <div>
                <strong>Đạo diễn: </strong>
                {movie?.data?.director}
              </div>
              <div>
                <strong>Xếp hạng độ tuổi: </strong> {movie?.data?.movieRating}
              </div>
              <div>
                <strong>Ngày phát hành: </strong>
                {new Date(movie?.data?.releaseDate).toLocaleDateString('vi-VN')}
              </div>
              <div className='flex items-center gap-1 capitalize'>
                <strong>Thể loại:</strong>
                {movie?.data?.genres?.map((item: MovieType, index: number) => (
                  <span key={index}>
                    {item?.name}
                    {index < movie?.data?.genres.length - 1 ? ' / ' : ''}
                  </span>
                ))}
              </div>
              <div>
                <strong>Thời lượng: </strong>
                {movie?.data?.duration} phút
              </div>
              <div>
                <strong>Phụ đề: </strong>
                {movie?.data?.subtitle}
              </div>
              <div>
                <strong>Định dạng phim: </strong>
                {movie?.data?.movieFormat}
              </div>
            </div>
          </div>
          <div className='mt-12'>
            <div className='mb-5 text-center text-2xl font-semibold capitalize'>
              tóm tắt
            </div>
            <div className='text-sm text-[#333]'>
              {movie?.data?.description}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return content
}

export default MovieDetails
