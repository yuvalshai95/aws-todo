import { useState } from 'react';
export function AddTodo({ onAddTodo }) {
    const [newTodoTxt, setNewTodoTxt] = useState('')

    const addTodo = () => {
        const todo = {
            txt: newTodoTxt,
            isDone: false
        }
        onAddTodo(todo)
    }

    return (
        <section className="add-todo flex">
            <input
                type="text"
                placeholder="Add new todo"
                value={newTodoTxt}
                onChange={(evt) => { setNewTodoTxt(evt.target.value) }}
            />
            <button className="add-btn primary-btn" onClick={() => {
                if (!newTodoTxt) return
                addTodo()
                setNewTodoTxt('')
            }}
            >
                Add
            </button>
        </section>
    )
}