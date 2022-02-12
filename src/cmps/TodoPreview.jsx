import React, { useState } from 'react';

// Icons
import { FaTrash } from 'react-icons/fa'

export function TodoPreview({ todo, onToggleTodo, onRemoveTodo, onEditTodo }) {
    const [txt, setTxt] = useState(todo.txt)
    const { isDone, id } = todo

    return (
        <section className="todo-preview flex align-center">
            <input
                onChange={() => { onToggleTodo(todo) }}
                type="checkbox"
                checked={isDone ? 'checked' : ''}
            />

            { txt && (
                <input
                    type="text"
                    value={txt}
                    className={`preview-txt ${isDone && 'done'}`}
                    onChange={(evt) => setTxt(evt.target.value)}
                    onBlur={() => { onEditTodo(todo, txt) }}
                />
            )}

            <div className="badges-container flex">
                <FaTrash
                    className="trash-icon"
                    onClick={() => { onRemoveTodo(id) }}
                />
            </div>
        </section>
    )
}