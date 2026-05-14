import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export default function KanbanBoard({ tasks, onStatusChange, onTaskClick }) {
  const grouped = COLUMNS.reduce((acc, c) => {
    acc[c.id] = tasks.filter((t) => t.status === c.id);
    return acc;
  }, {});

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    onStatusChange?.(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => (
          <Droppable droppableId={col.id} key={col.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`rounded-2xl border border-slate-200 bg-slate-100/60 p-3 dark:border-slate-800 dark:bg-slate-900/60 ${
                  snapshot.isDraggingOver ? 'ring-2 ring-brand-500/40' : ''
                }`}
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                    {col.title}
                  </h3>
                  <span className="badge bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                    {grouped[col.id].length}
                  </span>
                </div>
                <div className="space-y-2 min-h-[100px]">
                  {grouped[col.id].map((task, idx) => (
                    <Draggable draggableId={task._id} index={idx} key={task._id}>
                      {(p) => (
                        <div
                          ref={p.innerRef}
                          {...p.draggableProps}
                          {...p.dragHandleProps}
                        >
                          <TaskCard task={task} onClick={() => onTaskClick?.(task)} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
