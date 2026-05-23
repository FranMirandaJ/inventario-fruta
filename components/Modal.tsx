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
  sm: "max-w-[min(384px,100%)]",           // 384px
  md: "max-w-[min(448px,100%)]",           // 448px (Estándar)
  lg: "max-w-[min(512px,100%)]",           // 512px
  xl: "max-w-[min(576px,100%)]",           // 576px
  "2xl": "max-w-[min(672px,100%)]",        // 672px
  "3xl": "max-w-[min(768px,100%)]",        // 768px
  "4xl": "max-w-[min(896px,100%)]",        // 896px
  full: "max-w-[min(95vw,100%)]",          // Casi pantalla completa
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

      <DialogContent
        className={`flex flex-col max-h-[calc(100vh-12rem)] sm:max-h-[90vh] ${sizeClasses[size]} ${contentClassName}`}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >

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
