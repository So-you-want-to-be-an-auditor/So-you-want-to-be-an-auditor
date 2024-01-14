import React from "react";
import { Draggable } from "react-beautiful-dnd";

const Drag = ({ answer, index }) => {
  return (
    <Draggable key={answer.id} draggableId={answer.id} index={index}>
      {(provided, snapshot) => (
        <>
          {/* Original item in the list */}
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              userSelect: "none",
              padding: 8,
              margin: "0 0 4px 0",
              backgroundColor: "white",
              border: "1px solid lightgray",
              ...provided.draggableProps.style,
              zIndex: 1000,
              textAlign: "left",
            }}
            className="text-black form-font text-sm"
          >
            {answer.content}
          </div>

          {snapshot.isDragging && (
            // Render a copy of the item being dragged
            <div
              style={{
                position: "fixed",
                top: provided.draggableProps.style.clientY,
                left: provided.draggableProps.style.clientX,
                padding: 8,
                backgroundColor: "white",
                border: "1px solid lightgray",
                ...provided.draggableProps.style,
                zIndex: 1000,
                textAlign: "left",
              }}
              className="text-black form-font text-sm"
            >
              {answer.content}
            </div>
          )}
        </>
      )}
    </Draggable>
  );
};

export default Drag;
