import { useState, useEffect, useRef, Fragment } from 'react'

// Services
import { eventBusService } from '../services/event-bus.service.js'

// Icons
import { MdOutlineClose } from 'react-icons/md'

export function UserMsg() {
    const [msg, setMsg] = useState(null)
    const timeoutId = useRef();

    useEffect(() => {
        const removeEvent = eventBusService.on('show-user-msg', (msg) => {
            setMsg({ ...msg })
            if (timeoutId.current) clearTimeout(timeoutId.current)
            timeoutId.current = setTimeout(() => {
                setMsg(null)
            }, 2500)
        })

        return () => {
            removeEvent()
            clearTimeout(timeoutId.current)
        }
    }, [])

    const onCloseMsg = () => {
        clearTimeout(timeoutId.current)
        setMsg(null)
    }

    if (!msg) return <Fragment></Fragment>
    return (
        <section className={`user-msg ${msg.type}`}>
            <button
                className="close-btn"
                onClick={onCloseMsg}
            >
                <MdOutlineClose className='close-icon' />
            </button>
            {msg.txt}
        </section>
    )
}