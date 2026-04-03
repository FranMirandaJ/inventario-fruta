import Link from "next/link";
import { LifeBuoy, FileText } from "lucide-react";

export default function DashboardFooter() {
  return (
    <footer className="bg-green-600 border-t border-green-700 mt-auto">
      <div className="px-4 py-4 sm:flex sm:items-center sm:justify-between">
        
        <div className="flex justify-center sm:justify-start">
          <p className="text-sm text-green-50">
            © 2026 FrutaStock.
          </p>
        </div>

        <div className="mt-4 flex justify-center gap-6 sm:mt-0 sm:items-center">
          <Link 
            href="#" 
            className="flex items-center text-sm text-green-100 hover:text-white transition-colors"
          >
            <LifeBuoy className="mr-1.5 size-4" />
            Soporte
          </Link>
          
          <Link 
            href="#" 
            className="flex items-center text-sm text-green-100 hover:text-white transition-colors"
          >
            <FileText className="mr-1.5 size-4" />
            Manual de Usuario
          </Link>

          <span className="hidden sm:inline-block text-xs font-mono text-green-100 bg-green-700 px-2 py-1 rounded-md ml-2">
            v0.0.1
          </span>
        </div>

      </div>
    </footer>
  );
}