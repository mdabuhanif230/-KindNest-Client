"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Guard from "@/components/Guard";

export default function Profile() {
  const router = useRouter();
  const { data } = authClient.useSession();
  const user = data?.user;
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty.");
    if (image && !/^https?:\/\//.test(image)) return toast.error("Photo URL must start with http or https.");
    setBusy(true);
    const { error } = await authClient.updateUser({ name: name.trim(), image: image.trim() || undefined });
    setBusy(false);
    if (error) return toast.error(error.message || "Could not update your profile.");
    toast.success("Profile updated!");
    router.refresh();
  };

  return (
    <Guard>
      <div className="max-w-md mx-auto px-4 py-10">
        <h1 className="sec-title mb-6">Your profile</h1>
        <div className="flex items-center gap-4 mb-6">
          <img
            src={image || user?.image || `https://api.dicebear.com/9.x/initials/svg?seed=${user?.name || "u"}`}
            alt={user?.name || "profile"}
            className="w-20 h-20 rounded-full object-cover bg-base-200"
          />
          <div>
            <p className="font-bold text-lg">{user?.name}</p>
            <p className="text-sm opacity-70">{user?.email}</p>
          </div>
        </div>
        <form onSubmit={submit} className="grid gap-3">
          <input className="input w-full" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input w-full" placeholder="Photo URL" value={image} onChange={(e) => setImage(e.target.value)} />
          <button className="btn btn-primary" disabled={busy}>
            {busy ? <span className="loading loading-spinner" /> : "Save changes"}
          </button>
        </form>
      </div>
    </Guard>
  );
}
