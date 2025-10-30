import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Eye, EyeOff } from "lucide-react";

const sectionNames = {
  summary: "Professional Summary",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  projects: "Projects",
  languages: "Languages",
};

export default function SectionManager({
  sections,
  sectionsVisible,
  onReorder,
  onToggleVisibility,
}) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    onReorder(result);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
            {sections.map((section, index) => (
              <Draggable key={section} draggableId={section} index={index}>
                {(dragProvided, snapshot) => (
                  <Card
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    className={`p-3 ${snapshot.isDragging ? "shadow-lg" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          {...dragProvided.dragHandleProps}
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="font-medium text-gray-700">
                          {sectionNames[section] || section}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {sectionsVisible[section] ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                        <Switch
                          checked={sectionsVisible[section]}
                          onCheckedChange={() => onToggleVisibility(section)}
                        />
                      </div>
                    </div>
                  </Card>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
