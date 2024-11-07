import React from 'react'
import { useLocation, Link } from 'react-router-dom'

import { paths } from '~/utils/paths'

const BreadcrumbAccount = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  const breadcrumbNameMap: { [key: string]: string } = {
    profile: 'thông tin tài khoản',
  }

  const formatBreadcrumbText = (text: string) => {
    return breadcrumbNameMap[text] || text.replace(/-/g, ' ')
  }

  return (
    <nav className='mb-[10px] h-fit w-full'>
      <ol className='flex items-center gap-4'>
        <li>
          <Link
            to={paths.userPaths.account}
            className='font-semibold capitalize hover:underline'
          >
            tài khoản
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
          const isLast = index === pathnames.length - 1

          return (
            <React.Fragment key={name}>
              <li
                aria-hidden='true'
                className='flex items-center justify-center'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  width='1rem'
                  height='1rem'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M8.25 4.5l7.5 7.5-7.5 7.5'
                  />
                </svg>
              </li>
              <li>
                {isLast ? (
                  <div className='font-semibold capitalize text-[#ef233c]'>
                    {formatBreadcrumbText(name)}
                  </div>
                ) : (
                  <Link
                    className='font-semibold capitalize hover:underline'
                    to={routeTo}
                  >
                    {formatBreadcrumbText(name)}
                  </Link>
                )}
              </li>
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

export default BreadcrumbAccount
