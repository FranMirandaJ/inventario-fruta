"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ReactNode } from "react";
import Image from "next/image";

export type ModalProps = {
  showTriggerButton?: boolean;
  textTriggerButton?: string;
  iconTriggerButton?: ReactNode;
  triggerButtonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  headerImgSrc?: string; 
  headerImgAlt?: string; 
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";
  contentClassName?: string;
};

const sizeClasses = {
  sm: "sm:max-w-sm",           // 384px
  md: "sm:max-w-md",           // 448px (Estándar)
  lg: "sm:max-w-lg",           // 512px
  xl: "sm:max-w-xl",           // 576px
  "2xl": "sm:max-w-2xl",       // 672px
  "3xl": "sm:max-w-3xl",       // 768px
  "4xl": "sm:max-w-4xl",       // 896px
  full: "sm:max-w-[95vw]",     // Casi pantalla completa
};

export default function Modal({
  showTriggerButton = true,
  textTriggerButton,
  iconTriggerButton,
  triggerButtonVariant = 'outline',
  title,
  description,
  children,
  footer,
  headerImgSrc,
  headerImgAlt = "Ilustración del modal",
  open,
  onOpenChange,
  size = "md",
  contentClassName = "", // Clases extra por defecto (vacío)
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      {showTriggerButton && (
        <DialogTrigger asChild>
          <Button variant={triggerButtonVariant} className="gap-2">
            {iconTriggerButton}
            {textTriggerButton}
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className={`flex flex-col max-h-[90vh] ${sizeClasses[size]} ${contentClassName}`}>

        <DialogHeader className="flex flex-col sm:items-start gap-2">
          {headerImgSrc && (
            <div className="relative w-12 h-12 mb-2">
              <Image 
                src={headerImgSrc} 
                alt={headerImgAlt}
                fill
                className="object-contain"
              />
            </div>
          )}

          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children && (
          <div className="py-4 overflow-y-auto px-1" style={{ overflow: "hidden auto" }}>
            {children}
          </div>
        )}

        {footer && (
          <DialogFooter>
            {footer}
          </DialogFooter>
        )}

      </DialogContent>
    </Dialog>
  );
}
