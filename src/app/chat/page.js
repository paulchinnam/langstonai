"use client";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../hooks/useFirebase";
import Chat from "../components/Chat";

export default function Page() {
  return (
    <>
      <Chat />
    </>
  );
}
