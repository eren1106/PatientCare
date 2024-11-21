'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DEFAULT_AVATAR_URL } from '@/constants';
import { Pencil } from 'lucide-react';
import React, { useState, useRef } from 'react';
import ProfileAvatar from './ProfileAvatar';

interface ProfilePictureUploaderProps {
  onChange: (file: File) => void;
  defaultImageUrl?: string;
}

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({ onChange, defaultImageUrl=DEFAULT_AVATAR_URL }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // const fileUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    // onChange(fileUrl);  // Pass the URL to the form
    onChange(file);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-min flex flex-col items-center gap-3 relative">
      <ProfileAvatar
        src={selectedFile ? URL.createObjectURL(selectedFile) : defaultImageUrl}
        alt="profile pic"
        className="size-28"
      />
      <Input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      <Button
        onClick={handleButtonClick}
        size="icon"
        className='rounded-full size-8 absolute bottom-0 right-0 border border-background'
      >
        <Pencil size={18} />
      </Button>
    </div>
  );
};

export default ProfilePictureUploader;
