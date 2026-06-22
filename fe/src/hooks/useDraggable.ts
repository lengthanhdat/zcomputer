import { useRef, MouseEvent } from 'react';

export function useDraggable<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: MouseEvent<T>) => {
    if (!ref.current) return;
    isDown.current = true;
    ref.current.classList.add('cursor-grabbing');
    ref.current.style.scrollBehavior = 'auto'; // Disable smooth scroll while dragging
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
  };

  const onMouseLeave = () => {
    if (!ref.current) return;
    isDown.current = false;
    ref.current.classList.remove('cursor-grabbing');
    ref.current.style.scrollBehavior = '';
  };

  const onMouseUp = () => {
    if (!ref.current) return;
    isDown.current = false;
    ref.current.classList.remove('cursor-grabbing');
    ref.current.style.scrollBehavior = '';
  };

  const onMouseMove = (e: MouseEvent<T>) => {
    if (!isDown.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll-fast factor
    ref.current.scrollLeft = scrollLeft.current - walk;
  };

  return {
    ref,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onMouseMove,
  };
}
