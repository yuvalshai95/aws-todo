export function ProgressBar({ progress }) {
    const style = {
        width: `${progress}%`,
        backgroundColor: `${progress === 100 ? '#65D191' : ''}`
    }
    return (
        <div className="progress-bar">
            <div className="progress-bar-track">
                <div className="progress" style={style}>
                    {!progress ? 0 : progress.toFixed(1)}%
                </div>
            </div>
        </div>
    )
}