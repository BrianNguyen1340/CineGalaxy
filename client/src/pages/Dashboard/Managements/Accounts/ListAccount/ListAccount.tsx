import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TbLockAccess, TbLockAccessOff } from 'react-icons/tb'
import ReactPaginate from 'react-paginate'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import {
  useGetAllUsersByAdminQuery,
  useBlockAccountMutation,
  useUnblockAccountMutation,
} from '~/services/user.service'
import './ListAccount.scss'
import { Loader } from '~/components'
import { SquarePen } from 'lucide-react'

const ListAccount = () => {
  const { data: users, refetch, isLoading } = useGetAllUsersByAdminQuery({})

  const [blockAccount] = useBlockAccountMutation()
  const [unblockAccount] = useUnblockAccountMutation()

  useEffect(() => {
    refetch()
  }, [refetch])

  const handleBlockAccount = async (id: string) => {
    try {
      nProgress.start()
      await blockAccount(id)
      Swal.fire('Thành công!', 'Khóa tài khoản thành công!', 'success')
      refetch()
    } catch (error: any) {
      Swal.fire('Thất bại', error.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  const handleUnblockAccount = async (id: string) => {
    try {
      nProgress.start()
      await unblockAccount(id)
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
                  <td style={{ padding: '10px 0' }}>
                    <img
                      src={user.photoURL}
                      alt='avatar'
                      width='70'
                      height='70'
                      style={{ borderRadius: '50%' }}
                    />
                  </td>
                  <td>
                    {user.isBlocked === true ? (
                      <button
                        style={{ backgroundColor: 'white' }}
                        onClick={() => handleBlockAccount(user?._id)}
                      >
                        <TbLockAccessOff
                          size='20'
                          color='red'
                          style={{ backgroundColor: 'white' }}
                        />
                      </button>
                    ) : (
                      <button
                        style={{ backgroundColor: 'white' }}
                        onClick={() => handleUnblockAccount(user?._id)}
                      >
                        <TbLockAccess
                          size='20'
                          color='green'
                          style={{ backgroundColor: 'white' }}
                        />
                      </button>
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
