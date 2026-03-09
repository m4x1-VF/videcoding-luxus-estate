import Navbar from "../components/Navbar";

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-[16/10] bg-gray-200 rounded-xl"></div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              <div className="flex-none w-48 aspect-[4/3] bg-gray-200 rounded-lg"></div>
              <div className="flex-none w-48 aspect-[4/3] bg-gray-200 rounded-lg"></div>
              <div className="flex-none w-48 aspect-[4/3] bg-gray-200 rounded-lg"></div>
              <div className="flex-none w-48 aspect-[4/3] bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          
          <div className="lg:col-span-4 relative space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-mosque/5 space-y-6">
               <div className="h-10 bg-gray-200 rounded w-1/2"></div>
               <div className="h-4 bg-gray-200 rounded w-2/3"></div>
               <div className="h-px bg-slate-100 my-6"></div>
               <div className="flex items-center gap-4 mb-6">
                   <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                   <div className="space-y-2 flex-grow">
                       <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                       <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                   </div>
               </div>
               <div className="space-y-3">
                   <div className="h-14 bg-gray-200 rounded-lg w-full"></div>
                   <div className="h-14 bg-gray-200 rounded-lg w-full"></div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
