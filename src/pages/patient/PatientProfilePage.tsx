import DialogButton from '@/components/DialogButton';
import ProfileAvatar from '@/components/ProfileAvatar'
import { Card } from '@/components/ui/card'
import { MOCK_PATIENT_IMAGE_PATH } from '@/constants'
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import PatientProfileForm from './components/PatientProfileForm';
import { useParams } from 'react-router-dom';
import { getProfileById } from '@/services/profile.service';
import { Patient } from '@/interfaces/dashboard';
import useLoading from '@/hooks/useLoading.hook';
import Spinner from '@/components/Spinner';
import { formatDate } from '@/utils';

interface ProfileInfoProps {
  label: string;
  value: string | number | undefined;
}

const ProfileInfo = ({
  label,
  value
}: ProfileInfoProps) => {
  return (
    <div className='flex gap-3'>
      <p className='w-1/3 font-semibold'>{`${label}:`}</p>
      <p className='w-2/3'>{value}</p>
    </div>
  )
}

const PatientProfilePage = () => {
  const { id } = useParams();

  const { isLoading, withLoading } = useLoading();
  const [patient, setPatient] = useState<Patient | null>(null);

  const getData = async () => {
    if (id) {
      const data = await getProfileById(id);
      setPatient(data);
    }
  }

  useEffect(() => {
    withLoading(getData);
  }, [])

  return (
    <div>
      {
        isLoading ? <Spinner /> : (
          <Card className='p-6 max-w-[44rem]'>
            <div className='flex gap-2 justify-end'>
              <DialogButton
                variant="outline"
                title="Edit Profile"
                content={
                  <div className="flex flex-col gap-3">
                    <PatientProfileForm />
                  </div>
                }><Edit size={20} /></DialogButton>
              <DialogButton
                variant="destructive"
                title="Delete Account"
                content={
                  <div className="flex flex-col gap-3">
                    comfirm delete
                  </div>
                }><Trash2 size={20} /></DialogButton>
            </div>
            <div className='flex gap-6'>
              <ProfileAvatar
                src={MOCK_PATIENT_IMAGE_PATH}
                className='size-48'
              />
              <div className='flex flex-col gap-3 w-full'>
                <ProfileInfo
                  label="Full Name"
                  // TODO: add fullname to user model
                  value={patient?.username}
                />
                <ProfileInfo
                  label="Age"
                  // TODO: revamp patientRecord model, so that age is inside patient model
                  value={patient?.patientRecord.age}
                />
                <ProfileInfo
                  label="Gender"
                  value={patient?.patientRecord.gender}
                />
                <ProfileInfo
                  label="IC"
                  // TODO: change the property name to ic instead of ic_no
                  value={patient?.patientRecord.ic_no}
                />
                <ProfileInfo
                  label="Register Date"
                  value={formatDate(patient?.createdDatetime)}
                />
                <ProfileInfo
                  label="Assigned Doctor"
                  // TODO: change to doctor fullname
                  value={patient?.patientRecord.doctor.username}
                />
                <ProfileInfo
                  label="Assigned Exercises"
                  value={patient?.patientExercise.length}
                />
              </div>
            </div>
          </Card>
        )
      }
    </div>
  )
}

export default PatientProfilePage