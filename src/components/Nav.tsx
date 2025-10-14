"use client";

import { useEditorTab } from "@/hooks/useStore";
import { Tab } from "@/types/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Nav() {
  const pathname = usePathname();
  const pathSegments = pathname
    .split("/")
    .filter((segment: string) => segment !== "");
  const lastPathSegment = pathSegments[pathSegments.length - 1];

  const linkStyle =
    "px-6 py-3 cursor-pointer hover:bg-gray-800 hover:text-white rounded-lg";

  const tabs = [
    { id: "analysis", label: "Analyze" },
    { id: "railroad", label: "Visualize" },
    { id: "generator", label: "Generate" },
  ];

  const { setTab } = useEditorTab();
  let tab = useEditorTab().tab;

  useEffect(() => {
    if (typeof window !== "undefined") {
      tab = (localStorage.getItem("tab") as Tab) ?? useEditorTab().tab;
    }
  }, []);

  return (
    <nav className="flex gap-4">
      {tabs.map((t, idx) => (
        <Link
          key={idx}
          className={`${linkStyle} ${
            tab === t.id ? "bg-gray-800 text-white" : "text-gray-400"
          }`}
          href={`/`}
          onClick={() => {
            setTab(t.id as Tab);
          }}
        >
          {t.label}
        </Link>
      ))}
      <Link
        className={`${linkStyle} ${
          lastPathSegment === "specs"
            ? "bg-gray-800 text-white"
            : "text-gray-400"
        }`}
        href={`/specs`}
        onClick={() => {
          setTab("none" as Tab);
        }}
      >
        {"Specs"}
      </Link>
      {process.env.NODE_ENV === "development" ? (
        <Link
          className={`${linkStyle} ${
            tab === "debug" ? "bg-gray-800 text-white" : "text-gray-400"
          }`}
          href={`/`}
          onClick={() => {
            setTab("debug" as Tab);
          }}
        >
          {"Debug"}
        </Link>
      ) : null}
    </nav>
  );
}
