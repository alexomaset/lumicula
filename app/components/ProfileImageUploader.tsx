import React, { useRef } from "react";
import { Button } from "./ui/Button";
import { Image as ImageIcon, X } from "lucide-react";

interface ProfileImageUploaderProps {
  profileImage?:  string | File | null | undefined;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  profileImage,
  onUpload,
  onRemove,
}) => {
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  const handleProfileImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const getImageUrl = (file?: File) => {
    return file ? URL.createObjectURL(file) : undefined;
  };

  return (
    <div className="flex items-center space-x-4 mb-4">
      <div>
        {profileImage ? (
          <div className="relative">
            <img
              src={getImageUrl(profileImage)}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-0 right-0 rounded-full"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => profileImageInputRef.current?.click()}
          >
            <ImageIcon className="mr-2 h-4 w-4" /> Upload Profile Image
          </Button>
        )}
        <input
          type="file"
          ref={profileImageInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleProfileImageUpload}
        />
      </div>
    </div>
  );
};
