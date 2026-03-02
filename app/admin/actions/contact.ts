"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: Date;
  read: boolean;
};

export async function getContactMessages(): Promise<ContactMessageRow[]> {
  const rows = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone ?? undefined,
    message: r.message,
    createdAt: r.createdAt,
    read: r.read,
  }));
}

export async function toggleContactMessageRead(id: string) {
  const msg = await prisma.contactMessage.findUnique({ where: { id } });
  if (!msg) return;
  await prisma.contactMessage.update({
    where: { id },
    data: { read: !msg.read },
  });
  revalidatePath("/admin/formular");
}

export async function deleteContactMessage(id: string) {
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/formular");
}

// Pentru formularul public de contact (salvare mesaj)
export async function submitContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  await prisma.contactMessage.create({
    data: {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || null,
      message: data.message.trim(),
    },
  });
  revalidatePath("/admin/formular");
}
