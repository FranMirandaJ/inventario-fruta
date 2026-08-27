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
import BotonPermiso from "./BotonPermiso";
import { ReactNode } from "react";
import Image from "next/image";
import type { Permiso } from "@/lib/permisos";

export type ModalProps = {
  showTriggerButton?: boolean;
  textTriggerButton?: string;
  iconTriggerButton?: ReactNode;
  triggerButtonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  triggerButtonPermiso?: Permiso;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  headerImgSrc?: string; 
  headerImgAlt?: string; 
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";
  fixedLayout?: boolean;
  contentClassName?: string;
};

const sizeClasses = {
  xs: "max-w-[min(280px,100%)] sm:max-w-[280px]",           // 280px
  sm: "max-w-[min(384px,100%)] sm:max-w-[384px]",           // 384px
  md: "max-w-[min(448px,100%)] sm:max-w-[448px]",           // 448px (Estándar)
  lg: "max-w-[min(512px,100%)] sm:max-w-[512px]",           // 512px
  xl: "max-w-[min(576px,100%)] sm:max-w-[576px]",           // 576px
  "2xl": "max-w-[min(672px,100%)] sm:max-w-[672px]",        // 672px
  "3xl": "max-w-[min(768px,100%)] sm:max-w-[768px]",        // 768px
  "4xl": "max-w-[min(896px,100%)] sm:max-w-[896px]",        // 896px
  full: "max-w-[min(95vw,100%)] sm:max-w-[95vw]",          // Casi pantalla completa
};

export default function Modal({
  showTriggerButton = true,
  textTriggerButton,
  iconTriggerButton,
  triggerButtonVariant = 'outline',
  triggerButtonPermiso,
  title,
  description,
  children,
  footer,
  headerImgSrc,
  headerImgAlt = "Ilustración del modal",
  open,
  onOpenChange,
  size = "md",
  fixedLayout = false,
  contentClassName = "", // Clases extra por defecto (vacío)
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      {showTriggerButton && (
        <DialogTrigger asChild>
          {triggerButtonPermiso ? (
            <BotonPermiso
              permiso={triggerButtonPermiso}
              variant={triggerButtonVariant}
              className="gap-2"
            >
              {iconTriggerButton}
              {textTriggerButton}
            </BotonPermiso>
          ) : (
            <Button variant={triggerButtonVariant} className="gap-2">
              {iconTriggerButton}
              {textTriggerButton}
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent
        className={`${
          fixedLayout
            ? "flex flex-col"
            : "overflow-y-auto"
        } max-h-[calc(100vh-12rem)] sm:max-h-[90vh] ${sizeClasses[size]} ${contentClassName}`}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          const content = e.currentTarget as HTMLElement | null;
          content
            ?.querySelector<HTMLElement>("[data-slot='dialog-title']")
            ?.focus();
        }}
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
          <div
            className={`py-4 px-1 ${fixedLayout ? "overflow-y-auto" : ""}`}
            style={fixedLayout ? { overflow: "hidden auto" } : undefined}
          >
            {children}
          </div>
        )}

        {footer && (
          <DialogFooter className={fixedLayout ? "shrink-0" : ""}>
            {footer}
          </DialogFooter>
        )}

      </DialogContent>
    </Dialog>
  );
}
