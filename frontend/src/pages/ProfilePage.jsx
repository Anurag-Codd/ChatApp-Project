import { useState } from "react";
import { authStore } from "../store/authStore";
import { Camera, Mail, User, Pencil, Check ,X} from "lucide-react";

function ProfilePage() {
  const { user, updateProfile, updateStatus, isLoading } = authStore();
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(user?.status);
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePicture: base64Image });
    };
  };

  const handleEditStatus = async () => {
    await updateStatus({ status });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-200 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="md:w-1/3 flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedImg || user?.avatar || "/avatar.png"}
                  alt="Profile"
                  className="w-32 h-32 rounded-lg object-cover"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-0 right-0 
                    bg-base-content hover:scale-105
                    p-2 rounded-2xl cursor-pointer 
                    transition-all duration-200
                    ${isLoading ? "animate-pulse pointer-events-none" : ""}
                  `}
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isLoading}
                  />
                </label>
              </div>
              <p className="text-xs text-primary">
                {isLoading ? "Uploading..." : ""}
              </p>
            </div>

            <div className="md:w-2/3 flex flex-col items-start gap-2">
              <div className="relative w-full flex flex-col items-start">
                <h3 className="text-lg font-bold">Status</h3>
                <div className="border-2 border-base-300 rounded-lg w-full h-24 relative">
                  {isEditing ? (
                    <textarea
                      type="text"
                      className="w-full h-full p-2 outline-none resize-none rounded-md"
                      placeholder={status}
                      onChange={(e) => setStatus(e.target.value)}
                    />
                  ) : (
                    <p className="w-full h-full p-2">{user?.status}</p>
                  )}
                  {isEditing ? (
                    <>
                    <button
                      className="absolute bottom-0 right-10 bg-error hover:scale-105 text-white font-bold p-2 py-1 rounded-md transition-all duration-200"
                      onClick={() => setIsEditing(false)}
                    >
                      <X  className="size-4" />
                    </button>
                    <button
                      className="absolute bottom-0 right-0 bg-success hover:scale-105 text-white font-bold p-2 py-1 rounded-md transition-all duration-200"
                      onClick={handleEditStatus}
                    >
                      <Check className="size-4" />
                    </button></>
                  ) : (
                    <button
                      className="absolute bottom-0 right-0 bg-base-content hover:scale-105 text-white font-bold p-2 py-1 rounded-md transition-all duration-200"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {user?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{user?.createdAt.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
