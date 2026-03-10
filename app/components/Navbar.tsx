"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";
import { useTranslations } from "../i18n";
import LanguageSelector from "./LanguageSelector";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
  const { t } = useTranslations();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single();
        setIsAdmin(data?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
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
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
            <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center">
              <span className="material-icons text-white text-lg">apartment</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-nordic-dark">LuxeEstate</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1" href="#">{t.nav.buy}</a>
            <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{t.nav.rent}</a>
            <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{t.nav.sell}</a>
            <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{t.nav.savedHomes}</a>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            <div className="flex items-center space-x-6">
              <button className="text-nordic-dark hover:text-mosque transition-colors">
                <span className="material-icons">search</span>
              </button>
              <button className="text-nordic-dark hover:text-mosque transition-colors relative">
                <span className="material-icons">notifications_none</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light"></span>
              </button>
              <div className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 ml-2">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link href="/admin/properties">
                        <div className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-mosque bg-mosque/10 rounded-xl hover:bg-mosque/20 transition-all duration-200 cursor-pointer mr-2 border border-mosque/20">
                          <span className="material-icons text-[18px]">admin_panel_settings</span>
                          Admin
                        </div>
                      </Link>
                    )}
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
                      }}
                      className="p-2 text-nordic-dark/60 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-all duration-200 cursor-pointer"
                      title={t.nav.signOut}
                    >
                      <span className="material-icons text-[22px]">logout</span>
                    </button>
                  </>
                ) : (
                  <Link href="/login">
                    <div className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-nordic-dark rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                      <span className="material-icons text-[18px]">login</span>
                      {t.nav.signIn}
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden border-t border-nordic-dark/5 bg-background-light overflow-hidden h-0 transition-all duration-300">
        <div className="px-4 py-2 space-y-1">
          <a className="block px-3 py-2 rounded-md text-base font-medium text-mosque bg-mosque/10" href="#">{t.nav.buy}</a>
          <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t.nav.rent}</a>
          <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t.nav.sell}</a>
          <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t.nav.savedHomes}</a>
        </div>
      </div>
    </nav>
  );
}

