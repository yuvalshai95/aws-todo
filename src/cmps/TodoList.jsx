// Cmps
import { TodoPreview } from "./TodoPreview"

export function TodoList({ todos, onToggleTodo, onRemoveTodo, onEditTodo }) {

    if (!todos.length) return <p className="todo-list-empty">No todos available</p>
    return (
        <section className="todo-list">
            {todos.length > 0 && (
                todos.map(todo => (
                    <TodoPreview
                        key={todo.id}
                        todo={todo}
                        onToggleTodo={onToggleTodo}
                        onRemoveTodo={onRemoveTodo}
                        onEditTodo={onEditTodo}
                    />
                ))
            )}
        </section>
    )
}