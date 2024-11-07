import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaTimes, FaLock, FaLockOpen } from 'react-icons/fa'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import {
  useGetUsersQuery,
  useBlockAccountMutation,
  useUnblockAccountMutation,
} from '~/services/user.service'
import { Loader } from '~/components'
import useTitle from '~/hooks/useTitle'

const ListAccount = () => {
  useTitle('Admin | Danh sách tài khoản')

  const {
    data: users,
    refetch,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery({})

  let content

  const [blockAccount] = useBlockAccountMutation()
  const [unblockAccount] = useUnblockAccountMutation()

  useEffect(() => {
    refetch()
  }, [refetch])

  const handleBlockAccount = async (_id: string) => {
    try {
      nProgress.start()
      await blockAccount(_id)
      Swal.fire('Thành công!', 'Khóa tài khoản thành công!', 'success')
      refetch()
    } catch (error: any) {
      Swal.fire('Thất bại', error.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  const handleUnblockAccount = async (_id: string) => {
    try {
      nProgress.start()
      await unblockAccount(_id)
      Swal.fire('Thành công!', 'Khóa tài khoản thành công!', 'success')
      refetch()
    } catch (error: any) {
      Swal.fire('Thất bại', error.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const currentItems = users
    ? users.data
        .slice()
        .reverse()
        .slice(offset, offset + itemsPerPage)
    : []
  const handlePageClick = (event: any) => {
    setCurrentPage(event.selected)
  }

  if (isLoading) content = <Loader />

  if (isSuccess) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          danh sách tài khoản
        </div>
        {users && (
          <>
            <table>
              <thead>
                <tr>
                  <th>no.</th>
                  <th>email</th>
                  <th>name</th>
                  <th>avatar</th>
                  <th>last login</th>
                  <th>isBlocked</th>
                  <th>role</th>
                  <th>action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>{index + offset}</td>
                    <td>{item.email}</td>
                    <td>{item.name}</td>
                    <td>
                      <div className='flex items-center justify-center'>
                        <img
                          src={item.photoURL}
                          alt='avatar'
                          width='70'
                          height='70'
                          className='rounded-full'
                        />
                      </div>
                    </td>
                    <td>
                      {new Date(item.lastLogin).toLocaleDateString('vi-VN')}
                      {' - '}
                      {new Date(item.lastLogin).toLocaleTimeString('vi-VN')}
                    </td>
                    <td>
                      {item.role === 0 ? (
                        <div className='flex items-center justify-center'>
                          <FaTimes size='20' color='red' />
                        </div>
                      ) : (
                        <>
                          {item.isBlocked ? (
                            <div className='flex items-center justify-center'>
                              <button
                                className='cursor-pointer bg-white'
                                onClick={() => handleUnblockAccount(item?._id)}
                              >
                                <FaLock
                                  size='20'
                                  color='red'
                                  className='bg-white'
                                />
                              </button>
                            </div>
                          ) : (
                            <div className='flex items-center justify-center'>
                              <button
                                className='cursor-pointer bg-white'
                                onClick={() => handleBlockAccount(item?._id)}
                              >
                                <FaLockOpen
                                  size='20'
                                  color='green'
                                  className='bg-white'
                                />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </td>
                    <td>{item.role}</td>
                    <td>
                      {item.role === 0 ? (
                        <div className='flex items-center justify-center'>
                          <FaTimes size='20' color='red' />
                        </div>
                      ) : (
                        <div className='flex items-center justify-center'>
                          <Link to={`/update-account/${item._id}`}>
                            <SquarePen />
                          </Link>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={Math.ceil(users.data.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </>
        )}
      </div>
    )
  }

  if (isError) {
    const errorMessage =
      error && 'message' in error ? error.message : 'An unknown error occurred.'

    content = (
      <div>
        <p>{errorMessage}</p>
        {error && 'data' in error && (
          <pre>{JSON.stringify(error.data, null, 2)}</pre>
        )}
      </div>
    )
  }

  return content
}

export default ListAccount
