"use client";

import Nav from "./Nav";

function Sides({ classNames }: { classNames?: string }) {
  return (
    <div className={classNames}>
      <h1 className="text-3xl">{"KV Meta Sintaxis"}</h1>
      {/* <picture>
            <img src="./globe.svg" alt="KV Meta Sintaxis" />
          </picture> */}
    </div>
  );
}

export default function Header() {
  return (
    <header className="flex h-20 flex-row items-center justify-between">
      <Sides></Sides>
      <Nav></Nav>
      <Sides classNames="opacity-0 select-none"></Sides>
    </header>
  );
}
