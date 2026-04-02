import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";



export default function DashboardNavbar() {
  return (
    <nav className="px-4 py-2 bg-white sm:flex sm:items-center sm:justify-between shadow-xl ring-1 ring-gray-900/5 relative z-10">
      <section className="flex justify-between">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary  bg-green-600">
          <span className="text-2xl font-extrabold text-primary-foreground text-white">
            F
          </span>
        </div>
        <Button variant="ghost" className="size-12 p-0 text-gray-700 sm:hidden">
          <Menu className="size-8" />
        </Button>
      </section>
      <div className="flex flex-col items-start mt-3 gap-2 sm:flex-row sm:m-0 sm:items-center">
        <Button className="text-gray-600 hover:bg-gray-200 w-full justify-start px-2 rounded hover:text-gray-900 sm:w-auto sm:justify-center">
          Inicio
        </Button>
        <Button className="text-gray-600 hover:bg-gray-200 w-full justify-start px-2 rounded hover:text-gray-900 sm:w-auto sm:justify-center">
          Catálogos
        </Button>
        <Button className="text-gray-600 hover:bg-gray-200 w-full justify-start px-2 rounded hover:text-gray-900 sm:w-auto sm:justify-center">
          Ventas
        </Button>
      </div>
    </nav>
  );
}
