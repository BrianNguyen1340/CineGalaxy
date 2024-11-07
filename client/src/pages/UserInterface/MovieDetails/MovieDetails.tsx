import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TbPlayerPlay } from 'react-icons/tb'
import ReactPlayer from 'react-player'
import ReactModal from 'react-modal'

import { useGetMovieQuery } from '~/services/movie.service'
import { paths } from '~/utils/paths'
import { Loader } from '~/components'

ReactModal.setAppElement('#root')

const MovieDetails = () => {
  const { id } = useParams()

  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const { data: movie, isLoading } = useGetMovieQuery(id)

  if (isLoading) {
    return <Loader />
  }

  return (
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
            alt=''
            className='w-[850px] object-cover'
          />
          {!isOpen && (
            <button
              onClick={openModal}
              className='absolute left-[50%] top-[50%] z-10 h-[120px] w-[120px] translate-x-[-50%] translate-y-[-50%] cursor-pointer rounded-full border-[3px] border-white'
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
            <button className='btn-to-showtime mt-10px'>
              <Link to={paths.userPaths.showtimes}>đặt vé</Link>
            </button>
          </div>
          <div className='info-main'>
            <div className='name'>{movie?.data?.name}</div>
            <div className='director'>
              <strong>Đạo diễn: </strong>
              {movie?.data?.director}
            </div>
            <div className='movie-rating'>
              <strong>Xếp hạng độ tuổi: </strong> {movie?.data?.movieRating}
            </div>
            <div className='release-date'>
              <strong>Ngày phát hành: </strong>
              {new Date(movie?.data?.releaseDate).toLocaleDateString('vi-VN')}
            </div>
            <div className='genres'>
              <strong>Thể loại:</strong>
              {movie?.data?.genres?.map((item: any, index: number) => (
                <span key={index}>
                  {item?.name}
                  {index < movie.data.genres.length - 1 ? ' / ' : ''}
                </span>
              ))}
            </div>
            <div className='duration'>
              <strong>Thời lượng: </strong>
              {movie?.data?.duration} phút
            </div>
            <div className='subtitle'>
              <strong>Phụ đề: </strong>
              {movie?.data?.subtitle}
            </div>
            <div className='movie-format'>
              <strong>Định dạng phim: </strong>
              {movie?.data?.movieFormat}
            </div>
          </div>
        </div>
        <div className='description'>
          <div className='description-title'>tóm tắt</div>
          <div className='description-text'>{movie?.data?.description}</div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
