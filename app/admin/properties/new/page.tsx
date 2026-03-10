import AdminPropertyForm from "@/app/components/AdminPropertyForm";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Property | LuxeEstate Admin",
  description: "Create a new property listing",
};

export default function NewPropertyPage() {
  return (
    <div className="flex-grow w-full py-10 px-4 sm:px-6 lg:px-8 bg-background-light font-display min-h-[calc(100vh-200px)]">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8 font-sf">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
              <li><Link className="hover:text-mosque transition-colors" href="/admin/properties">Properties</Link></li>
              <li><span className="material-icons text-xs text-gray-400">chevron_right</span></li>
              <li aria-current="page" className="text-nordic-dark">Add New</li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-nordic-dark tracking-tight mb-2 font-display">Add New Property</h1>
            <p className="text-base text-gray-500 max-w-2xl font-normal">
              Fill in the details below to create a new listing. Fields marked with * are mandatory.
            </p>
          </div>
        </div>
      </header>
      
      <AdminPropertyForm />
    </div>
  );
}
