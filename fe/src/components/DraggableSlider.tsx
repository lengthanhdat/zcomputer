"use client";

import { useRef, MouseEvent, ReactNode } from "react";

export default function DraggableSlider({ children, id, className }: { children: ReactNode, id?: string, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const dragged = useRef(false);

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    isDown.current = true;
    dragged.current = false;
    ref.current.classList.add('cursor-grabbing');
    ref.current.classList.remove('snap-x', 'snap-mandatory'); // Disable snapping during drag
    ref.current.style.scrollBehavior = 'auto'; // Disable smooth scroll while dragging
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
  };

  const onMouseLeave = () => {
    if (!ref.current) return;
    isDown.current = false;
    ref.current.classList.remove('cursor-grabbing');
    ref.current.classList.add('snap-x', 'snap-mandatory');
    ref.current.style.scrollBehavior = '';
  };

  const onMouseUp = () => {
    if (!ref.current) return;
    isDown.current = false;
    ref.current.classList.remove('cursor-grabbing');
    ref.current.classList.add('snap-x', 'snap-mandatory');
    ref.current.style.scrollBehavior = '';
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDown.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll-fast factor
    if (Math.abs(walk) > 5) {
      dragged.current = true;
    }
    ref.current.scrollLeft = scrollLeft.current - walk;
  };

  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (dragged.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div
      id={id}
      ref={ref}
      className={className}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onClickCapture={onClickCapture}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}
