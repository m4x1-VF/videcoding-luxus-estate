"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";
import { useTranslations } from "../i18n";
import LanguageSelector from "./LanguageSelector";
import { User } from "@supabase/supabase-js";

export default function AdminNavbar() {
  const { t } = useTranslations();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <Link href="/admin/properties" className="flex-shrink-0 flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
              <div className="w-8 h-8 rounded-lg bg-mosque/20 flex items-center justify-center">
                <span className="material-icons text-mosque text-lg">admin_panel_settings</span>
              </div>
              <span className="text-xl font-semibold tracking-tight text-nordic-dark">LuxeEstate <span className="text-mosque font-normal">Admin</span></span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            <div className="flex items-center space-x-6">
              <Link href="/">
                <div className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-nordic-dark/70 hover:text-mosque transition-colors cursor-pointer mr-2">
                  <span className="material-icons text-[18px]">public</span>
                  View Site
                </div>
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 ml-2">
                {user && (
                  <>
                    <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all relative">
                      <Image 
                        alt="Profile" 
                        className="object-cover" 
                        src={user.user_metadata?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCAWhQZ663Bd08kmzjbOPmUk4UIxYooNONShMEFXLR-DtmVi6Oz-TiaY77SPwFk7g0OobkeZEOMvt6v29mSOD0Xm2g95WbBG3ZjWXmiABOUwGU0LOySRfVDo-JTXQ0-gtwjWxbmue0qDm91m-zEOEZwAW6iRFB1qC1bAU-wkjxm67Sbztq8w7srHkFT9bVEC86qG-FzhOBTomhAurNRmx9l8Yfqabk328NfdKuVLckgCdaPsNFE3yN65MeoRi05GA_gXIMwG4YDIeA"}
                        fill
                        sizes="36px"
                      />
                    </div>
                    <button 
                      onClick={async () => {
                        await supabase.auth.signOut();
                        setUser(null);
                        window.location.href = '/login';
                      }}
                      className="p-2 text-nordic-dark/60 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-all duration-200 cursor-pointer"
                      title={t.nav.signOut}
                    >
                      <span className="material-icons text-[22px]">logout</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
