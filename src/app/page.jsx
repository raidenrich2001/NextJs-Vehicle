'use client';
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      return;
    }

    if (session.status === 'unauthenticated') {
      if(window.location.pathname === '/')
      {router.push("/login");}
    }

    if (session.status === 'authenticated') {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className='flex justify-center'>
        <BeatLoader color="#3b82f6" />
      </div>
    );
  }
}
