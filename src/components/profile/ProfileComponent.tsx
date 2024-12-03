import DialogButton from '@/components/DialogButton';
import ProfileAvatar from '@/components/ProfileAvatar'
import { Card } from '@/components/ui/card'
import { DEFAULT_AVATAR_URL } from '@/constants'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteProfileById, getProfileById } from '@/services/profile.service';
import useLoading from '@/hooks/useLoading.hook';
import { formatDate } from '@/utils';
import { Doctor, Patient } from '@/interfaces/user';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getCurrentUser, logoutUser } from '@/services/auth.service';
import SkeletonCard from '@/components/SkeletonCard';
import DoctorProfileForm from '@/pages/doctor/components/DoctorProfileForm';
import PatientProfileForm from '@/pages/patient/components/PatientProfileForm';
import { cn } from '@/lib/utils';

interface ProfileInfoProps {
  label: string;
  value: string | number | undefined;
  link?: string;
}

const ProfileInfo = ({
  label,
  value,
  link,
}: ProfileInfoProps) => {
  return (
    <div className='flex justify-between border-b last:border-none pb-3 last:pb-0'>
      <p className='font-semibold'>{`${label}:`}</p>
      {
        link ? <Link className='text-end underline text-primary' to={link}>{value}</Link>
        : <p className='text-end'>{value}</p>
      }
    </div>
  )
}

interface ProfileComponentProps {
  isDoctor?: boolean;
}

const ProfileComponent = ({ isDoctor = false }: ProfileComponentProps) => {
  const { id } = useParams();
  const currentUser = getCurrentUser();

  const { isLoading, withLoading } = useLoading();
  // const [patient, setPatient] = useState<Patient | null>(null);
  // const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [user, setUser] = useState<Patient | Doctor | null>(null);
  const navigate = useNavigate();

  const getData = async () => {
    try {
      if (id) {
        const data = await getProfileById(id);
        if (isDoctor) {
          setUser(data as Doctor);
        } else {
          setUser(data as Patient);
        }
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
        <Card className='max-w-[36rem] rounded-3xl relative mx-auto p-4 sm:p-6'>
          {
            isLoading ? <SkeletonCard /> : (
              <>
                <div className={cn('w-full h-[22rem] rounded-3xl absolute top-0 left-0 bg-gradient-to-b from-sky-500 to-indigo-500', currentUser?.id !== id && "to-indigo-400 from-cyan-400")} />
                <div className='mt-3 sm:mt-6 flex flex-col gap-6 items-center'>
                  <ProfileAvatar
                    src={user?.profileImageUrl || DEFAULT_AVATAR_URL}
                    className='size-40 border-primary-foreground border-4'
                  />
                  <div className='z-10 text-center text-primary-foreground'>
                    <p className='text-lg font-medium'>{user?.fullname}</p>
                    <p>{user?.email}</p>
                  </div>
                  <Card className='flex flex-col gap-3 w-full z-10 rounded-3xl'>
                    <ProfileInfo
                      label="Age"
                      value={user?.age}
                    />
                    <ProfileInfo
                      label="Gender"
                      value={user?.gender}
                    />
                    <ProfileInfo
                      label="IC"
                      value={user?.ic}
                    />
                    <ProfileInfo
                      label="Register Date"
                      value={formatDate(user?.createdDatetime)}
                    />
                    {
                      isDoctor && (
                        <>
                          <ProfileInfo
                            label="Registration Number"
                            value={(user as Doctor | null)?.doctorValidation?.registrationNumber}
                          />
                          <ProfileInfo
                            label="Number of Assigned Patient"
                            value={(user as Doctor | null)?.patientRecord.length}
                          />
                        </>
                      )
                    }
                    {
                      !isDoctor && (
                        <>
                          <ProfileInfo
                            label="Assigned Doctor"
                            value={(user as Patient | null)?.patientRecord ? `Dr. ${(user as Patient | null)?.patientRecord.doctor.fullname}` : "-"}
                            link={(user as Patient | null)?.patientRecord ? `/doctors/${(user as Patient | null)?.patientRecord.doctor.id}` : undefined}
                          />
                          <ProfileInfo
                            label="Assigned Exercises"
                            value={(user as Patient | null)?.patientExercise.length}
                          />
                        </>
                      )
                    }
                  </Card>
                  {
                    (currentUser?.id === id) && (
                      <div className='flex flex-col sm:flex-row gap-2 justify-between w-full'>
                        <DialogButton
                          title="Edit Profile"
                          variant='default'
                          className='w-full rounded-full'
                          content={
                            isDoctor ? <DoctorProfileForm profile={user as Doctor} /> :
                              <PatientProfileForm profile={user as Patient} />
                          }>Edit Profile</DialogButton>
                        <DialogButton
                          variant="destructive"
                          title="Delete Account"
                          className='w-full rounded-full'
                          content={
                            <div className="flex flex-col gap-6">
                              Are you sure want to delete this account?
                              <Button variant="destructive" onClick={handleClickDelete}>
                                Delete
                              </Button>
                            </div>
                          }>Delete Account</DialogButton>
                      </div>
                    )
                  }
                </div>
              </>
            )
          }
        </Card>
      }
    </div>
  )
}

export default ProfileComponent