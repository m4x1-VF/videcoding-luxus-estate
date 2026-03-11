"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";
import { toast } from "sonner";

interface Props {
  propertyId: string;
  isActive: boolean;
}

export default function AdminPropertyActions({ propertyId, isActive }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleStatus = async () => {
    toast(`¿Seguro que quieres ${isActive ? "desactivar" : "activar"} esta propiedad?`, {
      icon: <span className="material-icons text-xl mr-2 text-white">warning</span>,
      action: {
        label: 'Confirmar',
        onClick: async () => {
          setIsUpdating(true);
          try {
            const { error } = await supabase
              .from("properties")
              .update({ is_active: !isActive })
              .eq("id", propertyId);

            if (error) throw error;
            
            toast.success(`Propiedad ${isActive ? "desactivada" : "activada"} con éxito`);
            router.refresh();
          } catch (error: any) {
            console.error("Error updating property status:", error.message || error);
            toast.error(`Error: ${error.message || "Unknown error"}`);
          } finally {
            setIsUpdating(false);
          }
        }
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => {}
      }
    });
  };

  return (
    <button
      disabled={isUpdating}
      onClick={toggleStatus}
      className={`p-2 rounded-lg transition-all tooltip-trigger ${
        isActive
          ? "text-gray-400 hover:text-red-600 hover:bg-red-50"
          : "text-gray-400 hover:text-green-600 hover:bg-green-50"
      }`}
      title={isActive ? "Deactivate Property" : "Activate Property"}
    >
      <span className="material-icons text-xl">
        {isUpdating ? "hourglass_empty" : isActive ? "visibility_off" : "visibility"}
      </span>
    </button>
  );
}
