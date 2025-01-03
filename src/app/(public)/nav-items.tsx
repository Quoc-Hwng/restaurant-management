"use client";

import { useAppContext } from "@/components/app-provider";
import Link from "next/link";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu", //authRequired = undefined : đăng nhập hay chưa vẫn hiển thị
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    authRequired: true,
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false, //Hiển thị khi chưa đăng nhập
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true, //Hiển thị khi đã đăng nhập
  },
];

export default function NavItems({ className }: { className?: string }) {
  const { isAuth } = useAppContext();
  return menuItems.map((item) => {
    if (
      (item.authRequired === false && isAuth) ||
      (item.authRequired === true && !isAuth)
    )
      return null;
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
