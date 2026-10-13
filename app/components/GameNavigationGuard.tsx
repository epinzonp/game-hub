"use client";

import { Dialog } from "@base-ui/react/dialog";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  isPointEnabledGameRoute,
  shouldConfirmGameExit,
} from "@/lib/game-routes";

const GameNavigationContext = createContext<((href: string) => void) | null>(
  null,
);

export function useGameNavigation() {
  const navigate = useContext(GameNavigationContext);
  if (!navigate) throw new Error("GameNavigationGuard is missing.");
  return navigate;
}

export default function GameNavigationGuard({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [pendingBack, setPendingBack] = useState(false);
  const allowUnload = useRef(false);
  const allowBack = useRef(false);
  const inPointEnabledGame = pathname
    ? isPointEnabledGameRoute(pathname)
    : false;

  const requestNavigation = useCallback(
    (href: string) => {
      const destination = new URL(href, window.location.href);
      if (shouldConfirmGameExit(pathname ?? "", destination.pathname)) {
        setPendingBack(false);
        setPendingHref(
          destination.origin === window.location.origin
            ? `${destination.pathname}${destination.search}${destination.hash}`
            : destination.href,
        );
      } else if (destination.origin === window.location.origin) {
        router.push(
          `${destination.pathname}${destination.search}${destination.hash}`,
        );
      } else {
        window.location.assign(destination.href);
      }
    },
    [pathname, router],
  );

  useEffect(() => {
    if (!inPointEnabledGame || !pathname) return;

    const gameUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const gameHistoryState = window.history.state;
    const interceptLink = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }
      const anchor = event.target.closest("a[href]");
      if (
        !(anchor instanceof HTMLAnchorElement) ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      )
        return;

      const destination = new URL(anchor.href, window.location.href);
      if (!/^https?:$/.test(destination.protocol)) return;
      if (!shouldConfirmGameExit(pathname, destination.pathname)) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      setPendingBack(false);
      setPendingHref(
        destination.origin === window.location.origin
          ? `${destination.pathname}${destination.search}${destination.hash}`
          : destination.href,
      );
    };

    const interceptHistory = (event: PopStateEvent) => {
      if (allowBack.current) {
        allowBack.current = false;
        return;
      }
      const destination = new URL(window.location.href);
      const destinationPath =
        destination.origin === window.location.origin
          ? destination.pathname
          : "/";
      if (!shouldConfirmGameExit(pathname, destinationPath)) return;

      event.stopImmediatePropagation();
      window.history.pushState(gameHistoryState, "", gameUrl);
      setPendingBack(true);
      setPendingHref(
        destination.origin === window.location.origin
          ? `${destination.pathname}${destination.search}${destination.hash}`
          : destination.href,
      );
    };

    const confirmBeforeUnload = (event: BeforeUnloadEvent) => {
      if (allowUnload.current) return;
      event.preventDefault();
      event.returnValue = "";
    };

    document.addEventListener("click", interceptLink, true);
    window.addEventListener("popstate", interceptHistory, true);
    window.addEventListener("beforeunload", confirmBeforeUnload);
    return () => {
      document.removeEventListener("click", interceptLink, true);
      window.removeEventListener("popstate", interceptHistory, true);
      window.removeEventListener("beforeunload", confirmBeforeUnload);
    };
  }, [inPointEnabledGame, pathname]);

  const confirmNavigation = () => {
    if (!pendingHref) return;
    if (pendingBack) {
      setPendingHref(null);
      setPendingBack(false);
      allowBack.current = true;
      window.history.back();
      return;
    }
    const destination = new URL(pendingHref, window.location.href);
    setPendingHref(null);
    setPendingBack(false);
    if (destination.origin === window.location.origin) {
      router.replace(
        `${destination.pathname}${destination.search}${destination.hash}`,
      );
    } else {
      allowUnload.current = true;
      window.location.assign(destination.href);
    }
  };

  return (
    <GameNavigationContext.Provider value={requestNavigation}>
      {children}
      <Dialog.Root
        open={pendingHref !== null}
        disablePointerDismissal
        onOpenChange={(open) => {
          if (!open) {
            setPendingHref(null);
            setPendingBack(false);
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-[1001] bg-[#10090d]/85 backdrop-blur-sm" />
          <Dialog.Popup className="fixed left-1/2 top-1/2 z-[1002] w-[calc(100%_-_2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/15 bg-[#241519] p-6 text-center text-white shadow-2xl sm:p-8">
            <Dialog.Title className="text-2xl font-black">
              ¿Salir de la partida?
            </Dialog.Title>
            <Dialog.Description className="mt-3 leading-6 text-rose-100/75">
              Si la partida sigue en curso, al salir se perderán sus puntos.
              Solo guardamos el resultado al terminarla.
            </Dialog.Description>
            <div className="mt-6 flex flex-col-reverse justify-center gap-3 sm:flex-row">
              <Dialog.Close className="min-h-12 rounded-xl border border-white/15 px-5 font-bold transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#fff34b]">
                Seguir jugando
              </Dialog.Close>
              <button
                type="button"
                onClick={confirmNavigation}
                className="min-h-12 rounded-xl bg-[#fff34b] px-5 font-black text-[#180e13] transition hover:bg-[#fff877] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Salir y perder puntos
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </GameNavigationContext.Provider>
  );
}
