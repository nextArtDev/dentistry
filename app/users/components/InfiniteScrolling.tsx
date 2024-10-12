'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import Image from 'next/image'
import { getUserTimelines } from '@/lib/queries/auth/user'
import { TimeLine } from '@prisma/client'
import { Timeline } from '@/components/timeline/timeline'

export default function InfiniteScrolling({
  initials,
  userId,
}: {
  initials: (TimeLine & { images: { url: string }[] | null })[] | undefined
  userId: string
}) {
  const [timelines, setTimelines] = useState(initials)
  const [page, setPage] = useState(1)
  const [ref, inView] = useInView()

  async function loadMoreTimelines() {
    const next = page + 1
    const timelines = await getUserTimelines({ id: userId, page: next })
    if (timelines?.length) {
      setPage(next)
      setTimelines(
        (
          prev: (TimeLine & { images: { url: string }[] | null })[] | undefined
        ) => [...(prev?.length ? prev : []), ...timelines]
      )
    }
  }

  // TODO: wrap loadMoreMovies in useCallback and pass it to the dep array
  useEffect(() => {
    if (inView) {
      loadMoreTimelines()
    }
  }, [inView])

  const data = timelines?.map((tl) => {
    return {
      title: tl.date,
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            ویزیت
          </p>
          <div className="grid grid-cols-2 gap-4">
            {!!tl?.images &&
              tl.images.map((image) => (
                <Image
                  key={image.url}
                  src={image.url}
                  alt="startup template"
                  width={500}
                  height={500}
                  className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                />
              ))}
          </div>
        </div>
      ),
    }
  })

  return (
    <section>
      {!!data && <Timeline data={data} />}

      {/* {timelines?.map((timeline) => (
        <li
          key={timeline.id}
          className="relative flex flex-col mx-auto w-3/4 bg-red-400/60 rounded-md h-[50vh] my-20 items-center justify-center gap-8"
        >
          <div className="group aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            {timeline.images && (
              <Image
                src={timeline.poster}
                alt=""
                className="w-full object-cover group-hover:opacity-75"
                width={300}
                height={300}
              />
            )}
          </div>
          <p className="mt-2 block truncate font-medium">{timeline.date}</p>
          <p className="block text-sm font-medium ">{timeline.description}</p>
          <p className="block text-sm font-medium ">{timeline.date}</p>
        </li>
      ))} */}

      {/* loading spinner */}
      <div
        ref={ref}
        className="col-span-1 mt-16 flex items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4"
      >
        <svg
          aria-hidden="true"
          className="h-10 w-10 animate-spin fill-sky-600 text-gray-200 dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </section>
  )
}
