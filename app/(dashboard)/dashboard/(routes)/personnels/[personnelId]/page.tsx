import { prisma } from '@/lib/prisma'
import PersonnelForm from './components/PersonnelForm'

const PersonnelPage = async ({
  params,
}: {
  params: { personnelId: string }
}) => {
  const personnel = await prisma.personnel.findUnique({
    where: {
      id: params.personnelId,
    },
    //Because array of images is separate model we have to include it, because we want row of url's not array of id's
    include: {
      images: true,
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PersonnelForm initialData={personnel} />
      </div>
    </div>
  )
}

export default PersonnelPage
