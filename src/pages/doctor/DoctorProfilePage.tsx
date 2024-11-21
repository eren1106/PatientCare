import DialogButton from '@/components/DialogButton';
import ProfileAvatar from '@/components/ProfileAvatar'
import { Card } from '@/components/ui/card'
import { DEFAULT_AVATAR_URL } from '@/constants'
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { deleteProfileById, getDoctorProfileById } from '@/services/profile.service';
import useLoading from '@/hooks/useLoading.hook';
import Spinner from '@/components/Spinner';
import { formatDate } from '@/utils';
import { Doctor } from '@/interfaces/user';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import DoctorProfileForm from './components/DoctorProfileForm';
import { logoutUser } from '@/services/auth.service';

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

// TODO: make patient and doctor share the same profile component
const DoctorProfilePage = () => {
  const { id } = useParams();

  const { isLoading, withLoading } = useLoading();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const navigate = useNavigate();

  const getData = async () => {
    try {
      if (id) {
        const data = await getDoctorProfileById(id);
        setDoctor(data);
      }
    }
    catch (e) {
      // NO USER FOUND
      navigate("/auth/login");
      return;
    }
  }

  useEffect(() => {
    withLoading(getData);
  }, []);

  const handleClickDelete = async () => {
    if (!id) return;
    try {
      await deleteProfileById(id);
      toast({
        variant: "success",
        title: "Account Deleted Successfully",
      });
      logoutUser();
      navigate("/auth/login");
    }
    catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Failed",
        description: `${e.response.data.message}`,
      });
    }
  }

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
                    {
                      doctor ? (
                        <DoctorProfileForm profile={doctor} />
                      ) : <p>No User Found!</p>
                    }
                  </div>
                }><Edit size={20} /></DialogButton>
              <DialogButton
                variant="destructive"
                title="Delete Account"
                content={
                  <div className="flex flex-col gap-6">
                    Are you sure want to delete this account?
                    <Button variant="destructive" onClick={handleClickDelete}>
                      Delete
                    </Button>
                  </div>
                }><Trash2 size={20} /></DialogButton>
            </div>
            <div className='flex gap-6'>
              <ProfileAvatar
                src={doctor?.profileImageUrl || DEFAULT_AVATAR_URL}
                className='size-48'
              />
              <div className='flex flex-col gap-3 w-full'>
                <ProfileInfo
                  label="Full Name"
                  value={doctor?.fullname}
                />
                <ProfileInfo
                  label="Age"
                  value={doctor?.age}
                />
                <ProfileInfo
                  label="Gender"
                  value={doctor?.gender}
                />
                <ProfileInfo
                  label="IC"
                  value={doctor?.ic}
                />
                <ProfileInfo
                  label="Registration Number"
                  value={doctor?.doctorValidation?.registrationNumber}
                />
                <ProfileInfo
                  label="Register Date"
                  value={formatDate(doctor?.createdDatetime)}
                />
                <ProfileInfo
                  label="Number of Assigned Patient"
                  // TODO: change to doctor fullname
                  value={doctor?.patientRecord.length}
                />
              </div>
            </div>
          </Card>
        )
      }
    </div>
  )
}

export default DoctorProfilePage