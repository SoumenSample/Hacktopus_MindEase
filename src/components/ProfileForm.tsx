import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  profile: any;
  setProfile: (p: any) => void;
  avatarFile: File | null;
  setAvatarFile: (f: File | null) => void;
  onSave: () => void;
};

const ProfileForm = ({
  profile,
  setProfile,
  avatarFile,
  setAvatarFile,
  onSave
}: Props) => (
  <div className="space-y-4 mt-4">
    <Input
      placeholder="Name"
      value={profile.username}
      onChange={(e) =>
        setProfile({ ...profile, username: e.target.value })
      }
    />
    <Input
      placeholder="Age"
      value={profile.age}
      onChange={(e) => setProfile({ ...profile, age: e.target.value })}
    />
    <Input
      placeholder="Height (cm)"
      value={profile.height}
      onChange={(e) => setProfile({ ...profile, height: e.target.value })}
    />

    <Input
      type="file"
      accept="image/*"
      onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
    />
    {avatarFile && (
      <img
        src={URL.createObjectURL(avatarFile)}
        className="w-20 h-20 rounded-full object-cover"
      />
    )}

    <Button onClick={onSave}>Save</Button>
  </div>
);

export default ProfileForm;
