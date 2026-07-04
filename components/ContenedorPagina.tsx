import { ReactNode } from "react";

interface ContenedorPaginaProps {
  children: ReactNode;
  titulo?: string;
  descripcion?: string;
  acciones?: ReactNode;
  breadcrumbs?: ReactNode;
}

export default function ContenedorPagina({
  children,
  titulo,
  descripcion,
  acciones,
  breadcrumbs,
}: ContenedorPaginaProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6 sm:py-8">

      <div className="w-full bg-background border-0 sm:border border-border sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm">

        {breadcrumbs && (
          <div className="mb-4">
            {breadcrumbs}
          </div>
        )}

        {(titulo || acciones) && (
          <div className="flex flex-col mb-8">

            <div className="flex flex-col items-center text-center">
              {titulo && (
                <h1 className="text-xl font-bold text-foreground tracking-wide uppercase">
                  {titulo}
                </h1>
              )}
              {descripcion && (
                <p className="text-md text-muted-foreground mt-1">
                  {descripcion}
                </p>
              )}
            </div>

            {acciones && (
              <div className="flex items-center justify-end w-full gap-2 mt-6 flex-wrap">
                {acciones}
              </div>
            )}

          </div>
        )}

        <div className="w-full flex flex-col gap-6">
          {children}
        </div>

      </div>

    </div>
  );
}
