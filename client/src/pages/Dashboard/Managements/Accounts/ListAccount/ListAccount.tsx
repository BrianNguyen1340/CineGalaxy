import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaTimes, FaLock, FaLockOpen } from 'react-icons/fa'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import {
  useGetAllUsersByAdminQuery,
  useBlockAccountMutation,
  useUnblockAccountMutation,
} from '~/services/user.service'
import { Loader } from '~/components'
import './ListAccount.scss'

const ListAccount = () => {
  const { data: users, refetch, isLoading } = useGetAllUsersByAdminQuery({})

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

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className='list-account-container'>
      <div className='title'>danh sách tài khoản</div>
      {users ? (
        <>
          <table>
            <thead>
              <tr>
                <th>stt</th>
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
              {currentItems.map((user: any, index: number) => (
                <tr key={index}>
                  <td>{index + offset}</td>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td>
                    <img
                      src={user.photoURL}
                      alt='avatar'
                      width='70'
                      height='70'
                      style={{ borderRadius: '50%' }}
                    />
                  </td>
                  <td>
                    {new Date(user.lastLogin).toLocaleDateString('vi-VN')}
                    {' - '}
                    {new Date(user.lastLogin).toLocaleTimeString('vi-VN')}
                  </td>
                  <td>
                    {user.role === 0 ? (
                      <FaTimes size='20' color='red' />
                    ) : (
                      <>
                        {user.isBlocked ? (
                          <button
                            style={{
                              backgroundColor: 'white',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleUnblockAccount(user?._id)}
                          >
                            <FaLock
                              size='20'
                              color='red'
                              style={{
                                backgroundColor: 'white',
                              }}
                            />
                          </button>
                        ) : (
                          <button
                            style={{
                              backgroundColor: 'white',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleBlockAccount(user?._id)}
                          >
                            <FaLockOpen
                              size='20'
                              color='green'
                              style={{ backgroundColor: 'white' }}
                            />
                          </button>
                        )}
                      </>
                    )}
                  </td>
                  <td>{user.role}</td>
                  <td>
                    {user.role !== 0 && (
                      <Link to={`/update-account/${user._id}`}>
                        <SquarePen />
                      </Link>
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
      ) : (
        <div>Danh sách tài khoản trống!</div>
      )}
    </div>
  )
}

export default ListAccount
