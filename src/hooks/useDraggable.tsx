
import { useState } from "react";

interface DraggableProps<T> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
}

export function useDraggable<T>({ items, setItems }: DraggableProps<T>) {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [draggedOverItem, setDraggedOverItem] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLElement>, index: number) => {
    // Add a ghost image that's a copy of the dragged element
    const draggedElement = e.currentTarget.cloneNode(true) as HTMLElement;
    draggedElement.style.opacity = '0.5';
    draggedElement.style.position = 'absolute';
    draggedElement.style.top = '-1000px';
    document.body.appendChild(draggedElement);
    e.dataTransfer.setDragImage(draggedElement, 0, 0);
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(draggedElement);
    }, 0);
    
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;
    setDraggedOverItem(index);
  };

  const handleDragEnd = () => {
    if (draggedItem !== null && draggedOverItem !== null) {
      const newItems = [...items];
      const [removed] = newItems.splice(draggedItem, 1);
      newItems.splice(draggedOverItem, 0, removed);
      setItems(newItems);
    }
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  return {
    draggedItem,
    draggedOverItem,
    handleDragStart,
    handleDragEnter,
    handleDragEnd
  };
}
