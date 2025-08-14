import { createPortal } from "react-dom";
import { type ReactNode, useEffect, useRef } from "react";

interface Props {
  children: ReactNode;
  position: { x: number; y: number };
}

export const SubmenuPortal = ({ children, position }: Props) => {
  const portalRef = useRef<HTMLDivElement>(document.createElement("div"));

  useEffect(() => {
    const node = portalRef.current;
    node.className = "submenu-wrapper";
    document.body.appendChild(node);
    return () => {
      document.body.removeChild(node);
    };
  }, []);

  return createPortal(
    <div className="submenu-content" style={{ top: position.y, left: position.x, position: "absolute" }}>
      {children}
    </div>,
    portalRef.current
  );
};
