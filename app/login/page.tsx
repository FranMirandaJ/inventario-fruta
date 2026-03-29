import LoginForm from "./LoginForm";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 bg-gray-100">

      {/* MARCA */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 bg-green-600">
          <span className="text-2xl font-extrabold text-primary-foreground text-white">
            F
          </span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">FrutaStock</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona tu inventario de productos de fruta congelados
          </p>
        </div>
      </div>

      {/* TARJETA */}
      <Card className="w-full max-w-sm bg-white">
        <CardHeader className="">
          <CardTitle className="text-center">Iniciar sesión</CardTitle>
          <CardDescription className="text-center">Introduce tus datos para continuar</CardDescription>
        </CardHeader>
        <LoginForm />
      </Card>

    </div>
  );
}
