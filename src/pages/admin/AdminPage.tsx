import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getAllDoctorsStatus, updateDoctorsStatus } from '@/services/admin.service';
import ProfileAvatar from '@/components/ProfileAvatar';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import { Doctor} from '@/interfaces/user';
import { DoctorRegistrationStatus } from '@/enums';
import { Button } from '@/components/ui/button';
import OptionTemplateManager from './components/OptionTemplateManager';

const DoctorStatusSchema = z.object({
  doctorId: z.string(),
  status: z.nativeEnum(DoctorRegistrationStatus),
});

type DoctorStatusFormValues = z.infer<typeof DoctorStatusSchema>;

const AdminPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const { register, handleSubmit, reset } = useForm<DoctorStatusFormValues>({
    resolver: zodResolver(DoctorStatusSchema),
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctorsStatus();
        setDoctors(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchDoctors();
  }, []);

  const handleStatusChange = async (data: DoctorStatusFormValues) => {
    try {
      await updateDoctorsStatus(data);
      toast({
        title: "Status Updated",
        variant: "success"
      });
      // Refresh the list of doctors
      const updatedDoctors = await getAllDoctorsStatus();
      setDoctors(updatedDoctors);
    } catch (e) {
      console.error(e);
      toast({
        title: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  return (
    <>
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin - Doctor Registration</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profile</TableHead>
            <TableHead>Fullname</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Registration Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell>
                <ProfileAvatar src={doctor.profileImageUrl ?? undefined} fallbackText={doctor.fullname.charAt(0)} />
              </TableCell>
              <TableCell>{doctor.fullname}</TableCell>
              <TableCell>{doctor.email}</TableCell>
              <TableCell>{doctor.age}</TableCell>
              <TableCell>{doctor.doctorValidation?.registrationNumber}</TableCell>
              <TableCell>
                <Badge variant={
                  doctor.doctorRegistrationStatus === 'REJECTED' ? 'destructive' :
                  doctor.doctorRegistrationStatus === 'APPROVED' ? 'default' :
                  'secondary'
                }>
                  {doctor.doctorRegistrationStatus ?? '-'}
                </Badge>
              </TableCell>
              <TableCell>{new Date(doctor.createdDatetime).toLocaleDateString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button size="sm" variant="secondary">Change Status</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => handleStatusChange({ doctorId: doctor.id, status: DoctorRegistrationStatus.PENDING })}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleStatusChange({ doctorId: doctor.id, status: DoctorRegistrationStatus.APPROVED })}>
                      Approved
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleStatusChange({ doctorId: doctor.id, status: DoctorRegistrationStatus.REJECTED })}>
                      Rejected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
    </Card>
    <OptionTemplateManager />
    </>
  );
};

export default AdminPage;